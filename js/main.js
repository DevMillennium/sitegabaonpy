const anio = document.getElementById("anio");
const heroHeadline = document.getElementById("hero-headline");
const heroLead = document.getElementById("hero-lead");
const ctaComprar = document.getElementById("comprar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");

const config = window.LANDING_CONFIG || {};
const numeroEmpresa = config.whatsappNumber || "595992799800";

function getUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const out = {};
    keys.forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
    return out;
  } catch {
    return {};
  }
}

const utmSnapshot = getUtmParams();
const pagePath = window.location.pathname || "/";

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
      gtag("config", gaId, { send_page_view: true });
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
  const payload = Object.assign(
    {
      page_path: pagePath,
      ...utmSnapshot
    },
    params || {}
  );
  if (typeof window.gtag === "function") {
    window.gtag("event", name, payload);
  }
  if (typeof window.fbq === "function") {
    const metaMap = {
      click_whatsapp: "Contact",
      generate_lead: "Lead",
      view_product: "ViewContent",
      complete_skin_diagnostic: "Lead"
    };
    if (metaMap[name]) {
      window.fbq("track", metaMap[name], payload);
    } else {
      window.fbq("trackCustom", name, payload);
    }
  }
}

window.gabaonTrack = trackEvent;

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
    headline: "Combo Premium.\nApariencia más lisa y firme.",
    lead:
      "Idebenone Prestige Ampoule + Premium Multipeptide Cream. ₲ 699.000 · Stock limitado · Entrega en Asunción.",
    cta: "Pedí el tuyo"
  },
  B: {
    headline: "Ciencia coreana.\nUn combo, un precio.",
    lead:
      "Ampoule + Multipeptide Cream por ₲ 699.000. En Catedral, la crema sola lista ₲ 725.900.",
    cta: "Pedí el tuyo por WhatsApp"
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

const waMessages = {
  "multipeptide-cream-50ml":
    "Hola, vi Gabaon Premium Multipeptide Cream en gabaon.store y quiero confirmar disponibilidad para Asunción.",
  "idebenone-ampoule-3x10ml":
    "Hola, vi Gabaon Idebenone Prestige Ampoule en gabaon.store y quiero confirmar disponibilidad y precio.",
  "collagen-essence-mask-3u":
    "Hola, vi Collagen Essence Mask en gabaon.store y quiero reservar el pack de 3 unidades.",
  "hyaluronic-acid-mask-3u":
    "Hola, vi Hyaluronic Acid Mask en gabaon.store y quiero reservar el pack de 3 unidades.",
  "kit-firmeza":
    "Hola, quiero el kit Rutina firmeza (Multipeptide + Collagen Mask) visto en gabaon.store.",
  "kit-glow":
    "Hola, quiero el kit Glow intensivo (Idebenone + Hyaluronic Mask) visto en gabaon.store.",
  "combo-premium":
    "Hola, vi el Combo Premium Gabaon (Multipeptide Cream + Idebenone Prestige Ampoule) a ₲ 699.000 en gabaon.store y quiero confirmar disponibilidad para Asunción.",
  "catalogo-completo":
    "Hola Gabaon Store, quiero el catálogo completo con recomendación para mi piel.",
  "asesoria-vip":
    "Hola Gabaon Store, quiero asesoría VIP para elegir mi rutina y cerrar compra."
};

function attributionSuffix(location, product) {
  const bits = [
    `Página: ${pagePath}`,
    `Origen CTA: ${location || "unknown"}`,
    `Producto: ${product || "general"}`,
    `Variante: ${activeVariant}`
  ];
  if (utmSnapshot.utm_source) bits.push(`utm_source=${utmSnapshot.utm_source}`);
  if (utmSnapshot.utm_medium) bits.push(`utm_medium=${utmSnapshot.utm_medium}`);
  if (utmSnapshot.utm_campaign) bits.push(`utm_campaign=${utmSnapshot.utm_campaign}`);
  return `\n\n—\n${bits.join(" · ")}`;
}

function buildWhatsAppUrlByIntent(intent, location) {
  const message = waMessages[intent] || waMessages["catalogo-completo"];
  const full = message + attributionSuffix(location, intent);
  return `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(full)}`;
}

function wireWhatsAppLinks() {
  const bodyProduct = document.body.getAttribute("data-product-id");
  document.querySelectorAll(".js-wa-link").forEach((el) => {
    let intent = el.getAttribute("data-wa-product") || "catalogo-completo";
    if (
      (el.id === "whatsapp-float" || el.getAttribute("data-wa-location") === "floating") &&
      bodyProduct &&
      (intent === "asesoria-vip" || intent === "catalogo-completo")
    ) {
      intent = bodyProduct;
      el.setAttribute("data-wa-product", intent);
    }
    const location =
      el.getAttribute("data-wa-location") || (el.id === "whatsapp-float" ? "floating" : "cta");
    el.href = buildWhatsAppUrlByIntent(intent, location);
  });
}

if (heroHeadline) heroHeadline.innerHTML = variantData.headline.replace(/\n/g, "<br />");
if (heroLead) heroLead.textContent = variantData.lead;
if (ctaComprar) ctaComprar.textContent = variantData.cta;

wireWhatsAppLinks();

/* --- Multi-step skin diagnostic (non-medical) --- */
function initDiagnostic() {
  const root = document.getElementById("diagnostico-funnel");
  if (!root) return;

  const steps = [
    {
      key: "prioridad",
      question: "¿Cuál es tu prioridad?",
      options: [
        { id: "firmeza", label: "Firmeza y líneas finas" },
        { id: "glow", label: "Glow y antioxidante" },
        { id: "hidratacion", label: "Hidratación intensa" },
        { id: "complemento", label: "Cuidado semanal complementario" }
      ]
    },
    {
      key: "piel",
      question: "¿Cómo sentís tu piel?",
      options: [
        { id: "seca", label: "Seca o con tirantez" },
        { id: "mixta", label: "Mixta / normal" },
        { id: "sensible", label: "Sensible o reactiva" },
        { id: "opaca", label: "Opaca / sin luminosidad" }
      ]
    },
    {
      key: "rutina",
      question: "¿Qué tipo de rutina buscás?",
      options: [
        { id: "simple", label: "Simple (1–2 pasos)" },
        { id: "completa", label: "Completa (diario + semanal)" },
        { id: "intensiva", label: "Intensiva antiedad" }
      ]
    },
    {
      key: "formato",
      question: "¿Preferís tratamiento diario o cuidado complementario?",
      options: [
        { id: "diario", label: "Tratamiento diario" },
        { id: "mask", label: "Máscara / complemento" },
        { id: "ambos", label: "Ambos" }
      ]
    }
  ];

  const answers = {};
  let stepIndex = 0;

  const mapResult = () => {
    const { prioridad, formato, piel } = answers;
    if (prioridad === "glow" || (prioridad === "firmeza" && piel === "opaca")) {
      return {
        intent: "idebenone-ampoule-3x10ml",
        name: "Idebenone Prestige Ampoule 3x10mL",
        why: "Priorizás luminosidad y un antioxidante de alto desempeño cosmético.",
        href: "/productos/gabaon-idebenone-prestige-ampoule/"
      };
    }
    if (prioridad === "hidratacion" || (formato === "mask" && piel === "seca")) {
      return {
        intent: "hyaluronic-acid-mask-3u",
        name: "Hyaluronic Acid Mask (3 u.)",
        why: "Tu foco es hidratación intensiva y confort inmediato.",
        href: "/productos/hyaluronic-acid-mask/"
      };
    }
    if (prioridad === "complemento" || formato === "mask") {
      return {
        intent: "collagen-essence-mask-3u",
        name: "Collagen Essence Mask (3 u.)",
        why: "Encaja como ritual semanal de firmeza y confort.",
        href: "/productos/collagen-essence-mask/"
      };
    }
    return {
      intent: "multipeptide-cream-50ml",
      name: "Premium Multipeptide Cream 50mL",
      why: "Es la base diaria más versátil para firmeza e hidratación.",
      href: "/productos/gabaon-premium-multipeptide-cream/"
    };
  };

  const render = () => {
    if (stepIndex >= steps.length) {
      const result = mapResult();
      trackEvent("complete_skin_diagnostic", {
        ...answers,
        recommended: result.intent
      });
      root.innerHTML = `
        <div class="diagnostic-result">
          <p class="kicker">Recomendación cosmética (no médica)</p>
          <h3>${result.name}</h3>
          <p>${result.why}</p>
          <div class="hero-cta">
            <a class="btn js-wa-link" href="https://wa.me/${numeroEmpresa}" data-wa-location="diagnostic_result" data-wa-product="${result.intent}">Comprar por WhatsApp</a>
            <a class="btn btn-ghost" href="${result.href}">Ver ficha del producto</a>
          </div>
          <button type="button" class="text-link js-diagnostic-restart">Volver a empezar</button>
        </div>`;
      wireWhatsAppLinks();
      root.querySelector(".js-diagnostic-restart")?.addEventListener("click", () => {
        Object.keys(answers).forEach((k) => delete answers[k]);
        stepIndex = 0;
        render();
      });
      return;
    }

    const step = steps[stepIndex];
    root.innerHTML = `
      <div class="diagnostic-step" data-step="${step.key}">
        <p class="diagnostic-progress">Paso ${stepIndex + 1} de ${steps.length}</p>
        <h3>${step.question}</h3>
        <div class="goal-grid">
          ${step.options
            .map(
              (opt) =>
                `<button type="button" class="goal-card js-diagnostic-opt" data-value="${opt.id}"><strong>${opt.label}</strong></button>`
            )
            .join("")}
        </div>
      </div>`;

    if (stepIndex === 0) {
      trackEvent("start_skin_diagnostic", { variant: activeVariant });
    }

    root.querySelectorAll(".js-diagnostic-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        answers[step.key] = btn.getAttribute("data-value");
        stepIndex += 1;
        render();
      });
    });
  };

  render();
}

