import { defineConfig, type Plugin } from "vite";
import fs from "fs";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { SEO, canonicalUrl } from "./src/lib/seo";

// SEO (04/11/2026): o site é um app React, então todas as rotas recebiam o mesmo index.html,
// com o título e a canônica da página inicial. Depois do build, este plugin grava um HTML por
// rota (dist/termos-de-uso/index.html etc.) com título, descrição, canônica e Open Graph certos,
// e um dist/404.html com noindex. Os dados ficam em src/lib/seo.ts.
function paginasSeo(): Plugin {
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return {
    name: "paginas-seo",
    apply: "build",
    closeBundle() {
      const dist = path.resolve(__dirname, "dist");
      const base = fs.readFileSync(path.join(dist, "index.html"), "utf8");
      for (const page of Object.values(SEO)) {
        const t = esc(page.title);
        const d = esc(page.description);
        const url = canonicalUrl(page.path);
        let html = base
          .replace(/<title>[^<]*<\/title>/, () => `<title>${t}</title>`)
          .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*/g, (_m, a) => a + d)
          .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*/g, (_m, a) => a + t);
        if (page.noindex) {
          html = html
            .replace(/\s*<link rel="canonical"[^>]*>/, "")
            .replace(/\s*<meta property="og:url"[^>]*>/, "")
            .replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n    <meta name="robots" content="noindex, follow" />');
        } else {
          html = html
            .replace(/(<link rel="canonical" href=")[^"]*/, (_m, a) => a + url)
            .replace(/(<meta property="og:url" content=")[^"]*/, (_m, a) => a + url);
        }
        const out = page.path === "/" ? "index.html" : page.path === "/404" ? "404.html" : path.join(page.path.slice(1), "index.html");
        fs.mkdirSync(path.dirname(path.join(dist, out)), { recursive: true });
        fs.writeFileSync(path.join(dist, out), html);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), paginasSeo()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Separa o React num arquivo próprio (cache melhor entre deploys)
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
            return "react";
          }
        },
      },
    },
  },
}));
