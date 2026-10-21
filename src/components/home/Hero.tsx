import { ArrowRight, ArrowDown } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";

// Carrosséis reais que a Move AI criou para o próprio Instagram
const stack = [
  { src: "/work/linha-01.webp", alt: "Carrossel da Move AI sobre a história da IA", r: "-9deg", cls: "left-0 top-16 z-10" },
  { src: "/work/meta-01.webp", alt: "Carrossel da Move AI sobre anúncios em vídeo da Meta", r: "4deg", cls: "left-[30%] top-0 z-20" },
  { src: "/work/google-01.webp", alt: "Carrossel da Move AI sobre a busca com IA do Google", r: "11deg", cls: "right-0 top-24 z-10" },
];

export function Hero() {
  const { openModal } = useContactModal();

  return (
    <section id="inicio" className="grain relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="mesh" aria-hidden="true"><span className="m1" /><span className="m2" /><span className="m3" /></div>

      <div className="section-container relative z-[2] grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-10 items-center">
        <div>
          <p className="kicker animate-fade-in">Estúdio digital · Guarulhos, SP</p>

          <h1 className="mt-7 text-[2.8rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem] font-bold tracking-[-0.035em] animate-fade-in-up">
            Sua empresa, construída para ser <span className="accent-word">vista</span>.
          </h1>

          <p className="mt-7 max-w-xl text-lg sm:text-xl leading-relaxed text-white/75 animate-fade-in-up" style={{ animationDelay: "120ms" }}>
            Site, marca, redes sociais e produto digital para pequenas e médias empresas.
            Acabamento de agência e conversa direta com quem faz.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: "220ms" }}>
            <button onClick={openModal} className="btn-gradient text-base">
              Quero minha análise gratuita <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#servicos" className="btn-ghost text-base">
              Ver o que fazemos <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          <p className="mt-5 text-sm text-white/55 animate-fade-in" style={{ animationDelay: "320ms" }}>
            Sem compromisso. A gente olha o seu site e as suas redes e diz o que ajustar primeiro.
          </p>
        </div>

        <div className="relative h-[420px] sm:h-[520px] lg:h-[600px] max-w-[560px] w-full mx-auto" aria-label="Exemplos do nosso trabalho">
          {stack.map((s, i) => (
            <figure
              key={s.src}
              className={`absolute w-[46%] sm:w-[44%] animate-float ${s.cls}`}
              style={{ ["--r" as string]: s.r, animationDelay: `${i * -2.3}s` }}
            >
              <img
                src={s.src}
                alt={s.alt}
                width={720}
                height={900}
                className="w-full h-auto rounded-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
                loading={i === 1 ? "eager" : "lazy"}
              />
            </figure>
          ))}
          <p className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent italic text-lg text-white/60">
            feito aqui, para o nosso Instagram
          </p>
        </div>
      </div>
    </section>
  );
}
