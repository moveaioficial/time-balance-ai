import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Volta ao topo ao trocar de página; se o link tiver #secao (ex.: /#faq vindo da 404), rola até ela. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // espera a página nova montar antes de procurar a seção
      const t = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ block: "start" }), 120);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
