const steps = [
  { n: "01", title: "Análise gratuita", text: "Olhamos o seu site, as suas redes e a sua marca e mostramos o que está travando o cliente." },
  { n: "02", title: "Proposta fechada", text: "Escopo, prazo e valor por escrito, antes de começar. Sem surpresa no meio do caminho." },
  { n: "03", title: "Criação com você", text: "Você acompanha, comenta e aprova cada etapa. Nada vai ao ar sem o seu ok." },
  { n: "04", title: "Entrega e ajustes", text: "Publicamos, ajustamos o que for preciso e seguimos por perto depois da entrega." },
];

export function Process() {
  return (
    <section id="processo" className="relative bg-[#0C0416] py-24 lg:py-32 border-y border-white/10">
      <div className="section-container">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          <div className="lg:sticky lg:top-28 reveal">
            <p className="kicker">Como trabalhamos</p>
            <h2 className="mt-5 text-4xl sm:text-5xl font-bold tracking-[-0.03em] leading-[1.05]">
              Do primeiro papo ao site no ar, <span className="accent-word">sem mistério</span>.
            </h2>
            <div className="mt-10 inline-flex items-center gap-5 rounded-2xl p-6 pr-8 text-white" style={{ background: "var(--brand-gradient)" }}>
              <span className="font-display text-6xl font-bold leading-none">3</span>
              <span className="font-display text-lg font-semibold leading-tight">dias de teste<br /><span className="font-sans text-sm font-normal text-white/80">para você conhecer o nosso trabalho</span></span>
            </div>
          </div>

          <ol className="relative">
            <span className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-[#00C3D0] via-[#551F7E] to-transparent" aria-hidden="true" />
            {steps.map((s, i) => (
              <li key={s.n} className="reveal relative flex gap-7 pb-12 last:pb-0" style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="relative z-[1] flex h-14 w-14 flex-none items-center justify-center rounded-full border border-[#00C3D0]/60 bg-[#07040C] font-display text-lg font-bold text-[#4DDDE7]">
                  {s.n}
                </span>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 max-w-lg text-white/70 leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
