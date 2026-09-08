#!/usr/bin/env node
/**
 * Genera páginas estáticas SEO/CRO del ecosistema Gabaon Store.
 * Ejecutar: node scripts/build-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SITE = "https://gabaon.store";

const products = [
  {
    id: "multipeptide-cream-50ml",
    slug: "gabaon-premium-multipeptide-cream",
    name: "Premium Multipeptide Cream 50mL",
    shortName: "Multipeptide Cream",
    badge: "Best seller",
    price: "550000",
    priceDisplay: "₲ 550.000",
    benefit: "Firmeza, hidratación y mejor apariencia de líneas finas.",
    summary:
      "Crema antiedad con multipeptídeos para una rutina diaria de cuidado premium. Textura liviana y absorción rápida.",
    forWhom: [
      "Priorizás firmeza y suavizar la apariencia de líneas",
      "Buscás una crema facial premium de uso diario",
      "Querés hidratación con acabado sofisticado"
    ],
    texture: "Liviana, de rápida absorción, apta para rutina mañana y noche.",
    actives: ["Complejo multipeptídeos", "Activos de soporte antiedad cosmético"],
    howTo: [
      "Limpiá el rostro",
      "Aplicá una cantidad moderada sobre rostro y cuello",
      "Masajeá con movimientos ascendentes hasta absorber",
      "Usá mañana y noche según tolerancia"
    ],
    images: [
      ["multipeptide-cream-50ml-capa.png", "Gabaon Premium Multipeptide Cream 50 ml en Paraguay — frasco y packaging oficial"],
      ["multipeptide-cream-50ml-galeria-1.jpg", "Detalle de textura Gabaon Premium Multipeptide Cream"],
      ["multipeptide-cream-50ml-galeria-2.jpg", "Packaging Gabaon Premium Multipeptide Cream 50 ml"]
    ],
    related: ["gabaon-idebenone-prestige-ampoule", "collagen-essence-mask"],
    wa: "multipeptide-cream-50ml",
    title: "Gabaon Multipeptide Cream Paraguay | Crema premium 50mL",
    description:
      "Comprá Gabaon Premium Multipeptide Cream en Paraguay. Crema facial con multipeptídeos para firmeza e hidratación. Entrega en Asunción. Reserva por WhatsApp."
  },
  {
    id: "idebenone-ampoule-3x10ml",
    slug: "gabaon-idebenone-prestige-ampoule",
    name: "Idebenone Prestige Ampoule 3x10mL",
    shortName: "Idebenone Ampoule",
    badge: "Antioxidante premium",
    price: "550000",
    priceDisplay: "₲ 550.000",
    benefit: "Antioxidante intensivo para potenciar glow y rutina antiedad.",
    summary:
      "Ampollas con Idebenona y sistema de activación previa. Formato prestige para rutina diaria de alto desempeño cosmético.",
    forWhom: [
      "Buscás un antioxidante facial premium",
      "Querés potenciar luminosidad en la rutina",
      "Preferís formato ampolla con activación"
    ],
    texture: "Sérum de ampolla; se activa antes del primer uso.",
    actives: ["Idebenona", "Sistema de activación previa de activos"],
    howTo: [
      "Girá la tapa en la dirección de la flecha hasta encajar",
      "Quitá el seguro interno y presioná el botón inferior para mezclar",
      "Agitá de 15 a 20 veces",
      "Aplicá sobre piel limpia, mañana y/o noche según tolerancia"
    ],
    images: [
      ["idebenone-kit-3x10ml.png", "Gabaon Idebenone Prestige Ampoule kit 3x10 ml disponible en Paraguay"],
      ["idebenone-ampoule-pack.png", "Caja y ampolla Idebenone Prestige Ampoule Gabaon"],
      ["idebenone-closeup.png", "Detalle de ampolla Idebenone Prestige Ampoule"],
      ["idebenone-descricao.png", "Información de uso Idebenone Prestige Ampoule Gabaon"]
    ],
    related: ["gabaon-premium-multipeptide-cream", "hyaluronic-acid-mask"],
    wa: "idebenone-ampoule-3x10ml",
    title: "Gabaon Idebenone Prestige Ampoule Paraguay | Kit 3x10mL",
    description:
      "Idebenone Prestige Ampoule de Gabaon en Paraguay. Ampollas antioxidantes premium. Entrega en Asunción y reserva por WhatsApp."
  },
  {
    id: "collagen-essence-mask-3u",
    slug: "collagen-essence-mask",
    name: "Collagen Essence Mask (3 unidades)",
    shortName: "Collagen Mask",
    badge: "Firmeza semanal",
    price: "250000",
    priceDisplay: "₲ 250.000",
    benefit: "Máscara de colágeno para firmeza, confort y revitalización semanal.",
    summary:
      "Pack de 3 máscaras faciales con enfoque en apariencia firme y tonificada. Complemento premium de rutina antiedad.",
    forWhom: [
      "Querés un ritual semanal de firmeza",
      "Buscás máscara facial de colágeno en Paraguay",
      "Complementás crema o sérum antiedad"
    ],
    texture: "Máscara sheet con esencia de colágeno.",
    actives: ["Colágeno (enfoque cosmético)", "Esencia de confort"],
    howTo: [
      "Limpiá el rostro",
      "Aplicá la máscara y dejá actuar según indicación del envase",
      "Retirá y masajeá el excedente",
      "Ideal 1–2 veces por semana en rutina de firmeza"
    ],
    images: [
      ["collagen-mask-packshot.png", "Gabaon Collagen Essence Mask pack 3 unidades en Paraguay"],
      ["collagen-mask-usage.png", "Aplicación de máscara facial de colágeno Gabaon"]
    ],
    related: ["gabaon-premium-multipeptide-cream", "hyaluronic-acid-mask"],
    wa: "collagen-essence-mask-3u",
    title: "Collagen Essence Mask Paraguay | Máscara de colágeno Gabaon",
    description:
      "Máscara de colágeno Gabaon en Paraguay (pack 3 u.). Firmeza y confort semanal. Entrega en Asunción. Reserva por WhatsApp."
  },
  {
    id: "hyaluronic-acid-mask-3u",
    slug: "hyaluronic-acid-mask",
    name: "Hyaluronic Acid Mask (3 unidades)",
    shortName: "Hyaluronic Mask",
    badge: "Hidratación profunda",
    price: "250000",
    priceDisplay: "₲ 250.000",
    benefit: "Hidratación intensiva, suavidad y glow inmediato.",
    summary:
      "Pack de 3 máscaras con ácido hialurónico para piel con sensación de resequedad o necesidad de luminosidad.",
    forWhom: [
      "Sentís la piel reseca o apagada",
      "Buscás hidratación facial intensiva",
      "Querés un boost de glow semanal"
    ],
    texture: "Máscara sheet con enfoque en hidratación.",
    actives: ["Ácido hialurónico"],
    howTo: [
      "Limpiá el rostro",
      "Aplicá la máscara y dejá actuar según el envase",
      "Retirá y extendé el excedente",
      "Usá cuando necesites un boost de hidratación"
    ],
    images: [
      ["hyaluronic-mask-packshot.png", "Gabaon Hyaluronic Acid Mask pack 3 unidades en Paraguay"],
      ["hyaluronic-mask-lifestyle.png", "Hyaluronic Acid Mask Gabaon — presentación lifestyle"],
      ["hyaluronic-mask-model.png", "Uso de máscara de ácido hialurónico Gabaon"]
    ],
    related: ["gabaon-idebenone-prestige-ampoule", "collagen-essence-mask"],
    wa: "hyaluronic-acid-mask-3u",
    title: "Hyaluronic Acid Mask Paraguay | Máscara hialurónica Gabaon",
    description:
      "Máscara de ácido hialurónico Gabaon en Paraguay (pack 3 u.). Hidratación intensiva y glow. Entrega en Asunción. Reserva por WhatsApp."
  }
];

function write(rel, content) {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("wrote", rel);
}

function asset(base, file) {
  return `${base}assets/img/${file}`;
}

function head({ title, description, canonical, ogType = "website", image, jsonLd, depth = 0 }) {
  const base = "../".repeat(depth) || "./";
  const img = image || `${SITE}/assets/img/og-share-1200x630.png`;
  return `<!doctype html>
<html lang="es-PY">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index,follow,max-image-preview:large" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Gabaon Store" />
  <meta property="og:locale" content="es_PY" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${img}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${img}" />
  <meta name="theme-color" content="#0b0a09" />
  <link rel="icon" type="image/png" href="${base}assets/img/favicon-gabaon.png" />
  <link rel="canonical" href="${canonical}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${base}css/styles.css?v=editorial-7" />
  ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
</head>`;
}

function nav(base, active = "") {
  const link = (href, label, key) =>
    `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<header class="nav">
    <div class="container nav-inner">
      <a class="brand" href="${base}">
        <img src="${base}assets/img/gabaon-logo-korean-beauty.png" alt="GABAÓN Korean Beauty" width="42" height="42" loading="eager" />
        <span>GABAÓN</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu">Menú</button>
      <nav id="nav-menu" class="nav-menu" aria-label="Navegación principal">
        ${link(`${base}productos/`, "Productos", "productos")}
        ${link(`${base}productos/combo-premium-gabaon/`, "Combo", "combo")}
        ${link(`${base}rutinas/`, "Rutinas", "rutinas")}
        ${link(`${base}#diagnostico`, "Diagnóstico", "diagnostico")}
        ${link(`${base}envios/`, "Envíos", "envios")}
        ${link(`${base}contacto/`, "Contacto", "contacto")}
      </nav>
      <a class="btn btn-small js-wa-link" href="https://wa.me/595992799800" target="_blank" rel="noopener noreferrer"
        data-wa-location="header" data-wa-product="asesoria-vip">WhatsApp</a>
    </div>
  </header>`;
}

function footer(base) {
  return `<footer class="footer">
    <div class="container footer-grid">
      <div>
        <strong>Gabaon Store</strong>
        <p>Luxury Korean Skincare en Paraguay. Productos originales, asesoría VIP y entrega en Asunción.</p>
      </div>
      <div>
        <strong>Explorar</strong>
        <a href="${base}productos/">Productos</a>
        <a href="${base}rutinas/">Rutinas</a>
        <a href="${base}ingredientes/">Ingredientes</a>
        <a href="${base}korean-skincare-asuncion/">Asunción</a>
      </div>
      <div>
        <strong>Ayuda</strong>
        <a href="${base}envios/">Envíos y pagos</a>
        <a href="${base}preguntas-frecuentes/">Preguntas frecuentes</a>
        <a href="${base}sobre-gabaon/">Sobre Gabaon</a>
        <a href="${base}privacidad/">Privacidad</a>
        <a href="${base}contacto/">Contacto</a>
      </div>
      <div>
        <strong>WhatsApp</strong>
        <a href="tel:+595992799800">+595 992 799 800</a>
        <a class="js-wa-link" href="https://wa.me/595992799800" data-wa-location="footer" data-wa-product="asesoria-vip">Escribir ahora</a>
      </div>
    </div>
    <div class="container footer-inner">
      <small>© <span id="anio"></span> Gabaon Store · Paraguay</small>
      <a href="#contenido">Volver arriba</a>
    </div>
  </footer>
  <a class="whatsapp-float js-wa-link" href="https://wa.me/595992799800" id="whatsapp-float" target="_blank"
    rel="noopener noreferrer" aria-label="Comprar por WhatsApp con Gabaon Store" data-wa-location="floating"
    data-wa-product="asesoria-vip">
    <span class="whatsapp-float-icon" aria-hidden="true">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.52 3.48A9.87 9.87 0 0 0 12.06 0C5.93 0 1 4.93 1 11c0 1.94.51 3.79 1.48 5.41L0 24l7.77-2.04A9.9 9.9 0 0 0 12.06 22h.06c6.13 0 11-4.93 11-11 0-2.94-1.15-5.7-3.6-7.52zM12.07 20.17h-.03a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-4.22 1.11 1.13-4.1-.2-.32a8.27 8.27 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c-.01 4.55-3.71 8.25-8.26 8.25zm4.54-6.2c-.25-.12-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.66.81-.81.97-.15.17-.3.19-.56.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.12-.12.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.45.06-.68.32-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.02 2.59.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.44.52.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.17-.48-.29z"/></svg>
    </span>
    <span class="whatsapp-float-text">Comprar por WhatsApp</span>
  </a>`;
}

function scripts(base) {
  return `<script src="${base}js/config.js"></script>
<script src="${base}js/catalog.js"></script>
<script src="${base}js/main.js" defer></script>
<script src="${base}js/chat.js" defer></script>`;
}

function breadcrumbs(items) {
  const html = items
    .map((item, i) =>
      i === items.length - 1
        ? `<li aria-current="page">${item.name}</li>`
        : `<li><a href="${item.href}">${item.name}</a></li>`
    )
    .join("");
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href.startsWith("http") ? item.href : `${SITE}${item.href.replace(/^\.\.\//, "/").replace(/^\.\//, "/")}`
    }))
  };
  // Fix breadcrumb URLs properly
  ld.itemListElement = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    ...(item.canonical ? { item: item.canonical } : {})
  }));
  return {
    html: `<nav class="breadcrumbs" aria-label="Migas de pan"><ol>${html}</ol></nav>`,
    ld
  };
}

function productPage(p) {
  const depth = 2;
  const base = "../../";
  const url = `${SITE}/productos/${p.slug}/`;
  const ogImage = `${SITE}/assets/img/${p.images[0][0]}`;
  const crumbs = breadcrumbs([
    { name: "Inicio", href: "../../", canonical: `${SITE}/` },
    { name: "Productos", href: "../", canonical: `${SITE}/productos/` },
    { name: p.shortName, href: "./", canonical: url }
  ]);
  const related = products.filter((x) => p.related.includes(x.slug));
  const productLd = {
    "@context": "https://schema.org",
    "@graph": [
      crumbs.ld,
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: p.name,
        description: p.summary,
        image: p.images.map(([f]) => `${SITE}/assets/img/${f}`),
        brand: { "@type": "Brand", name: "Gabaon" },
        sku: p.id,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "PYG",
          price: p.price,
          availability: "https://schema.org/LimitedAvailability",
          priceValidUntil: "2027-12-31",
          seller: { "@type": "Organization", name: "Gabaon Store" }
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `¿Cómo compro ${p.shortName} en Paraguay?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Escribís por WhatsApp al +595 992 799 800 indicando ${p.name}. Confirmamos stock, precio vigente y entrega en Asunción o interior.`
            }
          },
          {
            "@type": "Question",
            name: "¿El producto es original?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Trabajamos con importación y trazabilidad coordinada por Gabaon Store. Pedí comprobante según disponibilidad al cerrar la compra."
            }
          },
          {
            "@type": "Question",
            name: "¿Entregan en Asunción el mismo día?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí, según disponibilidad. Al confirmar el pedido por WhatsApp te informamos plazo exacto."
            }
          }
        ]
      }
    ]
  };

  const gallery = p.images
    .map(([file, alt], i) => {
      const webp = file.replace(/\.(png|jpe?g)$/i, ".webp");
      const webpPath = path.join(root, "assets/img", webp);
      const hasWebp = fs.existsSync(webpPath);
      const img = `<img src="${asset(base, file)}" alt="${alt}" width="640" height="640" loading="${i === 0 ? "eager" : "lazy"}"${i === 0 ? ' fetchpriority="high"' : ""} />`;
      if (!hasWebp) return img;
      return `<picture><source type="image/webp" srcset="${asset(base, webp)}" />${img}</picture>`;
    })
    .join("\n");

  const relatedHtml = related
    .map(
      (r) => `<a class="related-card" href="../${r.slug}/">
      <img src="${asset(base, r.images[0][0])}" alt="${r.images[0][1]}" width="240" height="240" loading="lazy" />
      <strong>${r.shortName}</strong>
      <span>${r.priceDisplay}</span>
    </a>`
    )
    .join("\n");

  return `${head({
    title: p.title,
    description: p.description,
    canonical: url,
    ogType: "product",
    image: ogImage,
    jsonLd: JSON.stringify(productLd),
    depth
  })}
<body class="page-product" data-page="product" data-product-id="${p.id}" data-product-slug="${p.slug}">
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${nav(base, "productos")}
  <main id="contenido">
    <div class="container page-top">
      ${crumbs.html}
    </div>
    <section class="section product-hero">
      <div class="container product-hero-grid">
        <div class="product-gallery-main" aria-label="Galería de ${p.name}">
          ${gallery}
        </div>
        <div class="product-buy-panel">
          <p class="kicker">${p.badge} · Gabaon Paraguay</p>
          <h1>${p.name}</h1>
          <p class="lead">${p.benefit}</p>
          <p class="product-price">${p.priceDisplay}</p>
          <p class="price-note">Precio referencial · stock confirmado por WhatsApp</p>
          <ul class="product-signals">
            <li>Entrega en el día en Asunción (según disponibilidad)</li>
            <li>Producto original con trazabilidad</li>
            <li>Atención personalizada en español</li>
          </ul>
          <div class="hero-cta">
            <a class="btn js-wa-link" href="https://wa.me/595992799800" target="_blank" rel="noopener noreferrer"
              data-wa-location="pdp_primary" data-wa-product="${p.wa}">Comprar por WhatsApp</a>
            <a class="btn btn-ghost" href="${base}#diagnostico">¿Este producto es para mí?</a>
          </div>
          <p class="disclaimer">Producto cosmético. No reemplaza tratamientos dermatológicos.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container prose-grid">
        <article>
          <h2>Beneficios</h2>
          <p>${p.summary}</p>
          <h3>Textura y experiencia</h3>
          <p>${p.texture}</p>
          <h3>Activos destacados</h3>
          <ul>${p.actives.map((a) => `<li>${a}</li>`).join("")}</ul>
        </article>
        <article>
          <h2>¿Este producto es para mí?</h2>
          <ul>${p.forWhom.map((f) => `<li>${f}</li>`).join("")}</ul>
          <p class="muted">Orientación cosmética de rutina — no es diagnóstico médico.</p>
          <div id="mini-diagnostic" class="mini-diagnostic" data-recommend="${p.wa}" data-product-name="${p.shortName}"></div>
        </article>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <h2>Cómo usarlo</h2>
        <ol class="buy-steps">${p.howTo.map((s) => `<li>${s}</li>`).join("")}</ol>
        <div class="section-cta">
          <a class="btn js-wa-link" href="https://wa.me/595992799800" target="_blank" rel="noopener noreferrer"
            data-wa-location="pdp_usage" data-wa-product="${p.wa}">Confirmar disponibilidad</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>También te puede interesar</h2>
        <div class="related-grid">${relatedHtml}</div>
        <p class="social-intro"><a href="../">Ver toda la colección</a> · <a href="${base}rutinas/">Armá tu rutina</a> · <a href="${base}envios/">Envíos y pagos</a></p>
      </div>
    </section>

    <section class="section section-dark">
      <div class="container">
        <h2>Preguntas frecuentes</h2>
        <div class="faq">
          <details open>
            <summary>¿Cómo compro ${p.shortName} en Paraguay?</summary>
            <p>Escribís por WhatsApp al <strong>+595 992 799 800</strong>. Confirmamos stock, precio vigente y entrega.</p>
          </details>
          <details>
            <summary>¿Entregan en Asunción el mismo día?</summary>
            <p>Sí, según disponibilidad. Al confirmar el pedido te informamos el plazo exacto.</p>
          </details>
          <details>
            <summary>¿El producto es original?</summary>
            <p>Sí. Trabajamos con importación y trazabilidad coordinada por Gabaon Store.</p>
          </details>
        </div>
      </div>
    </section>
  </main>
  ${footer(base)}
  ${scripts(base)}
</body>
</html>`;
}

function contentPage({
  slugPath,
  depth,
  title,
  description,
  h1,
  active,
  body,
  crumbs,
  jsonExtra
}) {
  const base = "../".repeat(depth) || "./";
  const canonical = `${SITE}/${slugPath}`.replace(/\/+$/, "/") ;
  const can = slugPath.endsWith("/") || slugPath === "" ? `${SITE}/${slugPath}` : `${SITE}/${slugPath}/`;
  const finalCan = can.replace(`${SITE}//`, `${SITE}/`);
  const bc = breadcrumbs(crumbs);
  const graph = [bc.ld, ...(jsonExtra || [])];
  return `${head({
    title,
    description,
    canonical: finalCan,
    jsonLd: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
    depth
  })}
<body data-page="${slugPath}">
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${nav(base, active)}
  <main id="contenido">
    <div class="container page-top">${bc.html}
      <header class="page-header">
        <h1>${h1}</h1>
      </header>
    </div>
    <section class="section">
      <div class="container content-prose">
        ${body}
      </div>
    </section>
  </main>
  ${footer(base)}
  ${scripts(base)}
</body>
</html>`;
}

// --- Generate product pages ---
for (const p of products) {
  write(`productos/${p.slug}/index.html`, productPage(p));
}

const productCards = products
  .map(
    (p) => `<article class="luxury-card">
  <a class="product-card-link" href="./${p.slug}/" data-track="select_product" data-product-id="${p.id}">
    <div class="product-media-scroll">
      <img src="../assets/img/${p.images[0][0]}" alt="${p.images[0][1]}" width="480" height="480" loading="lazy" />
    </div>
    <div class="luxury-card-body">
      <p class="luxury-badge">${p.badge}</p>
      <h2>${p.name}</h2>
      <p>${p.benefit}</p>
      <p class="product-price">${p.priceDisplay}</p>
      <span class="btn btn-ghost">Ver ficha</span>
    </div>
  </a>
  <div class="luxury-card-body" style="padding-top:0">
    <a class="btn js-wa-link" href="https://wa.me/595992799800" target="_blank" rel="noopener noreferrer"
      data-wa-location="plp" data-wa-product="${p.wa}">Comprar por WhatsApp</a>
  </div>
</article>`
  )
  .join("\n");

write(
  "productos/index.html",
  contentPage({
    slugPath: "productos/",
    depth: 1,
    title: "Productos Gabaon Paraguay | Skincare coreano premium",
    description:
      "Catálogo Gabaon en Paraguay: Multipeptide Cream, Idebenone Prestige Ampoule, Collagen Mask y Hyaluronic Mask. Precios en guaraníes y reserva por WhatsApp.",
    h1: "Colección Gabaon en Paraguay",
    active: "productos",
    crumbs: [
      { name: "Inicio", href: "../", canonical: `${SITE}/` },
      { name: "Productos", href: "./", canonical: `${SITE}/productos/` }
    ],
    body: `<p class="lead">Skincare coreano premium con entrega en Asunción y asesoría personalizada. Precios referenciales — confirmá stock por WhatsApp.</p>
    <article class="kit-card kit-card-featured" style="margin-bottom:2rem">
      <p class="luxury-badge">Oferta principal</p>
      <h2><a href="./combo-premium-gabaon/">Combo Premium Gabaon</a></h2>
      <p>Idebenone Prestige Ampoule + Premium Multipeptide Cream</p>
      <p class="product-price">₲ 699.000</p>
      <div class="hero-cta">
        <a class="btn js-wa-link" href="https://wa.me/595992799800" target="_blank" rel="noopener noreferrer"
          data-wa-location="plp_combo" data-wa-product="combo-premium">Pedí el combo</a>
        <a class="btn btn-ghost" href="./combo-premium-gabaon/">Ver comparación de precios</a>
      </div>
    </article>
    <div class="luxury-products">${productCards}</div>
    <p><a href="../rutinas/">Ver rutinas recomendadas</a> · <a href="../#diagnostico">Hacer diagnóstico rápido</a></p>`,
    jsonExtra: [
      {
        "@type": "CollectionPage",
        name: "Colección Gabaon en Paraguay",
        url: `${SITE}/productos/`
      },
      {
        "@type": "ItemList",
        itemListElement: products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/productos/${p.slug}/`,
          name: p.name
        }))
      }
    ]
  })
);

// Rutinas
const rutinas = [
  {
    slug: "firmeza",
    title: "Rutina de firmeza Gabaon | Paraguay",
    description:
      "Rutina facial de firmeza con Multipeptide Cream y Collagen Essence Mask. Disponible en Paraguay con entrega en Asunción.",
    h1: "Rutina de firmeza",
    body: `<p>Para quienes priorizan apariencia más firme y confort en la piel. Combiná cuidado diario + ritual semanal.</p>
    <ol class="buy-steps">
      <li><a href="../../productos/gabaon-premium-multipeptide-cream/">Premium Multipeptide Cream</a> — mañana y noche</li>
      <li><a href="../../productos/collagen-essence-mask/">Collagen Essence Mask</a> — 1 a 2 veces por semana</li>
    </ol>
    <p class="product-price">Kit referencial: ₲ 980.000</p>
    <a class="btn js-wa-link" data-wa-product="kit-firmeza" data-wa-location="rutina_firmeza" href="https://wa.me/595992799800">Reservar rutina firmeza</a>
    <p class="muted">Orientación cosmética. No es protocolo médico.</p>`
  },
  {
    slug: "hidratacion",
    title: "Rutina de hidratación Gabaon | Paraguay",
    description:
      "Rutina de hidratación facial con Hyaluronic Acid Mask y opciones Gabaon. Entrega en Asunción, Paraguay.",
    h1: "Rutina de hidratación",
    body: `<p>Ideal si sentís la piel reseca o necesitás un boost de suavidad y luminosidad.</p>
    <ol class="buy-steps">
      <li><a href="../../productos/hyaluronic-acid-mask/">Hyaluronic Acid Mask</a> — boost semanal</li>
      <li>Opcional: <a href="../../productos/gabaon-premium-multipeptide-cream/">Multipeptide Cream</a> para sellar hidratación diaria</li>
    </ol>
    <a class="btn js-wa-link" data-wa-product="hyaluronic-acid-mask-3u" data-wa-location="rutina_hidratacion" href="https://wa.me/595992799800">Reservar hidratación</a>`
  },
  {
    slug: "glow",
    title: "Rutina glow Gabaon | Paraguay",
    description:
      "Rutina glow con Idebenone Prestige Ampoule y Hyaluronic Acid Mask. Skincare coreano en Paraguay.",
    h1: "Rutina glow",
    body: `<p>Antioxidante diario + hidratación semanal para una piel con aspecto más luminoso.</p>
    <ol class="buy-steps">
      <li><a href="../../productos/gabaon-idebenone-prestige-ampoule/">Idebenone Prestige Ampoule</a></li>
      <li><a href="../../productos/hyaluronic-acid-mask/">Hyaluronic Acid Mask</a></li>
    </ol>
    <p class="product-price">Kit referencial: ₲ 980.000</p>
    <a class="btn js-wa-link" data-wa-product="kit-glow" data-wa-location="rutina_glow" href="https://wa.me/595992799800">Reservar glow intensivo</a>`
  },
  {
    slug: "antiedad",
    title: "Rutina antiedad Gabaon | Paraguay",
    description:
      "Rutina antiedad cosmética Gabaon en Paraguay: Multipeptide, Idebenone y máscaras premium.",
    h1: "Rutina antiedad",
    body: `<p>Enfoque cosmético integral: antioxidante + firmeza + complementary masks.</p>
    <ol class="buy-steps">
      <li><a href="../../productos/gabaon-idebenone-prestige-ampoule/">Idebenone</a> — antioxidante</li>
      <li><a href="../../productos/gabaon-premium-multipeptide-cream/">Multipeptide Cream</a> — firmeza diaria</li>
      <li>Máscara semanal según objetivo: <a href="../../productos/collagen-essence-mask/">colágeno</a> o <a href="../../productos/hyaluronic-acid-mask/">hialurónico</a></li>
    </ol>
    <a class="btn js-wa-link" data-wa-product="catalogo-completo" data-wa-location="rutina_antiedad" href="https://wa.me/595992799800">Pedir recomendación antiedad</a>
    <p class="disclaimer">Producto cosmético. No reemplaza tratamientos dermatológicos.</p>`
  }
];

write(
  "rutinas/index.html",
  contentPage({
    slugPath: "rutinas/",
    depth: 1,
    title: "Rutinas Gabaon | Firmeza, glow, hidratación y antiedad",
    description:
      "Elegí tu rutina facial Gabaon en Paraguay: firmeza, hidratación, glow o antiedad. Productos coreanos premium con entrega en Asunción.",
    h1: "Rutinas Gabaon",
    active: "rutinas",
    crumbs: [
      { name: "Inicio", href: "../", canonical: `${SITE}/` },
      { name: "Rutinas", href: "./", canonical: `${SITE}/rutinas/` }
    ],
    body: `<p class="lead">Armá tu cuidado según prioridad. Cada rutina enlaza a fichas de producto y reserva por WhatsApp.</p>
    <div class="kits-grid">
      ${rutinas
        .map(
          (r) => `<article class="kit-card"><h2><a href="./${r.slug}/">${r.h1}</a></h2><p><a href="./${r.slug}/">Ver rutina</a></p></article>`
        )
        .join("")}
    </div>`
  })
);

for (const r of rutinas) {
  write(
    `rutinas/${r.slug}/index.html`,
    contentPage({
      slugPath: `rutinas/${r.slug}/`,
      depth: 2,
      title: r.title,
      description: r.description,
      h1: r.h1,
      active: "rutinas",
      crumbs: [
        { name: "Inicio", href: "../../", canonical: `${SITE}/` },
        { name: "Rutinas", href: "../", canonical: `${SITE}/rutinas/` },
        { name: r.h1, href: "./", canonical: `${SITE}/rutinas/${r.slug}/` }
      ],
      body: r.body
    })
  );
}

// Ingredientes
const ingredientes = [
  {
    slug: "idebenona",
    title: "Idebenona en cosmética | Qué es y para qué se usa",
    h1: "Idebenona en cosmética",
    description:
      "Qué es la idebenona en el cuidado facial y cómo se usa en Gabaon Idebenone Prestige Ampoule en Paraguay.",
    body: `<p>La idebenona es un activo cosmético conocido por su perfil antioxidante en fórmulas faciales de alto desempeño. En la línea Gabaon aparece en el <a href="../../productos/gabaon-idebenone-prestige-ampoule/">Idebenone Prestige Ampoule</a>.</p>
    <p>Su uso cosmético busca apoyar la apariencia de luminosidad y el cuidado antiedad tópico. No es un medicamento.</p>
    <p><a href="../../rutinas/glow/">Ver rutina glow</a> · <a href="../../productos/gabaon-idebenone-prestige-ampoule/">Comprar Idebenone en Paraguay</a></p>`
  },
  {
    slug: "multipeptidos",
    title: "Multipéptidos en skincare | Crema Gabaon Paraguay",
    h1: "Multipéptidos",
    description:
      "Qué son los multipéptidos cosméticos y cómo se usan en Gabaon Premium Multipeptide Cream en Paraguay.",
    body: `<p>Los complejos de péptidos se usan en cosmética por su rol en rutinas de firmeza e hidratación. En Gabaon, el foco está en la <a href="../../productos/gabaon-premium-multipeptide-cream/">Premium Multipeptide Cream</a>.</p>
    <p><a href="../../rutinas/firmeza/">Ver rutina de firmeza</a></p>`
  },
  {
    slug: "acido-hialuronico",
    title: "Ácido hialurónico facial | Máscara Gabaon Paraguay",
    h1: "Ácido hialurónico",
    description:
      "Ácido hialurónico en cuidado facial y la Hyaluronic Acid Mask de Gabaon disponible en Paraguay.",
    body: `<p>El ácido hialurónico es un activo habitual en hidratación cosmética. La <a href="../../productos/hyaluronic-acid-mask/">Hyaluronic Acid Mask</a> es el formato máscara de la colección Gabaon en Paraguay.</p>
    <p><a href="../../rutinas/hidratacion/">Ver rutina de hidratación</a></p>`
  },
  {
    slug: "colageno",
    title: "Colágeno en máscaras faciales | Gabaon Paraguay",
    h1: "Colágeno cosmético",
    description:
      "Colágeno en máscaras faciales y Collagen Essence Mask de Gabaon en Paraguay.",
    body: `<p>En cosmética, el colágeno suele usarse en máscaras para confort y apariencia de firmeza. Conocé la <a href="../../productos/collagen-essence-mask/">Collagen Essence Mask</a>.</p>
    <p><a href="../../rutinas/firmeza/">Ver rutina de firmeza</a></p>`
  }
];

write(
  "ingredientes/index.html",
  contentPage({
    slugPath: "ingredientes/",
    depth: 1,
    title: "Ingredientes Gabaon | Idebenona, péptidos, HA y colágeno",
    description:
      "Guía de ingredientes cosméticos Gabaon: idebenona, multipéptidos, ácido hialurónico y colágeno. Enlaces a productos en Paraguay.",
    h1: "Ingredientes",
    active: "",
    crumbs: [
      { name: "Inicio", href: "../", canonical: `${SITE}/` },
      { name: "Ingredientes", href: "./", canonical: `${SITE}/ingredientes/` }
    ],
    body: `<ul class="link-list">${ingredientes
      .map((i) => `<li><a href="./${i.slug}/">${i.h1}</a></li>`)
      .join("")}</ul>`
  })
);

for (const i of ingredientes) {
  write(
    `ingredientes/${i.slug}/index.html`,
    contentPage({
      slugPath: `ingredientes/${i.slug}/`,
      depth: 2,
      title: i.title,
      description: i.description,
      h1: i.h1,
      active: "",
      crumbs: [
        { name: "Inicio", href: "../../", canonical: `${SITE}/` },
        { name: "Ingredientes", href: "../", canonical: `${SITE}/ingredientes/` },
        { name: i.h1, href: "./", canonical: `${SITE}/ingredientes/${i.slug}/` }
      ],
      body: i.body
    })
  );
}

// Local pages
write(
  "korean-skincare-paraguay/index.html",
  contentPage({
    slugPath: "korean-skincare-paraguay/",
    depth: 1,
    title: "Korean Skincare Paraguay | Cosmética coreana Gabaon",
    description:
      "Dónde comprar skincare coreano en Paraguay. Gabaon Store: productos originales, asesoría VIP y entrega en Asunción e interior.",
    h1: "Korean skincare en Paraguay",
    active: "local",
    crumbs: [
      { name: "Inicio", href: "../", canonical: `${SITE}/` },
      { name: "Korean skincare Paraguay", href: "./", canonical: `${SITE}/korean-skincare-paraguay/` }
    ],
    body: `<p class="lead">Gabaon Store es el canal online de la línea Gabaon en Paraguay: cosmética coreana premium con compra simple por WhatsApp.</p>
    <h2>¿Venden en Paraguay?</h2>
    <p>Sí. Atendemos consultas y reservas desde todo el país, con foco en Gran Asunción.</p>
    <h2>¿Cómo comprar?</h2>
    <ol class="buy-steps">
      <li>Elegí un <a href="../productos/">producto</a> o hacé el <a href="../#diagnostico">diagnóstico</a>.</li>
      <li>Escribí por WhatsApp con tu ciudad.</li>
      <li>Confirmá stock, precio y pago.</li>
      <li>Recibí en Asunción (mismo día según disponibilidad) o envío al interior.</li>
    </ol>
    <h2>Productos disponibles</h2>
    <ul>
      ${products.map((p) => `<li><a href="../productos/${p.slug}/">${p.name}</a> — ${p.priceDisplay}</li>`).join("")}
    </ul>
    <p><a href="../korean-skincare-asuncion/">Ver cobertura en Asunción</a> · <a href="../envios/">Envíos y pagos</a></p>
    <a class="btn js-wa-link" data-wa-product="catalogo-completo" data-wa-location="local_paraguay" href="https://wa.me/595992799800">Comprar por WhatsApp</a>`
  })
);

write(
  "korean-skincare-asuncion/index.html",
  contentPage({
    slugPath: "korean-skincare-asuncion/",
    depth: 1,
    title: "Korean Skincare Asunción | Entrega el mismo día Gabaon",
    description:
      "Comprá skincare coreano en Asunción con Gabaon Store. Entrega el mismo día según disponibilidad. Villa Morra, Carmelitas, Recoleta y Gran Asunción.",
    h1: "Korean skincare en Asunción",
    active: "local",
    crumbs: [
      { name: "Inicio", href: "../", canonical: `${SITE}/` },
      { name: "Korean skincare Asunción", href: "./", canonical: `${SITE}/korean-skincare-asuncion/` }
    ],
    body: `<p class="lead">Si estás en Asunción o Gran Asunción, podés reservar Gabaon por WhatsApp y coordinar entrega el mismo día según disponibilidad.</p>
    <h2>Zonas de atención frecuente</h2>
    <p>Asunción, Villa Morra, Carmelitas, Recoleta, Las Lomas, Ycuá Satí, Mburucuyá, Fernando de la Mora, San Lorenzo, Luque, Lambaré y Mariano Roque Alonso.</p>
    <h2>Qué podés pedir hoy</h2>
    <ul>
      ${products.map((p) => `<li><a href="../productos/${p.slug}/">${p.shortName}</a></li>`).join("")}
    </ul>
    <h2>Pagos</h2>
    <p>Transferencia, efectivo contra entrega (según zona) y otros medios acordados al confirmar.</p>
    <a class="btn js-wa-link" data-wa-product="asesoria-vip" data-wa-location="local_asuncion" href="https://wa.me/595992799800">Quiero entrega en Asunción</a>
    <p><a href="../korean-skincare-paraguay/">Ver información para todo Paraguay</a></p>`
  })
);

const simplePages = [
  {
    path: "preguntas-frecuentes/index.html",
    slugPath: "preguntas-frecuentes/",
    title: "Preguntas frecuentes | Gabaon Store Paraguay",
    description:
      "FAQ Gabaon Store Paraguay: cómo comprar, envíos a Asunción, originalidad, precios y stock por WhatsApp.",
    h1: "Preguntas frecuentes",
    active: "faq",
    body: `<div class="faq">
      <details open><summary>¿Cómo compro desde Paraguay?</summary><p>Por WhatsApp al +595 992 799 800. Confirmamos stock, precio y entrega.</p></details>
      <details><summary>¿Entregan en Asunción el mismo día?</summary><p>Sí, según disponibilidad al confirmar el pedido.</p></details>
      <details><summary>¿Envían al interior?</summary><p>Sí. Costo y plazo se informan al confirmar ciudad y pedido.</p></details>
      <details><summary>¿Los productos son originales?</summary><p>Trabajamos con importación y trazabilidad. Pedí comprobante al cerrar la compra.</p></details>
      <details><summary>¿Hay precio mayorista?</summary><p>Consultá desde 10 unidades por WhatsApp.</p></details>
      <details><summary>¿Qué producto me conviene?</summary><p>Usá el <a href="../#diagnostico">diagnóstico</a> o pedí asesoría VIP.</p></details>
    </div>`
  },
  {
    path: "sobre-gabaon/index.html",
    slugPath: "sobre-gabaon/",
    title: "Sobre Gabaon | Marca de skincare coreano en Paraguay",
    description:
      "Conocé Gabaon Store en Paraguay: canal oficial de venta online de skincare coreano premium con asesoría y entrega.",
    h1: "Sobre Gabaon",
    active: "",
    body: `<p>Gabaon es skincare coreano premium. En Paraguay, <strong>Gabaon Store</strong> centraliza reservas, asesoramiento y logística por WhatsApp.</p>
    <p>La línea combina activos de alto desempeño cosmético pensados para rutinas de firmeza, glow e hidratación.</p>
    <p><a href="../productos/">Ver productos</a> · <a href="../contacto/">Contacto</a></p>`
  },
  {
    path: "contacto/index.html",
    slugPath: "contacto/",
    title: "Contacto Gabaon Store Paraguay | WhatsApp",
    description:
      "Contactá Gabaon Store Paraguay por WhatsApp +595 992 799 800. Consultas de stock, precio y entrega en Asunción.",
    h1: "Contacto",
    active: "contacto",
    body: `<p class="lead">Atención comercial directa por WhatsApp.</p>
    <p><strong>Teléfono / WhatsApp:</strong> <a href="tel:+595992799800">+595 992 799 800</a></p>
    <a class="btn js-wa-link" data-wa-product="asesoria-vip" data-wa-location="contacto" href="https://wa.me/595992799800">Escribir por WhatsApp</a>
    <p>También podés usar el chat de Fernanda en el sitio para dudas de catálogo.</p>`
  },
  {
    path: "envios/index.html",
    slugPath: "envios/",
    title: "Envíos y pagos | Gabaon Store Paraguay",
    description:
      "Envío el mismo día en Asunción y al interior de Paraguay. Formas de pago y condiciones Gabaon Store.",
    h1: "Envíos y pagos",
    active: "",
    body: `<h2>Asunción</h2><p>Entrega el mismo día según disponibilidad, confirmada por WhatsApp.</p>
    <h2>Interior</h2><p>Encomienda o envío coordinado. Costo y plazo informados al confirmar ciudad.</p>
    <h2>Pagos</h2><p>Transferencia bancaria, efectivo contra entrega (según zona) y otros medios acordados.</p>
    <p data-track-view="view_shipping">Al abrir WhatsApp, indicá tu barrio o ciudad para cotizar.</p>
    <a class="btn js-wa-link" data-wa-product="asesoria-vip" data-wa-location="envios" href="https://wa.me/595992799800">Consultar mi entrega</a>`
  },
  {
    path: "privacidad/index.html",
    slugPath: "privacidad/",
    title: "Política de privacidad | Gabaon Store",
    description: "Política de privacidad de Gabaon Store (gabaon.store) en Paraguay.",
    h1: "Política de privacidad",
    active: "",
    body: `<p>Gabaon Store (sitio gabaon.store) trata tus datos conforme a esta información resumida.</p>
    <ul>
      <li><strong>Responsable:</strong> titular del canal Gabaon Store · WhatsApp +595 992 799 800.</li>
      <li><strong>Datos:</strong> si usás el chat y enviás el formulario opcional, usamos esos datos solo para responderte, con tu consentimiento.</li>
      <li><strong>WhatsApp:</strong> los datos que envíes se rigen por políticas de Meta/WhatsApp y el uso comercial de Gabaon Store para atender tu consulta.</li>
      <li><strong>Analítica:</strong> pueden usarse cookies agregadas si están activadas.</li>
      <li><strong>Derechos:</strong> escribinos por WhatsApp para aclaraciones.</li>
    </ul>`
  }
];

for (const sp of simplePages) {
  write(
    sp.path,
    contentPage({
      slugPath: sp.slugPath,
      depth: 1,
      title: sp.title,
      description: sp.description,
      h1: sp.h1,
      active: sp.active,
      crumbs: [
        { name: "Inicio", href: "../", canonical: `${SITE}/` },
        { name: sp.h1, href: "./", canonical: `${SITE}/${sp.slugPath}` }
      ],
      body: sp.body
    })
  );
}

// Blog hub (editorial seed)
write(
  "blog/index.html",
  contentPage({
    slugPath: "blog/",
    depth: 1,
    title: "Blog Gabaon | Guías de Korean skincare en Paraguay",
    description:
      "Guías de skincare coreano, ingredientes y rutinas Gabaon para Paraguay. Contenido útil con enlaces a productos.",
    h1: "Blog",
    active: "",
    crumbs: [
      { name: "Inicio", href: "../", canonical: `${SITE}/` },
      { name: "Blog", href: "./", canonical: `${SITE}/blog/` }
    ],
    body: `<p class="lead">Contenido editorial para decidir mejor — sin promesas médicas.</p>
    <ul class="link-list">
      <li><a href="./donde-comprar-korean-skincare-paraguay/">Dónde comprar Korean skincare en Paraguay</a></li>
      <li><a href="./que-es-korean-skincare/">Qué es Korean skincare</a></li>
      <li><a href="../ingredientes/idebenona/">Qué es la idebenona en cosmética</a></li>
      <li><a href="../ingredientes/multipeptidos/">Qué son los péptidos cosméticos</a></li>
    </ul>`
  })
);

write(
  "blog/donde-comprar-korean-skincare-paraguay/index.html",
  contentPage({
    slugPath: "blog/donde-comprar-korean-skincare-paraguay/",
    depth: 2,
    title: "Dónde comprar Korean skincare en Paraguay | Gabaon",
    description:
      "Guía para comprar cosmética coreana en Paraguay: originalidad, entrega en Asunción y catálogo Gabaon por WhatsApp.",
    h1: "Dónde comprar Korean skincare en Paraguay",
    active: "",
    crumbs: [
      { name: "Inicio", href: "../../", canonical: `${SITE}/` },
      { name: "Blog", href: "../", canonical: `${SITE}/blog/` },
      {
        name: "Dónde comprar",
        href: "./",
        canonical: `${SITE}/blog/donde-comprar-korean-skincare-paraguay/`
      }
    ],
    body: `<p>Si buscás skincare coreano en Paraguay, verificá canal, trazabilidad y claridad de precio antes de pagar. En Gabaon Store la compra se cierra por WhatsApp con confirmación de stock y entrega.</p>
    <h2>Qué mirar antes de comprar</h2>
    <ul>
      <li>Producto y presentación claros</li>
      <li>Precio en guaraníes con nota de vigencia</li>
      <li>Política de entrega (Asunción / interior)</li>
      <li>Contacto humano verificable</li>
    </ul>
    <p>Explorá el <a href="../../productos/">catálogo</a> o la guía <a href="../../korean-skincare-paraguay/">Korean skincare Paraguay</a>.</p>
    <a class="btn js-wa-link" data-wa-product="catalogo-completo" data-wa-location="blog_donde_comprar" href="https://wa.me/595992799800">Consultar disponibilidad</a>`,
    jsonExtra: [
      {
        "@type": "Article",
        headline: "Dónde comprar Korean skincare en Paraguay",
        datePublished: "2026-05-08",
        dateModified: "2026-05-08",
        author: { "@type": "Organization", name: "Gabaon Store" },
        publisher: { "@type": "Organization", name: "Gabaon Store", url: SITE }
      }
    ]
  })
);

write(
  "blog/que-es-korean-skincare/index.html",
  contentPage({
    slugPath: "blog/que-es-korean-skincare/",
    depth: 2,
    title: "Qué es Korean skincare | Guía Gabaon Paraguay",
    description:
      "Qué significa Korean skincare y cómo armar una rutina simple con productos Gabaon disponibles en Paraguay.",
    h1: "Qué es Korean skincare",
    active: "",
    crumbs: [
      { name: "Inicio", href: "../../", canonical: `${SITE}/` },
      { name: "Blog", href: "../", canonical: `${SITE}/blog/` },
      { name: "Qué es Korean skincare", href: "./", canonical: `${SITE}/blog/que-es-korean-skincare/` }
    ],
    body: `<p>Korean skincare (K-beauty) describe rutinas y fórmulas de cuidado facial asociadas a la cosmética de Corea del Sur: texturas refinadas, capas de hidratación y activos específicos según objetivo.</p>
    <p>En Gabaon podés empezar por una <a href="../../rutinas/">rutina</a> o un solo producto de la <a href="../../productos/">colección</a>.</p>
    <a class="btn js-wa-link" data-wa-product="asesoria-vip" data-wa-location="blog_kbeauty" href="https://wa.me/595992799800">Pedir asesoría de rutina</a>`,
    jsonExtra: [
      {
        "@type": "Article",
        headline: "Qué es Korean skincare",
        datePublished: "2026-05-08",
        dateModified: "2026-05-08",
        author: { "@type": "Organization", name: "Gabaon Store" }
      }
    ]
  })
);

// Merchant readiness note + feed skeleton
const feedItems = [
  `  <item>
    <g:id>combo-premium-gabaon</g:id>
    <g:title>Combo Premium Gabaon — Idebenone + Multipeptide</g:title>
    <g:description>Combo promocional Idebenone Prestige Ampoule + Premium Multipeptide Cream. Precio promocional. Entrega en Asunción vía WhatsApp.</g:description>
    <g:link>${SITE}/productos/combo-premium-gabaon/</g:link>
    <g:image_link>${SITE}/assets/img/combo-premium-gabaon-699.jpg</g:image_link>
    <g:availability>limited availability</g:availability>
    <g:price>699000 PYG</g:price>
    <g:brand>Gabaon</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
  </item>`,
  ...products.map(
    (p) => `  <item>
    <g:id>${p.id}</g:id>
    <g:title>${p.name}</g:title>
    <g:description>${p.summary}</g:description>
    <g:link>${SITE}/productos/${p.slug}/</g:link>
    <g:image_link>${SITE}/assets/img/${p.images[0][0]}</g:image_link>
    <g:availability>limited availability</g:availability>
    <g:price>${p.price} PYG</g:price>
    <g:brand>Gabaon</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
  </item>`
  )
].join("\n");

write(
  "feeds/google-merchant-products.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>Gabaon Store Paraguay</title>
  <link>${SITE}</link>
  <description>Feed preparatorio. Checkout es por WhatsApp — validar elegibilidad Merchant Center antes de publicar free listings.</description>
${feedItems}
</channel>
</rss>
`
);

write(
  "docs/MERCHANT-CENTER.md",
  `# Google Merchant Center — estado Gabaon Store

## Modelo comercial actual
- Compra y cierre por **WhatsApp** (sin checkout web).
- Precios **referenciales** confirmados al momento.
- Stock confirmado por atención humana.

## Impacto
- Free listings / Merchant Listings suelen exigir URL de producto con compra clara y políticas completas.
- Mientras no exista checkout propio, el feed \`/feeds/google-merchant-products.xml\` queda como **preparación técnica**.
- Priorizar: páginas de producto + schema Product + Google Images/Lens + Search.

## Cuando habilitar Merchant
1. Checkout o landings con precio/stock estables.
2. Políticas de envío/devolución públicas.
3. GTIN/MPN si disponibles.
4. Imágenes que cumplan políticas Merchant.
5. Revisar \`availability\` y \`price\` en tiempo real.
`
);

// Sitemap
const urls = [
  ["/", 1.0, "weekly"],
  ["/productos/", 0.9, "weekly"],
  ["/productos/combo-premium-gabaon/", 0.95, "weekly"],
  ...products.map((p) => [`/productos/${p.slug}/`, 0.9, "weekly"]),
  ["/rutinas/", 0.8, "monthly"],
  ...rutinas.map((r) => [`/rutinas/${r.slug}/`, 0.8, "monthly"]),
  ["/ingredientes/", 0.7, "monthly"],
  ...ingredientes.map((i) => [`/ingredientes/${i.slug}/`, 0.7, "monthly"]),
  ["/korean-skincare-paraguay/", 0.85, "monthly"],
  ["/korean-skincare-asuncion/", 0.85, "monthly"],
  ["/preguntas-frecuentes/", 0.7, "monthly"],
  ["/sobre-gabaon/", 0.6, "monthly"],
  ["/contacto/", 0.7, "monthly"],
  ["/envios/", 0.7, "monthly"],
  ["/privacidad/", 0.3, "yearly"],
  ["/blog/", 0.6, "weekly"],
  ["/blog/donde-comprar-korean-skincare-paraguay/", 0.7, "monthly"],
  ["/blog/que-es-korean-skincare/", 0.65, "monthly"]
];

const today = new Date().toISOString().slice(0, 10);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ([loc, priority, freq]) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`
);

console.log("Build pages complete.");
