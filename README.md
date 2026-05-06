# Landing Gabaon — Gabaon Store

Landing em espanhol (Paraguai) para **Gabaon Idebenone Prestige Ampoule (kit 3x10mL)**, com CTAs para **WhatsApp** e teste A/B no hero.

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
- `js/chat.js` — widget de chat 24h (Fernanda), orquestração no servidor, handoff WhatsApp, lead opcional
- `api/chat.js` — DeepSeek com `response_format: json_object`, rate limit, FAQ/privacidade extraídos do site
- `api/lead.js` — gravação opcional de leads no Supabase (`landing_leads`)
- `api/store-facts.js` — preços e dados comerciais (fonte única para o prompt)
- `api/knowledge-bundle.js` — texto gerado por `npm run extract:knowledge` a partir do `index.html`
- `scripts/extract-knowledge.mjs` — atualiza o bundle quando mudar FAQ ou política de privacidade
- `assets/` — imagens e vídeos (logos, produto, reviews, modos de uso)
- `robots.txt` / `sitemap.xml` — SEO
- `supabase/schema.sql` — tabela `landing_leads` (opcional; usada se configurar Supabase no deploy)
- `supabase/migration_add_email_landing_leads.sql` — coluna `email` em bases já existentes

## Configuração

1. Em `js/config.js`: confirmar `whatsappNumber` (formato internacional sem `+`, ex. `595992799800`).
2. Opcional: preencher `ga4MeasurementId` e `metaPixelId` para métricas.
3. Configurar variável de ambiente na Vercel para o chat:

```bash
vercel env add DEEPSEEK_API_KEY production
```

Depois, informar a chave da API DeepSeek no prompt do comando.

4. Opcional — leads do chat no Supabase (mesma tabela `landing_leads`; políticas RLS como no `schema.sql`):

```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
```

Se a tabela já existir sem a coluna `email`, executar `supabase/migration_add_email_landing_leads.sql` no SQL Editor do Supabase.

5. Ao alterar FAQ ou a seção de privacidade no `index.html`, regerar a base de texto do chat:

```bash
npm run extract:knowledge
```

## Ambiente local

Na pasta do projeto:

```bash
python3 -m http.server 8080
```

Abrir [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## A/B test

- Variantes `A` e `B` no hero (headline, texto e CTA), fixas por `localStorage` (`garbaon_ab_variant`).
- A variante é incluída na mensagem pré-preenchida do WhatsApp e enviada ao endpoint `/api/chat` para contexto da Fernanda.
