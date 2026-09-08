# Relatório final — GABAON.store (2026-09-08)

## A. Situação inicial
- Produção era landing única; `/productos/*` retornava **404**.
- SEO concentrado na homepage; title com mistura PT (“e”).
- Reviews duplicadas / estrelas sem AggregateRating legítimo.
- WhatsApp genérico sem contexto forte de produto/página.
- Analytics IDs vazios em `js/config.js`.

## B. Alterações realizadas
- Ecossistema estático gerado por `scripts/build-pages.mjs`.
- Homepage redesign editorial + Combo Premium ₲ 699.000.
- PDPs: Multipeptide, Idebenone, Collagen Mask, Hyaluronic Mask + Combo.
- Clusters: `/rutinas/`, `/ingredientes/`, `/blog/`, `/korean-skincare-*`, FAQ, envíos, contacto, privacidad.
- Design system: Cormorant + Manrope, paper/champagne, CSS `styles.css`.
- Deploy: commit `3f555f3` em `main` → Vercel produção.

## C. SEO
**Páginas:** 27 URLs no sitemap (incl. combo).
**Titles/descriptions:** únicos por URL.
**Schemas:** Organization, WebSite, ItemList, FAQPage (home); Product+Offer+Breadcrumb+FAQ (PDP); Article (blog).
**Internal linking:** produto ↔ rotina ↔ ingrediente ↔ blog ↔ WhatsApp.
**Sitemap / robots / canonical:** `https://gabaon.store` canônico.

## D. CRO
- CTA principal WhatsApp com mensagem por produto + UTM + página.
- Funil diagnóstico 4 passos → recomendação → WA.
- Mini-diagnóstico nas PDPs.
- Float “Comprar por WhatsApp”; eventos: `view_product`, `select_product`, `start/complete_skin_diagnostic`, `click_whatsapp`, `scroll_depth`, lead/chat.

## E. Performance
- WebP + preload hero combo; lazy abaixo da dobra; fonts Google com preconnect.
- Antes/depois Lighthouse: pendente medição pós-cache CDN.

## F. Visual
- Hero cinema split, trust strip, cards luxury, PDP gallery + buy panel.
- Remoção de estrelas agregadas fictícias na prova social.

## G. Bugs corrigidos
- 404 das URLs de produto em produção.
- Nav inconsistente entre home e páginas filhas.
- Favicon phoenix legado nas páginas geradas.
- CTA float genérico nas PDPs (agora herda produto).

## H. Pendências externas
1. Preencher `ga4MeasurementId` e `metaPixelId` em `js/config.js` (ou env).
2. Search Console: enviar novo sitemap.
3. Merchant Center: modelo WhatsApp limita free listings — ver `docs/MERCHANT-CENTER.md`.
4. Criativo flyer com claim “efecto tipo bótox” — revisar asset (risco cosmético/claims).
5. Coletar reviews reais PY com permissão.

## I. Próximos experimentos
1. A/B hero brand-first vs combo-first (impacto SEO vs promo).
2. CTA “Pedí el combo” vs “Comprar por WhatsApp”.
3. Landing Ads dedicada `/productos/combo-premium-gabaon/` com UTM.
4. Artigo blog “Multipeptide vs Idebenone”.
5. Quando houver checkout: ativar Merchant + eventos purchase.
