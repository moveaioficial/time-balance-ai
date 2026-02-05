import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Search, Code, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Você descreve o problema",
    description: "Conte-nos sobre seus desafios e o que gostaria de automatizar",
  },
  {
    icon: Search,
    number: "02",
    title: "Analisamos seu sistema atual",
    description: "Entendemos suas ferramentas e processos para propor a melhor solução",
  },
  {
    icon: Code,
    number: "03",
    title: "Propomos a melhor solução",
    description: "Você recebe um plano claro com prazos e investimento",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Implementamos e acompanhamos",
    description: "Colocamos em prática e garantimos que tudo funcione perfeitamente",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Como <span className="text-gradient">funciona</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Um processo simples e transparente do início ao fim
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                )}
                
                <div className="relative z-10 text-center lg:text-left">
                  <div className="w-16 h-16 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-primary to-brand-blue flex items-center justify-center mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gradient">{step.number}</span>
                  <h3 className="text-lg font-semibold mt-2 mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/contato">
            <button className="btn-gradient text-base px-8 py-4">
              Começar minha automação
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
