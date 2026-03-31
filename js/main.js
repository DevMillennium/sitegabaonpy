const form = document.getElementById("formulario");
const formMsg = document.getElementById("form-msg");
const anio = document.getElementById("anio");
const videoEmpresa = document.getElementById("video-empresa");
const heroHeadline = document.getElementById("hero-headline");
const heroLead = document.getElementById("hero-lead");
const ctaComprar = document.getElementById("comprar");

const config = window.LANDING_CONFIG || {};
const numeroEmpresa = config.whatsappNumber || "595000000000";
const supabaseUrl = config.supabaseUrl || "";
const supabaseAnonKey = config.supabaseAnonKey || "";
const supabaseTable = config.supabaseTable || "landing_leads";

const variants = {
  A: {
    headline: "Garbaon Premium Multipeptide Cream",
    lead:
      "Cuidado facial avanzado de origen coreano con distribución local de Phoenix Global Import.",
    cta: "Reservar por WhatsApp"
  },
  B: {
    headline: "Piel más firme e hidratada con rutina premium",
    lead:
      "Descubrí Garbaon 50ml con experiencia de compra local en Paraguay junto a Phoenix Global Import.",
    cta: "Quiero mi Garbaon hoy"
  }
};

function getOrCreateVariant() {
  const key = "garbaon_ab_variant";
  const saved = window.localStorage.getItem(key);
  if (saved === "A" || saved === "B") return saved;
  const next = Math.random() < 0.5 ? "A" : "B";
  window.localStorage.setItem(key, next);
  return next;
}

const activeVariant = getOrCreateVariant();
const variantData = variants[activeVariant];

if (heroHeadline) heroHeadline.textContent = variantData.headline;
if (heroLead) heroLead.textContent = variantData.lead;
if (ctaComprar) ctaComprar.textContent = variantData.cta;

if (anio) {
  anio.textContent = String(new Date().getFullYear());
}

if (videoEmpresa) {
  const playVideoWhenVisible = async () => {
    videoEmpresa.muted = false;
    videoEmpresa.volume = 1;
    try {
      await videoEmpresa.play();
    } catch (error) {
      // Fallback for strict autoplay policies.
      videoEmpresa.muted = true;
      try {
        await videoEmpresa.play();
      } catch (fallbackError) {
        // Keep controls available for manual play.
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        playVideoWhenVisible();
      } else {
        videoEmpresa.pause();
      }
    },
    { threshold: 0.55 }
  );

  observer.observe(videoEmpresa);
}

function getSupabaseClient() {
  const hasCreds = supabaseUrl && supabaseAnonKey;
  const factory = window.supabase && window.supabase.createClient;
  if (!hasCreds || typeof factory !== "function") return null;
  return factory(supabaseUrl, supabaseAnonKey);
}

async function saveLead(lead) {
  const client = getSupabaseClient();
  if (!client) return { ok: false, reason: "supabase_not_configured" };

  const { error } = await client.from(supabaseTable).insert([lead]);
  if (error) {
    return { ok: false, reason: error.message };
  }
  return { ok: true };
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = String(form.nombre.value || "").trim();
    const telefono = String(form.telefono.value || "").trim();
    const ciudad = String(form.ciudad.value || "").trim();
    const submitButton = form.querySelector("button[type='submit']");

    if (!nombre || !telefono || !ciudad) {
      formMsg.textContent = "Completá todos los campos para continuar.";
      return;
    }

    const lead = {
      nombre,
      telefono,
      ciudad,
      producto: "Garbaon Premium Multipeptide Cream 50ml",
      variante_ab: activeVariant,
      origen: "landing_garbaon_py",
      url: window.location.href,
      user_agent: navigator.userAgent
    };

    if (submitButton) submitButton.disabled = true;
    formMsg.textContent = "Procesando...";

    const saved = await saveLead(lead);

    const mensaje =
      "Hola Phoenix Global Import, quiero reservar Garbaon Premium Multipeptide Cream. " +
      `Nombre: ${nombre}. WhatsApp: ${telefono}. Ciudad: ${ciudad}. Variante: ${activeVariant}.`;

    const url = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensaje)}`;

    if (saved.ok) {
      formMsg.textContent = "Lead guardado. Abriendo WhatsApp...";
    } else {
      formMsg.textContent = "Abriendo WhatsApp...";
    }

    window.open(url, "_blank", "noopener,noreferrer");
    if (submitButton) submitButton.disabled = false;
  });
}
