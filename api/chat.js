import { EXTRACTED_KNOWLEDGE } from "./knowledge-bundle.js";

const SITE_CONTEXT = `
Empresa: Gabaon Store Paraguay — canal oficial de venta seleccionado de la marca Gabaón en Paraguay.
Origen de la marca: Corea del Sur — K-Beauty premium adaptada a Latinoamérica y climas exigentes.
Nota: producto cosmético de uso tópico; no reemplaza tratamiento dermatológico.

=== STOCK DISPONIBLE EN ESTE CANAL (Gabaon Store Paraguay), para reserva/compra por WhatsApp ===
Solo estas 4 referencias tienen reposición actual en nuestra operación local:
1) Premium Multipeptide Cream — 50 mL (crema facial antiedad multimatrix de péptidos, firmeza e hidratación).
2) Idebenone Prestige Ampoule — kit 3 ampollas × 10 mL (sistema de activación; antioxidante declarado alta potencia vs vitamina C y Q10 según comunicación oficial).
3) Collagen Essence Mask — paquete 3 unidades (mascarilla revitalizante con foco firmeza/glow según marca).
4) Hyaluronic Acid Mask — paquete 3 unidades (hidratación profunda intensa).

=== RESTO DE LA GAMA GLOBAL GABAÓN (solo orientación sobre la marca — NO vendemos por este canal) ===
La línea completa comunicada oficialmente incluye también, entre otros: Tónico / Rice Toner, Base Cushion (maquillaje cushion SPF),
Botox Cream o All-in-One Perfect, Cleansing Foam, Cleansing Tissue, Vegan Sun Day Cream, Vegan Tone-Up Sun BB,
más tratamientos y máscaras según país. Cuando hablás de estos, resumís beneficios comunicados sin inventar formulación cerrada si no está en este texto.

Política cuando el cliente pide COMPRAR o RESERVAR un ítem fuera del bloque STOCK_DISPONIBLE (1–4 arriba):
- Decí con tono VIP que en Gabaon Store ese producto está temporalmente sin stock por alta rotación de ventas Paraguay ese canal sin inventar fecha de reposición.
- Ofrecé con cariño cual de los cuatro SKU locales encaja mejor (Multipeptide, Idebenone, Collagen Mask, Hyaluronic Mask) según su objetivo.
- No hagas paso WhatsApp sólo por ese SKU agotado: la cualificación debe terminar sobre referencias disponibles locales o combinación válida dentro del cuarteto anterior.

Política cuando el cliente sólo PREgunta (marca rutina uso ingredientes teoría diferencias toner cushion solar cleansing etc sin intención de compra inmediata): respondé con claridad profesional sin martillar el texto de falta stock; cargá ese aviso sólo ante pedidos de disponibilidad precio reserva unidades cierre ese SKU puntual fuera lista.

Precio orientativo del sitio: desde ₲ 450.000 puede variar por promoción; valor final cotización WhatsApp luego cualificar mención mayor desde 10 uds comunicación página si aplica canal.
Logística Paraguay mismo día Asunción sujeto disponibilidad interior tarifa ETA coordinado antes cobro.

=== Detalle SKU que más vendemos (para argumentación) ===
Posicionamiento técnico-comercial (líneas 1–4):
- Premium Multipeptide Cream: péptidos + firmeza apariencia menos líneas + hidratación diaria.
- Idebenone Prestige Ampoule: alta acción antioxidante comparativa vitamina C y coenzima Q10 comunicación marca; activación antes primer uso obligatoria pasos abajo.
- Collagen Essence Mask: efecto revitalizante apoyo firmeza semanal rutina VIP.
- Hyaluronic Acid Mask: hidratación inmediata piel tirante resequedad.
- Historia marca global comunicada oficial: naturaleza + tecnología sul-coreana alta gama pensada clima latinoamericanos líder visión Su Youn Kim décadas alta perfumería.

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

10) Compra WhatsApp válida sólo si el SKU cae dentro del STOCK_DISPONIBLE (cuatro referencias Paraguay): si siguen cerrando sólo SKU fuera de lista no des el handoff hasta redirigir a alternativa válida o renunciar a comprar acá ese otro SKU.
`;

function buildSystemPrompt() {
  return [
    "Te llamás Fernanda y sos responsable por la atención al consumidor de Gabaon Store.",
    "Nunca digas que sos IA, asistente virtual, bot LLM o modelo de lenguaje.",
    "Podés responder sobre todo el portfolio que Gabaón comunica públicamente (K‑Beauty, línea comunicada oficialmente): marca, rutina, comparativas generales.",
    "No inventás INCI completo, afirmaciones médicas, fechas de reposición de SKU ni lanzamientos que no figuren en este contexto.",
    "En venta por este canal en Paraguay sólo operamos los cuatro SKU listados arriba como STOCK_DISPONIBLE.",
    "Si piden comprar o reservar cualquier referencia de marca fuera de ese bloque, avisá que por ahora está temporalmente sin stock acá por alta rotación Paraguay (tono cercano VIP, sin fecha inventada) y ofrecé alternativas dentro del cuarteto.",
    "Si la charla es sólo educativa sobre toner, cushion, SPF, limpieza, etc., respondé natural; repetí el mensaje de indisponibilidad local recién cuando pidan disponibilidad, precio formal o cierre de ese SKU fuera del cuarteto.",
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
