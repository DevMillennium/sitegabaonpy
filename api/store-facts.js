/**
 * Fonte única de fatos comerciais para o chat (alinhar preços/textos com a landing).
 */
export const STORE_FACTS = {
  company: "Gabaon Store Paraguay",
  product: "Gabaon Premium Multipeptide Cream 50ml",
  priceGuarani: "₲ 550.000",
  priceNote: "El precio publicado puede variar según promociones vigentes; confirmar por WhatsApp.",
  wholesale: "Mayorista: desde 10 unidades a ₲ 450.000.",
  deliveryAsuncion: "Entrega: mismo día en Asunción según disponibilidad.",
  deliveryInterior:
    "Interior: encomienda o envío coordinado; costo y plazo informados al confirmar pedido y ciudad.",
  whatsappDisplay: "+595 099 279 9800",
  whatsappE164: "595992799800",
  siteUrl: "https://gabaon.store",
  usage: "Uso sugerido: mañana y noche sobre piel limpia.",
  disclaimer: "Producto cosmético; no reemplaza tratamiento dermatológico."
};

export function formatFactsForPrompt() {
  const f = STORE_FACTS;
  return [
    `Empresa: ${f.company}.`,
    `Producto principal: ${f.product}.`,
    `Precio indicativo: ${f.priceGuarani}. ${f.priceNote}`,
    f.wholesale,
    f.deliveryAsuncion,
    f.deliveryInterior,
    `Compra y consultas: WhatsApp ${f.whatsappDisplay} (${f.whatsappE164}).`,
    `Sitio: ${f.siteUrl}.`,
    f.usage,
    f.disclaimer
  ].join("\n");
}
