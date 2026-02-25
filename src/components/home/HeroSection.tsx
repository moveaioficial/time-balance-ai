import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const counters = [
  { value: 5000, suffix: "+", label: "Horas Salvas" },
  { value: 120,  suffix: "+", label: "Processos Automatizados" },
  { value: 30,   suffix: "+", label: "Integrações Entregues" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

export function HeroSection() {
  const handleCTA = (anchor: string) => {
    const el = document.querySelector(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative flex items-center overflow-hidden" style={{ minHeight: "calc(100vh - 6rem)" }}>
      {/* Grid texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="section-container relative z-10 py-10 lg:py-14">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 bg-white/5 backdrop-blur mb-5 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-muted-foreground font-medium">Automação com IA • Resultados em dias</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-4 animate-fade-in-up animation-delay-200">
            Tornamos a tecnologia{" "}
            <span className="text-primary">mais humana</span>
            {", acessível e útil"}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-7 animate-fade-in-up animation-delay-400">
            Libertamos sua equipe do trabalho operacional para focar no que só o humano sabe fazer:{" "}
            <strong className="text-foreground">pensar, criar e decidir.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up animation-delay-600">
            <button
              onClick={() => handleCTA("#contato")}
              className="btn-gradient text-base px-8 py-3.5"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </button>
            <button
              onClick={() => handleCTA("#solucoes")}
              className="px-8 py-3.5 rounded-xl border border-white/12 bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-all duration-300"
            >
              Ver Soluções
            </button>
          </div>

          {/* Animated Counters */}
          <div className="mt-10 grid grid-cols-3 gap-6 animate-fade-in-up animation-delay-800">
            {counters.map((c) => (
              <div key={c.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                  <AnimatedCounter value={c.value} suffix={c.suffix} />
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
