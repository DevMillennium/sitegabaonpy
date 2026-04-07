import { STORE_FACTS, formatFactsForPrompt } from "./store-facts.js";
import { EXTRACTED_KNOWLEDGE } from "./knowledge-bundle.js";

const MAX_BODY_CHARS = 80000;
const MAX_MSG_LEN = 1200;
const MAX_HISTORY = 14;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 28;

const rateBucket = new Map();

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) {
    return xf.split(",")[0].trim().slice(0, 64);
  }
  if (req.socket && req.socket.remoteAddress) {
    return String(req.socket.remoteAddress).slice(0, 64);
  }
  return "unknown";
}

function checkRate(ip) {
  const now = Date.now();
  let b = rateBucket.get(ip);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateBucket.set(ip, b);
  }
  b.count += 1;
  if (b.count > RATE_MAX) return false;
  if (rateBucket.size > 5000) {
    for (const [k, v] of rateBucket) {
      if (now > v.resetAt) rateBucket.delete(k);
    }
  }
  return true;
}

const ORCHESTRATOR_SCHEMA = `{
  "language": "es-PY | pt-BR | en",
  "intent": "greeting | product_info | compare | price | stock | shipping | payment | quote | order_status | support | return_exchange | complaint | human_handoff | institutional | lead",
  "sentiment": "positive | neutral | negative | urgent",
  "user_goal": "string",
  "needed_data": ["strings opcionales"],
  "answer": "texto listo para el cliente, sin JSON",
  "cta": "siguiente paso sugerido, breve",
  "collect_lead": false,
  "lead_fields": ["name","phone","email","city"],
  "handoff": false,
  "handoff_reason": "",
  "wa_prefill": "mensaje corto sugerido para WhatsApp cuando handoff sea true o para CTA"
}`;

function buildSystemPrompt() {
  return [
    "Sos Fernanda, responsable por la atención al consumidor de Gabaon Store.",
    "Si preguntan si sos humana, respondé en answer que sos la asistente virtual Fernanda de Gabaon Store y que estás para ayudar.",
    "No digas que sos un modelo de lenguaje, IA genérica ni bot.",
    "Idioma por defecto del answer y cta: español de Paraguay (cercano, claro, comercial).",
    "Detectá el idioma del usuario y respondé en ese idioma en answer y cta.",
    "Usá solo información del contexto de negocio y del bloque CONOCIMIENTO_DEL_SITIO. No inventes stock, precios distintos, plazos ni políticas.",
    "Si faltan datos operativos, decilo en answer, listá en needed_data y ofrecé WhatsApp.",
    "Priorizá venta y soporte con cordialidad.",
    "Reclamaciones o casos sensibles (pagos, salud grave, legal): handoff true y wa_prefill útil.",
    "",
    "=== CONTEXTO_NEGOCIO ===",
    formatFactsForPrompt(),
    "",
    "=== CONOCIMIENTO_DEL_SITIO (FAQ y políticas extraídas del sitio) ===",
    EXTRACTED_KNOWLEDGE,
    "",
    "Tu salida DEBE ser únicamente un objeto JSON válido (sin markdown, sin texto fuera del JSON).",
    "Claves del objeto JSON:",
    ORCHESTRATOR_SCHEMA,
    "Reglas: answer es lo único que ve el cliente como mensaje principal; cta es opcional pero recomendado; wa_prefill breve, en el mismo idioma que el usuario."
  ].join("\n");
}

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((item) => item && typeof item.content === "string" && item.content.trim())
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: item.content.trim().slice(0, MAX_MSG_LEN)
    }))
    .slice(-MAX_HISTORY);
}

function parseOrchestratorJson(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        return null;
      }
    }
  }
  return null;
}

