import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "Quanto tempo leva para implementar uma automação?", a: "A maioria das automações é entregue em 2 a 5 dias úteis após o diagnóstico. Projetos mais complexos com múltiplas integrações podem levar de 1 a 2 semanas. Sempre comunicamos prazos claros antes de iniciar." },
  { q: "Preciso mudar meu sistema atual para usar a MoveAI?", a: "Não. Essa é nossa principal diferença. Nós nos adaptamos ao que você já usa — seu CRM, WhatsApp, ferramentas internas. Não forçamos a adoção de novas plataformas." },
  { q: "Como funciona o modelo de contratação?", a: "Trabalhamos com contratos flexíveis sem multas de rescisão. Você pode cancelar a qualquer momento. Oferecemos tanto projetos pontuais (por escopo) quanto contratos de retainer mensal para automações contínuas." },
  { q: "Minha equipe precisa aprender a usar as ferramentas?", a: "O objetivo é o oposto: reduzir o trabalho da sua equipe. As automações rodam em background. Onde houver interface, entregamos treinamento simples e documentação clara." },
  { q: "Quais tipos de processos vocês conseguem automatizar?", a: "Atendimento ao cliente (WhatsApp, e-mail, redes sociais), geração e qualificação de leads, relatórios e dashboards, CRM, onboarding de clientes, integração entre sistemas, análise de dados com IA, e muito mais." },
  { q: "Como garantem a qualidade das entregas?", a: "Cada projeto passa por fase de testes com cenários reais antes do lançamento. Acompanhamos o go-live e disponibilizamos suporte nas primeiras semanas. Monitoramos métricas continuamente." },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-32">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">Tire suas dúvidas antes de conversar com a gente.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="reveal rounded-2xl border border-white/8 overflow-hidden transition-colors hover:border-primary/25"
                style={{
                  background: open === i ? "rgba(59,130,246,0.06)" : "hsl(230, 35%, 8%)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <button className="w-full flex items-center justify-between p-5 lg:p-6 text-left gap-4" onClick={() => setOpen(open === i ? null : i)}>
                  <span className="font-medium text-foreground leading-snug">{faq.q}</span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all ${open === i ? "bg-primary" : "bg-white/5"}`}>
                    {open === i ? <Minus className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>
                {open === i && (
                  <div className="px-5 lg:px-6 pb-5 lg:pb-6 animate-fade-in-up">
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
