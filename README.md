# Landing Garbaon - Phoenix Global Import

Landing page em espanhol (Paraguai) para venda do produto Garbaon, com foco em alta conversão.

## Arquivos principais

- `index.html`: estrutura completa da página
- `css/styles.css`: design premium responsivo
- `js/main.js`: lógica do formulário, A/B test e CTA para WhatsApp
- `js/config.js`: configuração de WhatsApp e Supabase
- `assets/img/garbaon-producto.png`: imagem do produto
- `assets/img/phoenix-identidad.png`: identidade visual da empresa
- `assets/video/phoenix-global-import.mp4`: vídeo institucional (adicionar manualmente)
- `supabase/schema.sql`: tabela e policy para receber leads

## Ajustes obrigatórios antes de publicar

1. Atualizar `js/config.js`:
   - `whatsappNumber`
   - `supabaseUrl`
   - `supabaseAnonKey`
2. Rodar `supabase/schema.sql` no SQL Editor do Supabase.
3. Adicionar o vídeo real da empresa em `assets/video/phoenix-global-import.mp4`.
4. Ajustar a URL final de produção nas metas (`index.html`, `robots.txt` e `sitemap.xml`), caso seja diferente.

## A/B test implementado

- Variante `A`: headline atual e CTA padrão.
- Variante `B`: headline orientada a benefício e CTA mais direto.
- O usuário recebe variante fixa por `localStorage` (`garbaon_ab_variant`).
- A variante é enviada junto ao lead no Supabase.

## Como abrir localmente

Abrir `index.html` diretamente no navegador.
