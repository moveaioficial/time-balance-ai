# moveai.tech

Site da Move AI: transformar a presença digital da sua empresa.

- HTML, CSS e JavaScript puros, com Vite (build), GSAP e Lenis.
- `index.html` + `src/`: página inicial (intro da TV, abertura, busca, caminho, método, soluções, dúvidas e análise gratuita).
- `public/`: páginas fixas (`termos-de-uso/`, `politica-de-privacidade/`, `obrigado/`, `404.html`), fontes próprias (`fonts/`, SIL OFL), imagens, `sitemap.xml`, `robots.txt`, `llms.txt` e `ig/` (posts agendados do Instagram, usados pelo workflow `instagram-agendado`).
- `vercel.json`: build, redirecionamentos, cabeçalhos de segurança e CSP. O único script inline do `index.html` tem o hash liberado na CSP: se ele mudar, recalcule o hash.

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # gera dist/
```

A versão anterior (React) está na tag `backup-site-react-2026-11-18`.
