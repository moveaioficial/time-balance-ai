import { ArrowRight, ArrowDown } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  const { openModal } = useContactModal();

  return (
    <section id="inicio" className="grain relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="mesh" aria-hidden="true"><span className="m1" /><span className="m2" /><span className="m3" /></div>

      <div className="section-container relative z-[2] grid lg:grid-cols-[0.95fr_1.15fr] gap-14 lg:gap-14 items-center">
        <div>

          <h1 className="text-[2.8rem] leading-[1.02] sm:text-6xl lg:text-[4.3rem] xl:text-[5rem] font-bold tracking-[-0.035em] animate-fade-in-up">
            Sua empresa, construída para ser <span className="accent-word">vista</span>.
          </h1>

          <p className="mt-7 max-w-xl text-lg sm:text-xl leading-relaxed text-white/75 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
            Antes de falar com você, o cliente já decidiu se confia na sua empresa.
            A gente cuida do seu site, da sua marca e das suas redes para essa decisão ser a seu favor.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "220ms" }}>
            <button onClick={openModal} className="btn-gradient text-base">
              Quero parar de perder clientes
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider">análise gratuita</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#servicos" className="btn-ghost text-base">
              Ver o que fazemos <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
