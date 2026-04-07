# Landing Garbaon — Gabaon Store

Landing em espanhol (Paraguai) para **Garbaon Premium Multipeptide Cream**, com CTAs para **WhatsApp** e teste A/B no hero.

## Produção

- **Domínio:** [https://gabaon.store/](https://gabaon.store/)
- **Deploy:** [Vercel](https://vercel.com/) (site estático: `index.html` na raiz).
- **`vercel.json`:** redirecionamentos 301 de `/garbaon` e `/index.html` para `/` (URL canónica única) e cabeçalhos de segurança básicos.
- **SEO:** `canonical`, Open Graph e `sitemap.xml` usam `https://gabaon.store/`.

## Arquivos principais

- `index.html` — estrutura da página
- `css/styles.css` — estilos
- `js/main.js` — A/B test, links WhatsApp, vídeo institucional, analytics opcional
- `js/config.js` — `whatsappNumber`, `siteUrl`, IDs GA4/Meta (opcionais)
- `js/chat.js` — widget de chat 24h no site (Fernanda)
- `api/chat.js` — endpoint serverless da Vercel integrado ao DeepSeek
- `assets/` — imagens e vídeos (logos, produto, reviews, modos de uso)
- `robots.txt` / `sitemap.xml` — SEO
- `supabase/schema.sql` — legado (não usado pela página atual; sem formulário de leads)

## Configuração

1. Em `js/config.js`: confirmar `whatsappNumber` (formato internacional sem `+`, ex. `595992799800`).
2. Opcional: preencher `ga4MeasurementId` e `metaPixelId` para métricas.
3. Configurar variável de ambiente na Vercel para o chat:

```bash
vercel env add DEEPSEEK_API_KEY production
```

Depois, informar a chave da API DeepSeek no prompt do comando.

## Ambiente local

Na pasta do projeto:

```bash
python3 -m http.server 8080
```

Abrir [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## A/B test

- Variantes `A` e `B` no hero (headline, texto e CTA), fixas por `localStorage` (`garbaon_ab_variant`).
- A variante é incluída na mensagem pré-preenchida do WhatsApp.
