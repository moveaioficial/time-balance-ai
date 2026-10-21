import { ArrowRight } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";
import { WHATSAPP_URL } from "@/lib/contato";

export function FinalCta() {
  const { openModal } = useContactModal();

  return (
    <section id="contato" className="grain relative overflow-hidden py-28 lg:py-40">
      <div className="mesh" aria-hidden="true"><span className="m1" /><span className="m2" /><span className="m3" /></div>
      <div className="section-container relative z-[2] text-center">
        <p className="kicker reveal justify-center">Análise gratuita</p>
        <h2 className="reveal mx-auto mt-6 max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.035em]">
          Como a sua empresa aparece <span className="accent-word">hoje</span>?
        </h2>
        <p className="reveal mx-auto mt-7 max-w-2xl text-lg sm:text-xl text-white/75 leading-relaxed">
          Mande o seu site ou o seu Instagram. A gente devolve uma análise com o que ajustar primeiro, sem compromisso.
        </p>
        <div className="reveal mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={openModal} className="btn-light text-base">
            Quero minha análise <ArrowRight className="w-4 h-4" />
          </button>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
