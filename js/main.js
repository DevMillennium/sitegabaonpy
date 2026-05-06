const anio = document.getElementById("anio");
const videoEmpresa = document.getElementById("video-empresa");
const heroHeadline = document.getElementById("hero-headline");
const heroLead = document.getElementById("hero-lead");
const ctaComprar = document.getElementById("comprar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

const config = window.LANDING_CONFIG || {};
const numeroEmpresa = config.whatsappNumber || "595992799800";

function initAnalytics() {
  const gaId = config.ga4MeasurementId;
  const metaId = config.metaPixelId;

  if (gaId) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src =
      "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    document.head.appendChild(gaScript);
    gaScript.onload = function () {
      gtag("js", new Date());
      gtag("config", gaId);
    };
  }

  if (metaId) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    if (window.fbq) {
      window.fbq("init", metaId);
      window.fbq("track", "PageView");
    }
  }
}

function trackEvent(name, params) {
  const payload = params || {};
  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", name, payload);
  }
}

initAnalytics();

function initMobileNav() {
  if (!navToggle || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const willOpen = !navMenu.classList.contains("is-open");
    navMenu.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 940) closeMenu();
  });
}

initMobileNav();

const variants = {
  A: {
    headline: "Gabaon Luxury Skincare Collection",
    lead:
      "Colección premium con Multipeptide Cream, Idebenone Ampoule y máscaras de colágeno + ácido hialurónico.",
    cta: "Reservar por WhatsApp"
  },
  B: {
    headline: "Rutina de lujo para firmeza y luminosidad",
    lead:
      "Atención VIP en Paraguay para elegir entre crema multipeptídeos, ampollas Idebenone y máscaras premium.",
    cta: "Quiero mi asesoría VIP"
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
window.garbaonAbVariant = activeVariant;

function buildWhatsAppUrl() {
  const mensaje =
    "Hola Gabaon Store, quiero información sobre la colección completa (Multipeptide Cream, Idebenone Ampoule, Collagen Mask e Hyaluronic Acid Mask). " +
    `Variante landing: ${activeVariant}.`;
  return `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(mensaje)}`;
}

function buildWhatsAppUrlByIntent(intent) {
  const messages = {
    "multipeptide-cream-50ml":
      "Hola Gabaon Store, quiero reservar Premium Multipeptide Cream 50mL. ¿Precio final y entrega hoy en Asunción?",
    "idebenone-ampoule-3x10ml":
      "Hola Gabaon Store, quiero reservar Idebenone Prestige Ampoule 3x10mL. ¿Precio final y disponibilidad?",
    "collagen-essence-mask-3u":
      "Hola Gabaon Store, quiero reservar Collagen Essence Mask (3 unidades). ¿Precio final y envío?",
    "hyaluronic-acid-mask-3u":
      "Hola Gabaon Store, quiero reservar Hyaluronic Acid Mask (3 unidades). ¿Precio final y envío?",
    "catalogo-completo":
      "Hola Gabaon Store, quiero el catálogo completo con recomendación para mi piel (Multipeptide, Idebenone, Collagen Mask e Hyaluronic Mask).",
    "asesoria-vip":
      "Hola Gabaon Store, quiero una asesoría VIP para elegir mi rutina ideal y cerrar compra hoy."
  };
  const message = messages[intent] || messages["catalogo-completo"];
  return `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(`${message} Variante landing: ${activeVariant}.`)}`;
}

function wireWhatsAppLinks() {
  document.querySelectorAll(".js-wa-link").forEach((el) => {
    const intent = el.getAttribute("data-wa-product");
    el.href = intent ? buildWhatsAppUrlByIntent(intent) : buildWhatsAppUrl();
  });
}

if (heroHeadline) heroHeadline.textContent = variantData.headline;
if (heroLead) heroLead.textContent = variantData.lead;
if (ctaComprar) ctaComprar.textContent = variantData.cta;

wireWhatsAppLinks();

document.querySelectorAll(".js-goal-wa").forEach((button) => {
  button.addEventListener("click", () => {
    const goal = button.getAttribute("data-goal");
    const map = {
      "firmeza-lineas": "multipeptide-cream-50ml",
      "antioxidante-manchas": "idebenone-ampoule-3x10ml",
      "firmeza-semanal": "collagen-essence-mask-3u",
      "hidratacion-intensa": "hyaluronic-acid-mask-3u"
    };
    const intent = map[goal] || "catalogo-completo";
    window.open(buildWhatsAppUrlByIntent(intent), "_blank", "noopener,noreferrer");
    trackEvent("goal_diagnostic_selected", { variant: activeVariant, goal: goal || "unknown", intent });
  });
});

if (anio) {
  anio.textContent = String(new Date().getFullYear());
}

function emitVariantToAnalytics() {
  trackEvent("ab_variant_exposed", {
    variant: activeVariant,
    test_name: "garbaon_hero_copy"
  });
}

window.addEventListener("load", () => {
  setTimeout(emitVariantToAnalytics, 500);
});

if (videoEmpresa) {
  const playVideoWhenVisible = async () => {
    videoEmpresa.muted = false;
    videoEmpresa.volume = 1;
    try {
      await videoEmpresa.play();
    } catch (error) {
      videoEmpresa.muted = true;
      try {
        await videoEmpresa.play();
      } catch (fallbackError) {
        // Controles disponibles para reproducción manual.
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

document.querySelectorAll(".js-wa-link").forEach((el) => {
  el.addEventListener("click", () => {
    const location =
      el.getAttribute("data-wa-location") || (el.id === "whatsapp-float" ? "floating" : "cta");
    trackEvent("whatsapp_open", {
      variant: activeVariant,
      location: location
    });
  });
});
