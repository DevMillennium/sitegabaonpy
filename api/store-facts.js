/**
 * Fonte única de fatos comerciais para o chat (alinhar preços/textos com a landing).
 */
export const STORE_FACTS = {
  company: "Gabaon Store Paraguay",
  product:
    "Colección Gabaon: Premium Multipeptide Cream 50ml, Idebenone Prestige Ampoule 3x10ml, Collagen Essence Mask y Hyaluronic Acid Mask",
  prices: {
    multipeptide: "₲ 550.000",
    idebenone: "₲ 550.000",
    collagenMask: "₲ 250.000",
    hyaluronicMask: "₲ 250.000",
    kitFirmeza: "₲ 980.000",
    kitGlow: "₲ 980.000",
    comboPremium: "₲ 699.000",
    fromRetail: "Desde ₲ 250.000",
    starFrom: "Desde ₲ 550.000"
  },
  priceGuarani: "Combo Premium Multipeptide + Idebenone Ampoule: ₲ 699.000 (promoción). Máscaras desde ₲ 250.000 · unidades desde ₲ 550.000",
  priceNote: "El precio publicado es referencial y puede variar según promociones vigentes; confirmar por WhatsApp antes de pagar.",
  comboNote:
    "Oferta principal: Combo Premium (Multipeptide Cream 50mL + Idebenone Prestige Ampoule 3x10mL) a ₲ 699.000. Referencias de mercado más caras: Catedral lista Multipeptide ₲ 725.900 (solo crema); compra suelta Kiero/shop oficial ≈ ₲ 1.306.000.",
  wholesale: "Mayorista: consultar condiciones desde 10 unidades por WhatsApp.",
  deliveryAsuncion: "Entrega: mismo día en Asunción según disponibilidad.",
  deliveryInterior:
    "Interior: encomienda o envío coordinado; costo y plazo informados al confirmar pedido y ciudad.",
  whatsappDisplay: "+595 992 799 800",
  whatsappE164: "595992799800",
  siteUrl: "https://gabaon.store",
  usage:
    "Uso sugerido: rutina día y noche; Idebenone requiere activación previa de ampolla y cada máscara se aplica según su línea específica.",
  disclaimer: "Producto cosmético; no reemplaza tratamiento dermatológico."
};

export function formatFactsForPrompt() {
  const f = STORE_FACTS;
  const p = f.prices;
  return [
    `Empresa: ${f.company}.`,
    `Producto principal: ${f.product}.`,
    `Precios referenciales retail: Multipeptide ${p.multipeptide}; Idebenone ${p.idebenone}; Collagen Mask ${p.collagenMask}; Hyaluronic Mask ${p.hyaluronicMask}.`,
    `Kits: Rutina firmeza ${p.kitFirmeza}; Glow intensivo ${p.kitGlow}.`,
    `Resumen: ${f.priceGuarani}. ${f.priceNote}`,
    f.comboNote,
    f.wholesale,
    f.deliveryAsuncion,
    f.deliveryInterior,
    `Compra y consultas: WhatsApp ${f.whatsappDisplay} (${f.whatsappE164}).`,
    `Sitio: ${f.siteUrl}.`,
    f.usage,
    f.disclaimer
  ].join("\n");
}
