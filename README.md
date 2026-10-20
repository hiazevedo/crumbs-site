# crumbs-site (público)

Site de divulgação do Crumbs, publicado no GitHub Pages a partir da pasta `site/`.

- `site/index.html`, `style.css`, `app.js`: página estática, sem dependências externas (fontes embutidas, sem cookies nem rastreamento).
- `site/app.js`: a constante `WORKER_URL` aponta para o Worker que recebe os pedidos de convite.
- `.github/workflows/publicar.yml`: publica o site a cada push e de hora em hora, atualizando `stats.json` (downloads e convites aprovados).

Configuração: Settings → Pages → Source: **GitHub Actions**. Segredo `AUTOMACAO_TOKEN` em Settings → Secrets and variables → Actions.

Fontes: JetBrains Mono, licença SIL Open Font License (`site/fonts/OFL.txt`).
