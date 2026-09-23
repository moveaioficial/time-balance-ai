import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Volta ao topo ao trocar de página (sem interferir nas âncoras #secao). */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