initDiagnostic();

/* Mini-diagnostic on PDP: confirm fit without medical claims */
function initMiniDiagnostic() {
  const root = document.getElementById("mini-diagnostic");
  if (!root) return;
  const recommend = root.getAttribute("data-recommend") || "";
  const productName = root.getAttribute("data-product-name") || "este producto";

  root.innerHTML = `
    <div class="mini-diagnostic-panel">
      <p class="kicker">Chequeo rápido</p>
      <p>¿Tu prioridad coincide con <strong>${productName}</strong>?</p>
      <div class="hero-cta">
        <button type="button" class="btn js-mini-yes">Sí, quiero este</button>
        <a class="btn btn-ghost" href="/#diagnostico">Prefiero el diagnóstico completo</a>
      </div>
      <p class="muted">Orientación cosmética de rutina — no es diagnóstico médico.</p>
    </div>`;

  root.querySelector(".js-mini-yes")?.addEventListener("click", () => {
    trackEvent("complete_skin_diagnostic", {
      mode: "mini_pdp",
      recommended: recommend
    });
    window.open(buildWhatsAppUrlByIntent(recommend, "mini_diagnostic"), "_blank", "noopener,noreferrer");
  });
}

initMiniDiagnostic();

/* Legacy one-click goals (homepage fallback cards) */
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
    trackEvent("complete_skin_diagnostic", {
      variant: activeVariant,
      goal: goal || "unknown",
      intent,
      mode: "quick"
    });
    window.open(buildWhatsAppUrlByIntent(intent, "diagnostic_quick"), "_blank", "noopener,noreferrer");
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

