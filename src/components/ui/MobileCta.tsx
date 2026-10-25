import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";

/**
 * Botão fixo no rodapé do celular: aparece depois que o visitante passa da abertura
 * e some perto do fim da página, onde já tem o CTA final. Deixa espaço para o botão do WhatsApp.
 */
export function MobileCta() {
  const { openModal } = useContactModal();
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const fim = document.documentElement.scrollHeight - window.innerHeight * 1.8;
      setVisivel(y > window.innerHeight * 0.7 && y < fim);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed left-4 right-[100px] z-40 md:hidden transition-all duration-300 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!visivel}
    >
      <button onClick={openModal} tabIndex={visivel ? 0 : -1} className="btn-gradient w-full justify-center text-base shadow-2xl min-h-[56px]">
        Quero minha análise <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
