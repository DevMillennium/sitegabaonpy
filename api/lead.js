import { STORE_FACTS } from "./store-facts.js";

function sanitize(str, max) {
  return String(str == null ? "" : str)
    .trim()
    .slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    res.status(503).json({
      error:
        "Registro de leads no está configurado en el servidor. Escribinos por WhatsApp: " +
        STORE_FACTS.whatsappDisplay
    });
    return;
  }

  const body = req.body || {};
  const nombre = sanitize(body.nombre, 200);
  const telefono = sanitize(body.telefono, 80);
  const ciudad = sanitize(body.ciudad, 120) || "Paraguay";
  const producto = sanitize(body.producto, 200) || "Garbaon — consulta chat";
  const variante_ab = body.variante_ab === "B" ? "B" : "A";
  const pageUrl = sanitize(body.url, 500);
  const email = sanitize(body.email, 200);
  const consentimiento = Boolean(body.consentimiento_privacidad);

  if (!nombre || !telefono) {
    res.status(400).json({ error: "Nombre y teléfono son obligatorios." });
    return;
  }
  if (!consentimiento) {
    res.status(400).json({ error: "Se requiere aceptar el tratamiento de datos según la política del sitio." });
    return;
  }

  const row = {
    nombre,
    telefono,
    ciudad,
    producto,
    variante_ab,
    origen: "chat_fernanda",
    url: pageUrl || null,
    user_agent: sanitize(req.headers["user-agent"], 400) || null,
    consentimiento_privacidad: true
  };

  if (email) {
    row.email = email;
  }

  const ins = await fetch(`${url.replace(/\/$/, "")}/rest/v1/landing_leads`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(row)
  });

  if (!ins.ok) {
    const detail = await ins.text();
    if (ins.status === 400 && detail.includes("email") && email) {
      delete row.email;
      const retry = await fetch(`${url.replace(/\/$/, "")}/rest/v1/landing_leads`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(row)
      });
      if (retry.ok) {
        res.status(200).json({ ok: true, note: "email_omitido_esquema" });
        return;
      }
    }
    res.status(502).json({
      error: "No se pudo guardar el contacto. Escribinos por WhatsApp.",
      detail: detail.slice(0, 180)
    });
    return;
  }

  res.status(200).json({ ok: true });
}
