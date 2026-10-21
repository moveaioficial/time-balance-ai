import { Zap, Eye, MessageCircle } from "lucide-react";

const pillars = [
  { icon: Eye, title: "Clareza", text: "Explicamos tudo sem jargão. Você sabe o que vai receber, quando e por quanto antes de começar." },
  { icon: Zap, title: "Eficiência", text: "Usamos IA para pesquisar, testar e produzir mais rápido. O tempo que sobra vai para o acabamento." },
  { icon: MessageCircle, title: "Proximidade", text: "Você fala direto com quem está fazendo o seu projeto, sem gerente no meio e sem fila." },
];

export function Method() {
  return (
    <section id="metodo" className="grain relative overflow-hidden py-24 lg:py-36">
      <div className="mesh opacity-60" aria-hidden="true"><span className="m2" /><span className="m3" /></div>
      <div className="section-container relative z-[2]">
        <p className="kicker reveal">Como a IA entra</p>
        <h2 className="reveal mt-6 max-w-5xl text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-[-0.035em]">
          IA no <span className="accent-word">método</span>. Gente no comando.
        </h2>
        <p className="reveal mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-white/75">
          A inteligência artificial deixa o nosso time pequeno rápido como um time grande. Mas quem decide, revisa e assina cada entrega somos nós.
          Você não compra tecnologia: compra um site, uma marca e um conteúdo que funcionam.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {pillars.map((p, i) => (
            <div key={p.title} className="reveal glass-card p-8" style={{ transitionDelay: `${i * 90}ms` }}>
              <p.icon className="h-7 w-7 text-[#00C3D0]" strokeWidth={2} />
              <h3 className="mt-6 text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 text-white/70 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
