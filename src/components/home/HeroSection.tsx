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
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 animate-orb1 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-15 animate-orb2 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-8 animate-float-slow pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }} />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="section-container relative z-10 py-24 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 bg-white/5 backdrop-blur mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-muted-foreground font-medium">Automação com IA • Resultados em dias</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] mb-6 animate-fade-in-up animation-delay-200">
            Tornamos a tecnologia{" "}
            <span className="text-gradient">mais humana</span>
            {", acessível e útil"}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-400">
            Libertamos sua equipe do trabalho operacional para focar no que só o humano sabe fazer:{" "}
            <strong className="text-foreground">pensar, criar e decidir.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
            <button
              onClick={() => handleCTA("#contato")}
              className="btn-gradient text-base px-8 py-4 animate-pulse-glow"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </button>
            <button
              onClick={() => handleCTA("#solucoes")}
              className="px-8 py-4 rounded-xl border border-white/12 bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-all duration-300"
            >
              Ver Soluções
            </button>
          </div>

          {/* Animated Counters */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in-up animation-delay-800">
            {counters.map((c) => (
              <div key={c.label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2">
                  <AnimatedCounter value={c.value} suffix={c.suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
