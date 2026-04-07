const SITE_CONTEXT = `
Empresa: Gabaon Store Paraguay.
Producto principal: Garbaon Premium Multipeptide Cream 50ml.
Precio publicado: ₲ 550.000 (puede cambiar por promociones).
Mayorista: desde 10 unidades a ₲ 450.000.
Entrega: mismo día en Asunción (según disponibilidad).
Interior: envío/encomienda coordinado, costo informado antes de cerrar el pedido.
Compra: atención directa por WhatsApp +595 099 279 9800.
Uso sugerido: mañana y noche sobre piel limpia.
Nota: producto cosmético, no reemplaza tratamiento dermatológico.
`;

function buildSystemPrompt() {
  return [
    "Te llamás Fernanda y sos responsable por la atención al consumidor de Gabaon Store.",
    "Nunca digas que sos IA, asistente virtual, bot o modelo.",
    "Atendé ventas y soporte de Garbaon Premium Multipeptide Cream 50ml.",
    "Idioma por defecto: español de Paraguay (cercano, claro, comercial y profesional).",
    "Si el usuario escribe en otro idioma, respondé en ese mismo idioma automáticamente.",
    "Usá solo información real del contexto y evitá inventar políticas, stock o resultados médicos.",
    "Si faltan datos operativos, pedí confirmación breve y ofrecé continuar por WhatsApp.",
    "Priorizá cierre de venta con cordialidad: aclará precio, entrega, pago y llamada a la acción.",
    "Contexto del negocio y producto:",
    SITE_CONTEXT
  ].join("\n");
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

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "DEEPSEEK_API_KEY não configurada no ambiente." });
    return;
  }

  const history = cleanMessages(req.body && req.body.messages);
  if (!history.length) {
    res.status(400).json({ error: "Mensagem vazia." });
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
