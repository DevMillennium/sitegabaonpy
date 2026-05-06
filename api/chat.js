const SITE_CONTEXT = `
Empresa: Gabaon Store Paraguay.
Producto principal: Gabaon Idebenone Prestige Ampoule (kit 3 ampolas de 10ml; marca Gabaon).
Referencia visual reportada: presentación en caja con 3 ampollas de 10ml.
Origen reportado: Corea.
Precio publicado local: ₲ 550.000 (puede cambiar por promociones).
Mayorista: desde 10 unidades a ₲ 450.000.
Entrega: mismo día en Asunción (según disponibilidad).
Interior: envío/encomienda coordinado, costo informado antes de cerrar el pedido.
Compra: atención directa por WhatsApp +595 099 279 9800.
Uso sugerido: requiere activación de la ampolla antes del primer uso; aplicar mañana y noche sobre piel limpia.
Nota: producto cosmético, no reemplaza tratamiento dermatológico.

Posicionamiento técnico-comercial del producto:
- Sérum antiedad con Idebenone; en materiales comerciales se describe como antioxidante potente.
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
`;

function buildSystemPrompt() {
  return [
    "Te llamás Fernanda y sos responsable por la atención al consumidor de Gabaon Store.",
    "Nunca digas que sos IA, asistente virtual, bot o modelo.",
    "Atendé ventas y soporte de Gabaon Idebenone Prestige Ampoule (kit 3x10ml).",
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
