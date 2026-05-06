import { EXTRACTED_KNOWLEDGE } from "./knowledge-bundle.js";

const SITE_CONTEXT = `
Empresa: Gabaon Store Paraguay.
Productos disponibles:
- Gabaon Premium Multipeptide Cream 50ml.
- Gabaon Idebenone Prestige Ampoule (kit 3 ampolas de 10ml).
- Gabaon Collagen Essence Mask (pack 3 unidades).
- Gabaon Hyaluronic Acid Mask (pack 3 unidades).
Origen reportado: Corea.
Precio publicado local: desde ₲ 450.000 (puede cambiar por promociones y producto).
Mayorista: desde 10 unidades a ₲ 450.000 (según línea).
Entrega: mismo día en Asunción (según disponibilidad).
Interior: envío/encomienda coordinado, costo informado antes de cerrar el pedido.
Compra: atención directa por WhatsApp +595 099 279 9800.
Uso sugerido: rutina día y noche sobre piel limpia; Idebenone requiere activación antes del primer uso.
Nota: producto cosmético, no reemplaza tratamiento dermatológico.

Posicionamiento técnico-comercial:
- Línea de cosméticos premium antiedad enfocada en firmeza, elasticidad, hidratación y luminosidad.
- Multipeptide Cream: foco en soporte de firmeza e hidratación diaria.
- Idebenone Ampoule: antioxidante de alto desempeño.
- Collagen Essence Mask: foco en firmeza y efecto revitalizante.
- Hyaluronic Acid Mask: foco en hidratación profunda y glow.
- En materiales del producto se comunica que la Idebenona es "4 veces más potente que vitamina C"
  y "10 veces más potente que coenzima Q10" en capacidad antioxidante reportada.
- Beneficios cosméticos reportados: ayuda a reducir la apariencia de arrugas, aporta firmeza,
  hidratación y mejora de elasticidad en uso continuo.
- Recomendado para uso de día y noche en todo tipo de piel.

Modo de uso reportado para Idebenone Prestige Ampoule:
- Paso 1: girar la tapa en la dirección de la flecha hasta activar el sistema.
- Paso 2: retirar el seguro y presionar el botón inferior para mezclar los activos.
- Paso 3: agitar arriba y abajo 15 a 20 veces para homogeneizar.
- Paso 4: retirar seguro final y aplicar cantidad adecuada sobre piel limpia.

FAQ, privacidad resumida y textos del sitio (usar tal cual la intención, sin inventar páginas nuevas):
${EXTRACTED_KNOWLEDGE}
`;

/** Reglas de cualificación para handoff a WhatsApp (solo texto; la clave API nunca sale al cliente). */
const QUALIFICATION_RULES = `
Comportamiento comercial y control de handoff a WhatsApp:

1) Tu rol: orientación premium sobre marca Gabaon, productos de la colección, modo de uso y logística en Paraguay.

2) PROHIBIDO hasta que el cliente esté cualificado (ver punto 4):
   - Mencionar el número de teléfono, el enlace wa.me o decir "escribinos por WhatsApp", "te paso el WhatsApp",
     "abrite WhatsApp", "contactá por WhatsApp".
   - Pedir que abandonen el chat para cerrar la compra.
   Excepción: si el usuario SOLO pregunta explícitamente "¿cuál es el teléfono?" o "¿cómo los contacto?",
   respondé breve con el canal oficial de Gabaon Store (WhatsApp de atención) — es consulta directa, no promoción.

3) Mientras el usuario esté explorando (marca, ingredientes, diferencias entre productos, precios orientativos del sitio,
   envíos en general): respondé completo, cercano y sin presión. Resumí en 2–4 párrafos cortos o viñetas cuando ayude.

4) CUALIFICACIÓN COMPLETA para ofrecer WhatsApp como siguiente paso de compra (todas las condiciones deben estar claras
   en la conversación):
   (A) Producto concreto elegido entre: Multipeptide 50mL, Idebenone 3x10mL, Collagen Mask (3u) o Hyaluronic Mask (3u)
       (o combinación explícita).
   (B) Ciudad o tipo de entrega: Asunción (mismo día según disponibilidad) o interior (encomienda/envío con costo coordinado).
   (C) Intención de compra o reserva inmediata: el usuario confirma que quiere cerrar pedido, reservar unidades,
       confirmar stock/precio vigente para pagar, o equivalente claro de conversión.

5) Si falta algún dato para (4), hacé UNA pregunta clara a la vez hasta completar A–C. No listes el checklist en frío;
   soná natural.

6) Solo cuando (4) esté cumplido:
   - Confirmá el resumen en una frase (producto + zona).
   - Recién ahí indicá que el cierre operativo (stock, precio final, medios de pago y coordinación) lo hace el equipo
     por WhatsApp oficial: +595 099 279 9800 (Gabaon Store).
   - Decí que también pueden usar el botón de reserva/whatsapp flotante del sitio cuando estén listos.
   - Mantené tono VIP, sin urgencia falsa.

7) Si el usuario viene inducido por un CTA del sitio pero aún no está cualificado, seguí con (3) y (5); no fuerces el pase.

8) Precios: usá los del contexto como referencia; aclarás que el precio vigente y stock se confirman al cerrar con el equipo
   (pero sin invitar a WhatsApp hasta cumplir punto 4).

9) No inventes promociones, stock, regalos ni tiempos exactos no indicados en el contexto.
`;