function normalizeOrchestration(parsed) {
  const o = parsed && typeof parsed === "object" ? parsed : {};
  const answer =
    typeof o.answer === "string" && o.answer.trim()
      ? o.answer.trim()
      : "Disculpá, no pude generar una respuesta clara. ¿Te parece si continuamos por WhatsApp?";

  const cta = typeof o.cta === "string" ? o.cta.trim() : "";
  const handoff = Boolean(o.handoff);
  const handoffReason = typeof o.handoff_reason === "string" ? o.handoff_reason.trim() : "";
  const collectLead = Boolean(o.collect_lead);
  const leadFields = Array.isArray(o.lead_fields)
    ? o.lead_fields.map((x) => String(x).toLowerCase()).filter(Boolean)
    : [];
  const waPrefill =
    typeof o.wa_prefill === "string" && o.wa_prefill.trim()
      ? o.wa_prefill.trim()
      : "";
  const language = typeof o.language === "string" ? o.language.trim() : "es-PY";
  const intent = typeof o.intent === "string" ? o.intent.trim() : "product_info";
  const sentiment = typeof o.sentiment === "string" ? o.sentiment.trim() : "neutral";
  const userGoal = typeof o.user_goal === "string" ? o.user_goal.trim() : "";
  const neededData = Array.isArray(o.needed_data) ? o.needed_data.map(String) : [];

  return {
    language,
    intent,
    sentiment,
    user_goal: userGoal,
    needed_data: neededData,
    answer,
    cta,
    collect_lead: collectLead,
    lead_fields: leadFields.length ? leadFields : collectLead ? ["name", "phone"] : [],
    handoff,
    handoff_reason: handoffReason,
    wa_prefill: waPrefill
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const ip = clientIp(req);
  if (!checkRate(ip)) {
    res.status(429).json({ error: "Demasiadas solicitudes. Probá de nuevo en un minuto." });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Servicio de chat no configurado (falta clave API)." });
    return;
  }

  let bodySize = 0;
  try {
    bodySize = JSON.stringify(req.body || {}).length;
  } catch {
    bodySize = MAX_BODY_CHARS + 1;
  }
  if (bodySize > MAX_BODY_CHARS) {
    res.status(413).json({ error: "Mensaje demasiado largo." });
    return;
  }

  const history = cleanMessages(req.body && req.body.messages);
  if (!history.length) {
    res.status(400).json({ error: "Mensaje vacío." });
    return;
  }

  const variant =
    req.body && (req.body.variant === "B" || req.body.variant === "A") ? req.body.variant : "A";
  const pageLang =
    req.body && typeof req.body.pageLang === "string" ? req.body.pageLang.slice(0, 12) : "";

  const sessionNote =
    (pageLang ? `Idioma declarado del sitio: ${pageLang}. ` : "") +
    `Variante landing A/B: ${variant}.`;

  const payload = {
    model: "deepseek-chat",
    temperature: 0.35,
    max_tokens: 1100,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "system", content: "Contexto de sesión (no repetir al cliente salvo que sea útil): " + sessionNote },
      ...history
    ]
  };

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      res
        .status(response.status)
        .json({ error: data && data.error ? String(data.error.message || data.error) : "Error del proveedor." });
      return;
    }

    const rawContent =
      data &&
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content
        ? String(data.choices[0].message.content)
        : "";

    const parsed = parseOrchestratorJson(rawContent);
    const orchestration = normalizeOrchestration(
      parsed || {
        answer:
          "Disculpá, hubo un inconveniente técnico. Si querés, continuamos por WhatsApp para atenderte al instante.",
        handoff: true,
        wa_prefill: "Hola Gabaon Store, escribo desde el chat de la web y necesito ayuda.",
        intent: "human_handoff",
        language: "es-PY"
      }
    );

    res.status(200).json({
      reply: orchestration.answer,
      orchestration,
      meta: {
        variant,
        whatsapp: STORE_FACTS.whatsappE164
      }
    });
  } catch {
    res.status(500).json({ error: "No se pudo completar la solicitud." });
  }
}
