import { useState } from "react";
import { X, TrendingUp, Clock, Zap } from "lucide-react";

const cases = [
  {
    tag: "Atendimento", title: "Agente de IA para E-commerce",
    summary: "Reduziu 80% das interações manuais em suporte ao cliente.", result: "80% menos suporte manual",
    problem: "Uma loja online recebia mais de 500 mensagens por dia no WhatsApp e Instagram. A equipe de 3 pessoas passava 6+ horas diárias apenas respondendo dúvidas repetitivas sobre status de pedido, troca e devolução.",
    solution: "Desenvolvemos um Agente de IA integrado ao WhatsApp e Instagram via Evolution API + Chatwoot. O agente responde automaticamente usando linguagem da marca, consulta pedidos em tempo real via API e escalona apenas casos complexos para humanos.",
    metric: "80%", metricLabel: "Redução em suporte manual", metric2: "6h", metricLabel2: "Horas/dia devolvidas à equipe",
    tools: ["WhatsApp", "Evolution API", "Chatwoot", "OpenAI", "n8n"],
  },
  {
    tag: "Leads", title: "Funil de Qualificação Automático",
    summary: "Triplicou a taxa de conversão de leads qualificados.", result: "3x mais conversões",
    problem: "Uma empresa B2B perdia leads por demora no follow-up. O time de vendas demorava em média 48h para responder, e a taxa de conversão era de 4%.",
    solution: "Criamos um funil automatizado no n8n que captura leads de formulários, qualifica via IA com base em fit, envia mensagem personalizada em menos de 2 minutos e agenda reunião automaticamente via Calendly.",
    metric: "3x", metricLabel: "Aumento na conversão", metric2: "< 2min", metricLabel2: "Tempo de primeiro contato",
    tools: ["n8n", "OpenAI", "Calendly", "HubSpot", "Make"],
  },
  {
    tag: "Análise", title: "Dashboard de Dados com IA",
    summary: "Insights em tempo real que antes levavam 3 dias para gerar.", result: "3 dias → 5 minutos",
    problem: "A equipe de marketing de uma franquia precisava de relatórios semanais que exigiam 3 dias de trabalho manual consolidando planilhas de 15 unidades.",
    solution: "Desenvolvemos um pipeline de dados automatizado que consolida relatórios de todas as unidades, aplica análise com IA para destacar anomalias e oportunidades, e gera um dashboard visual atualizado automaticamente a cada hora.",
    metric: "3 dias", metricLabel: "Reduzidos para 5 minutos", metric2: "15", metricLabel2: "Unidades integradas automaticamente",
    tools: ["AWS", "Python", "OpenAI", "Metabase", "n8n"],
  },
  {
    tag: "CRM", title: "CRM Inteligente com IA",
    summary: "Eliminou 90% das atualizações manuais no CRM.", result: "90% menos trabalho manual",
    problem: "Uma empresa de serviços tinha um CRM vazio porque vendedores não atualizavam. Reuniões, e-mails e chamadas não eram registrados, causando perda de contexto e retrabalho.",
    solution: "Integramos o CRM com automações que capturam atividades de e-mail, gravação de chamadas e WhatsApp. A IA resume conversas e atualiza o CRM automaticamente, incluindo próximos passos sugeridos.",
    metric: "90%", metricLabel: "Menos atualizações manuais", metric2: "100%", metricLabel2: "Histórico completo no CRM",
    tools: ["HubSpot", "OpenAI", "Zapier", "Twilio", "Make"],
  },
];

function CaseModal({ c, onClose }: { c: typeof cases[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden animate-fade-in-up"
        style={{ background: "hsl(230, 35%, 7%)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center transition-colors z-10">
          <X className="h-4 w-4 text-foreground" />
        </button>

        <div className="p-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/15 border border-primary/20 text-primary font-medium">{c.tag}</span>
          <h3 className="text-2xl font-bold text-foreground mt-3 mb-1">{c.title}</h3>
          <p className="text-muted-foreground">{c.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 pb-4">
          <div className="rounded-xl p-4 text-center bg-primary/10 border border-primary/20">
            <div className="text-3xl font-bold text-primary">{c.metric}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.metricLabel}</div>
          </div>
          <div className="rounded-xl p-4 text-center bg-primary/10 border border-primary/20">
            <div className="text-3xl font-bold text-primary">{c.metric2}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.metricLabel2}</div>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-red-400" /> Problema</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.problem}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Solução</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{c.solution}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Ferramentas</h4>
            <div className="flex flex-wrap gap-2">
              {c.tools.map((t) => (
                <span key={t} className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })} className="btn-gradient w-full py-3">
            Quero uma solução como essa
          </button>
        </div>
      </div>
    </div>
  );
}

export function PortfolioSection() {
  const [selected, setSelected] = useState<typeof cases[0] | null>(null);

  return (
    <section id="casos" className="py-20 lg:py-32 bg-card/30">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Cases de <span className="text-primary">Sucesso</span>
          </h2>
          <p className="text-lg text-muted-foreground">Resultados reais de empresas reais. Clique para ver os detalhes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <div key={c.title} className="reveal cursor-pointer" style={{ transitionDelay: `${i * 100}ms` }} onClick={() => setSelected(c)}>
              <div className="gradient-border-card p-6 lg:p-8 h-full group hover:shadow-[0_8px_32px_rgba(59,130,246,0.2)] transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/15 border border-primary/20 text-primary font-medium">{c.tag}</span>
                  <TrendingUp className="h-5 w-5 text-green-400 opacity-70" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{c.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{c.result}</span>
                  <span className="text-xs text-primary hover:text-foreground transition-colors font-medium">Ver detalhes →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && <CaseModal c={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
