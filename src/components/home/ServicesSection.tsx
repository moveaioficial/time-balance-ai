import { useRef } from "react";
import { MessageSquare, BarChart3, Users, BrainCircuit, Sparkles } from "lucide-react";

const services = [
  {
    icon: MessageSquare,
    title: "Automação de Atendimento",
    description:
      "Chatbots e agentes de IA que respondem 24/7 com a voz da sua empresa. Integração com WhatsApp, Instagram e mais.",
    tags: ["WhatsApp", "Chatwoot", "IA"],
  },
  {
    icon: Users,
    title: "Geração e Qualificação de Leads",
    description:
      "Funis automatizados que capturam, qualificam e nutrem leads enquanto sua equipe foca em fechar negócios.",
    tags: ["n8n", "CRM", "Make"],
  },
  {
    icon: BarChart3,
    title: "Análise de Dados com IA",
    description:
      "Dashboards inteligentes que transformam dados brutos em insights acionáveis e decisões mais rápidas.",
    tags: ["OpenAI", "AWS", "SQL"],
  },
  {
    icon: BrainCircuit,
    title: "CRM Inteligente + IA",
    description:
      "Enriqueça seu CRM com automações que registram, atualizam e priorizam contatos sem esforço manual.",
    tags: ["Zapier", "HubSpot", "IA"],
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease-out" }}
      className="h-full"
    >
      {children}
    </div>
  );
}

export function ServicesSection() {
  return (
    <section id="solucoes" className="py-20 lg:py-32">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/12 bg-white/5 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Nossas Soluções</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Automação que se adapta ao{" "}
            <span className="text-primary">seu negócio</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Não mudamos o que funciona. Potencializamos com IA.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <div key={service.title} className={`reveal`} style={{ transitionDelay: `${i * 100}ms` }}>
              <TiltCard>
                <div className="gradient-border-card h-full p-8 cursor-default group">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-primary"
                  >
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>

        {/* Custom solutions CTA */}
        <div className="mt-8 reveal">
          <div className="rounded-2xl p-8 lg:p-10 border border-primary/25 text-center bg-primary/5">
            <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Solução Customizada</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Seu processo é único. Nós analisamos sua operação e desenhamos uma automação sob medida. <strong className="text-foreground">Você pede, nós cumprimos.</strong>
            </p>
            <button
              onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-gradient px-8 py-3"
            >
              Solicitar Proposta Personalizada
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