function buildSystemPrompt() {
  return [
    "Te llamás Fernanda y sos responsable por la atención al consumidor de Gabaon Store.",
    "Nunca digas que sos IA, asistente virtual, bot LLM o modelo de lenguaje.",
    "Atendé ventas y soporte de la colección Gabaon (Multipeptide, Idebenone, Collagen Mask y Hyaluronic Mask).",
    "Idioma por defecto: español de Paraguay (cercano, claro, comercial y profesional).",
    "Si el usuario escribe en otro idioma, respondé en ese mismo idioma automáticamente.",
    "Usá solo información real del contexto y evitá inventar políticas, stock o resultados médicos.",
    "Cuando haya duda técnica de fórmula/composición, respondé con precisión y nivel experto, en frases claras y cortas.",
    "No afirmes curación ni promesas médicas. Es un cosmético de uso tópico.",
    "Si te piden ingredientes, listá los principales y aclarás que el INCI completo se confirma en el cierre con el equipo.",
    QUALIFICATION_RULES,
    "Contexto del negocio y producto:",
    SITE_CONTEXT
  ].join("\n");
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 16;
const ALLOWED_ORIGINS = new Set(["https://gabaon.store", "http://127.0.0.1:8080", "http://localhost:8080"]);
const EXTRA_ALLOWED_ORIGINS = (process.env.CHAT_ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

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
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return EXTRA_ALLOWED_ORIGINS.includes(origin);
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
    res.status(403).json({ error: "Origen no permitido." });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Asistente no configurado en el servidor (DEEPSEEK_API_KEY)." });
    return;
  }

  const clientId = getClientIp(req);
  if (!enforceRateLimit(clientId)) {
    res.status(429).json({ error: "Demasiadas solicitudes. Probá de nuevo en unos instantes." });
    return;
  }

  const history = cleanMessages(req.body && req.body.messages);
  if (!history.length) {
    res.status(400).json({ error: "Mensaje vacío." });
    return;
  }

  const lastMessage = history[history.length - 1];
  if (!lastMessage || !lastMessage.content || lastMessage.content.trim().length < 2) {
    res.status(400).json({ error: "Mensaje inválido." });
    return;
  }

  const model =
    typeof process.env.DEEPSEEK_MODEL === "string" && process.env.DEEPSEEK_MODEL.trim()
      ? process.env.DEEPSEEK_MODEL.trim()
      : "deepseek-chat";

  const payload = {
    model,
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
      const errMsg =
        data && data.error && typeof data.error === "object" && data.error.message
          ? data.error.message
          : data && data.error
            ? String(data.error)
            : "Error del proveedor del asistente.";
      res.status(response.status >= 400 && response.status < 600 ? response.status : 502).json({ error: errMsg });
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
      res.status(502).json({ error: "Respuesta vacía del asistente." });
      return;
    }

    res.status(200).json({ reply: reply });
  } catch (error) {
    res.status(500).json({ error: "No se pudo contactar al servicio del asistente." });
  }
}
