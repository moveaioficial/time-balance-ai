import { MessageCircle, Search, Code, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Diagnóstico",
    description: "Você nos conta sobre seus desafios e processos atuais. Escutamos ativamente.",
  },
  {
    icon: Search,
    number: "02",
    title: "Mapeamento",
    description: "Analisamos seu sistema e identificamos exatamente o que automatizar com maior impacto.",
  },
  {
    icon: Code,
    number: "03",
    title: "Implementação",
    description: "Desenvolvemos e entregamos a solução em 2-3 dias. Você acompanha em tempo real.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Lançamento",
    description: "Ativamos a automação com suporte completo na fase de go-live.",
  },
  {
    icon: TrendingUp,
    number: "05",
    title: "Escala",
    description: "Monitoramos, otimizamos e expandimos continuamente conforme seu negócio cresce.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="processo" className="py-20 lg:py-32">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 reveal">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Como <span className="text-gradient">funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Um processo transparente do início ao fim. Sem surpresas.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(180deg, transparent, rgba(124,58,237,0.4) 20%, rgba(59,130,246,0.4) 80%, transparent)" }} />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`reveal lg:flex items-center lg:gap-12 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Content card */}
                <div className={`lg:w-5/12 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className="gradient-border-card p-6 lg:p-8">
                    <span className="text-sm font-bold text-gradient">{step.number}</span>
                    <h3 className="text-xl font-semibold text-foreground mt-2 mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden lg:flex w-2/12 justify-center">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center z-10 relative"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)", boxShadow: "0 0 24px rgba(124,58,237,0.5)" }}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Mobile icon */}
                <div className="lg:hidden flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #3B82F6)" }}>
                    <step.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gradient">{step.number} — {step.title}</span>
                </div>

                {/* Spacer */}
                <div className="hidden lg:block lg:w-5/12" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20 reveal">
          <button
            onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}
            className="btn-gradient px-8 py-4 text-base"
          >
            Iniciar minha automação
          </button>
        </div>
      </div>
    </section>
  );
}
