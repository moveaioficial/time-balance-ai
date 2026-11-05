import { useEffect } from "react";
import { canonicalUrl, type PageSeo } from "@/lib/seo";

/** Define o título da aba enquanto a página estiver montada. */
export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

function setMeta(attr: "name" | "property", key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (href === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Título, descrição, canônica, Open Graph e robots da página (dados em src/lib/seo.ts).
 * O HTML gerado no build já vem com os mesmos valores; isto mantém tudo certo
 * quando a pessoa navega entre as páginas sem recarregar.
 */
export function useSeo(page: PageSeo) {
  useEffect(() => {
    const url = canonicalUrl(page.path);
    document.title = page.title;
    setMeta("name", "description", page.description);
    setMeta("property", "og:title", page.title);
    setMeta("property", "og:description", page.description);
    setMeta("name", "twitter:title", page.title);
    setMeta("name", "twitter:description", page.description);
    setMeta("name", "robots", page.noindex ? "noindex, follow" : null);
    setMeta("property", "og:url", page.noindex ? null : url);
    setCanonical(page.noindex ? null : url);
  }, [page]);
}