document.querySelectorAll(".js-wa-link").forEach((el) => {
  el.addEventListener("click", () => {
    const location =
      el.getAttribute("data-wa-location") || (el.id === "whatsapp-float" ? "floating" : "cta");
    const product = el.getAttribute("data-wa-product") || "general";
    trackEvent("click_whatsapp", {
      variant: activeVariant,
      location,
      product
    });
  });
});

/* Product page view + select_product */
const productId = document.body.getAttribute("data-product-id");
if (productId) {
  trackEvent("view_product", { product_id: productId });
}

document.querySelectorAll('[data-track="select_product"]').forEach((el) => {
  el.addEventListener("click", () => {
    trackEvent("select_product", {
      product_id: el.getAttribute("data-product-id") || "unknown"
    });
  });
});

/* Scroll depth */
const depths = [25, 50, 75, 100];
const fired = new Set();
window.addEventListener(
  "scroll",
  () => {
    const doc = document.documentElement;
    const scrolled = ((doc.scrollTop || document.body.scrollTop) /
      (doc.scrollHeight - doc.clientHeight)) *
      100;
    depths.forEach((d) => {
      if (scrolled >= d && !fired.has(d)) {
        fired.add(d);
        trackEvent("scroll_depth", { percent: d });
      }
    });
  },
  { passive: true }
);

/* Chat lead hooks */
document.addEventListener("gabaon:generate_lead", () => {
  trackEvent("generate_lead", { source: "chat" });
});
document.addEventListener("gabaon:submit_contact", () => {
  trackEvent("submit_contact", { source: "chat" });
});

if (document.querySelector("[data-track-view='view_shipping']")) {
  trackEvent("view_shipping", {});
}
