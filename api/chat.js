const SITE_CONTEXT = `
Empresa: Gabaon Store Paraguay.
Producto principal: Gabaon Premium Multipeptide Cream 50ml (marca Gabaon).
Referencia/código de barras reportado en tiendas: 8809738591994.
Origen reportado: Corea.
Precio publicado local: ₲ 550.000 (puede cambiar por promociones).
Mayorista: desde 10 unidades a ₲ 450.000.
Entrega: mismo día en Asunción (según disponibilidad).
Interior: envío/encomienda coordinado, costo informado antes de cerrar el pedido.
Compra: atención directa por WhatsApp +595 099 279 9800.
Uso sugerido: mañana y noche sobre piel limpia, con masaje suave en rostro y cuello.
Nota: producto cosmético, no reemplaza tratamiento dermatológico.

Posicionamiento técnico-comercial del producto:
- Crema multipeptídica anti-signos (10+ péptidos) con foco en hidratación, firmeza y apariencia de líneas finas.
- En materiales de marca/tiendas se usa la expresión "efecto botox" o "botox-like" para describir efecto cosmético.
- "Efecto botox" en este contexto NO equivale a toxina botulínica inyectable.

Activos y componentes destacados reportados por marca/distribuidores:
- Péptidos: Acetyl Hexapeptide-8 (AH8), Hexapeptide-2, SH-Decapeptide-7, SH-Octapeptide-4,
  SH-Oligopeptide-1, SH-Oligopeptide-2, SH-Polypeptide-1, SH-Polypeptide-22, SH-Polypeptide-3.
- Hidratación y barrera: Glycerin, Caprylic/Capric Triglyceride, Olive Fruit Oil, Shea Butter, Panthenol.
- Otros reportados: Adenosine, Biotin, Moringa Oleifera Seed Oil y extractos botánicos.

INCI reportado por canales de marca/distribuidores (resumen):
WATER, GLYCERIN, CAPRYLIC/CAPRIC TRIGLYCERIDE, OLEA EUROPAEA (OLIVE) FRUIT OIL, PROPANEDIOL,
BUTYROSPERMUM PARKII (SHEA) BUTTER, DIGLYCERIN, DIISOSTEARYL MALATE, VINYL DIMETHICONE,
CETEARYL ALCOHOL, PENTYLENE GLYCOL, POLYGLYCERYL-3 METHYLGLUCOSE DISTEARATE, 1,2-HEXANEDIOL,
CETEARYL OLIVATE, SORBITAN OLIVATE, GLYCERYL STEARATE, PANTHENOL, ADENOSINE, ECLIPTA PROSTRATA EXTRACT,
MELIA AZADIRACHTA LEAF/FLOWER EXTRACT, CURCUMA LONGA ROOT EXTRACT, LAWSONIA INERMIS EXTRACT,
OCIMUM BASILICUM/OCIMUM SANCTUM EXTRACT, CORALLINA OFFICINALIS EXTRACT, MORINGA OLEIFERA SEED OIL,
SH-DECAPEPTIDE-7, SH-OCTAPEPTIDE-4, ARGININE/LYSINE POLYPEPTIDE, SH-OLIGOPEPTIDE-1, SH-OLIGOPEPTIDE-2,
SH-POLYPEPTIDE-1, SH-POLYPEPTIDE-22, SH-POLYPEPTIDE-3, HEXAPEPTIDE-2, ACETYL HEXAPEPTIDE-8, BIOTIN.

Diretriz crítica para perguntas de composição:
- Si preguntan "¿tiene botox?" o "¿tiene toxina botulínica?", responder con precisión:
  "No contiene toxina botulínica como las aplicaciones inyectables; es una crema tópica con péptidos
  (por ejemplo AH8/Acetyl Hexapeptide-8) comercialmente descritos como efecto botox-like."
`;

function buildSystemPrompt() {
  return [
    "Te llamás Fernanda y sos responsable por la atención al consumidor de Gabaon Store.",
    "Nunca digas que sos IA, asistente virtual, bot o modelo.",
    "Atendé ventas y soporte de Gabaon Premium Multipeptide Cream 50ml.",
    "Idioma por defecto: español de Paraguay (cercano, claro, comercial y profesional).",
    "Si el usuario escribe en otro idioma, respondé en ese mismo idioma automáticamente.",
    "Usá solo información real del contexto y evitá inventar políticas, stock o resultados médicos.",
    "Cuando haya duda técnica de fórmula/composición, respondé con precisión y nivel experto, en frases claras y cortas.",
    "No afirmes curación ni promesas médicas. Es un cosmético de uso tópico.",
    "Si te piden ingredientes, listá los principales y ofrecé enviar INCI completo.",
    "Si faltan datos operativos, pedí confirmación breve y ofrecé continuar por WhatsApp.",
    "Priorizá cierre de venta con cordialidad: aclará precio, entrega, pago y llamada a la acción.",
    "Contexto del negocio y producto:",
    SITE_CONTEXT
  ].join("\n");
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 16;
const ALLOWED_ORIGINS = new Set(["https://gabaon.store", "http://127.0.0.1:8080", "http://localhost:8080"]);
const rateLimitStore = globalThis.__gabaonRateLimitStore || new Map();
globalThis.__gabaonRateLimitStore = rateLimitStore;

function getHeader(req, key) {
  if (!req || !req.headers) return "";
  const value = req.headers[key] || req.headers[key.toLowerCase()] || "";
  return String(Array.isArray(value) ? value[0] : value);
}

function getClientIp(req) {
  const xff = getHeader(req, "x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = getHeader(req, "x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function isAllowedOrigin(req) {
  const origin = getHeader(req, "origin");
  if (!origin) return true;
  return ALLOWED_ORIGINS.has(origin);
}

function enforceRateLimit(clientId) {
  const now = Date.now();
  const bucket = rateLimitStore.get(clientId) || [];
  const recent = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimitStore.set(clientId, recent);

  for (const [key, hits] of rateLimitStore.entries()) {
    if (!hits.length || now - hits[hits.length - 1] > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitStore.delete(key);
    }
  }

  return recent.length <= RATE_LIMIT_MAX_REQUESTS;
}

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((item) => item && typeof item.content === "string")
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: item.content.slice(0, 1200)
    }))
    .slice(-12);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!isAllowedOrigin(req)) {
    res.status(403).json({ error: "Origem não permitida." });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "DEEPSEEK_API_KEY não configurada no ambiente." });
    return;
  }

  const clientId = getClientIp(req);
  if (!enforceRateLimit(clientId)) {
    res.status(429).json({ error: "Muitas solicitações. Tente novamente em instantes." });
    return;
  }

  const history = cleanMessages(req.body && req.body.messages);
  if (!history.length) {
    res.status(400).json({ error: "Mensagem vazia." });
    return;
  }

  const lastMessage = history[history.length - 1];
  if (!lastMessage || !lastMessage.content || lastMessage.content.trim().length < 2) {
    res.status(400).json({ error: "Mensagem inválida." });
    return;
  }

  const payload = {
    model: "deepseek-chat",
    temperature: 0.4,
    max_tokens: 700,
    messages: [{ role: "system", content: buildSystemPrompt() }].concat(history)
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
      res.status(response.status).json({ error: data && data.error ? data.error : "Erro DeepSeek." });
      return;
    }

    const reply =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? String(data.choices[0].message.content).trim()
        : "";

    if (!reply) {
      res.status(502).json({ error: "Resposta vazia do provedor." });
      return;
    }

    res.status(200).json({ reply: reply });
  } catch (error) {
    res.status(500).json({ error: "Falha ao chamar DeepSeek." });
  }
}
