import { Sprout, RefreshCw, Target } from "lucide-react";

const cases = [
  { icon: Sprout, title: "Está começando", text: "e precisa aparecer do jeito certo desde o primeiro cliente: marca, site e um Instagram que passa confiança." },
  { icon: RefreshCw, title: "Já existe há anos", text: "mas o site e as redes não acompanharam. A empresa é melhor do que parece na internet." },
  { icon: Target, title: "Quer resultado, não jargão", text: "e prefere alguém que explique o que vai fazer, por que e quanto custa, sem enrolação." },
];

export function ForWho() {
  return (
    <section id="para-quem" className="section-light on-light py-24 lg:py-28">
      <div className="section-container">
        <div className="max-w-3xl reveal">
          <p className="kicker">Para quem</p>
          <h2 className="mt-5 text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-[#0C0416]">
            Pequenas e médias empresas que querem ser levadas a <span className="accent-word">sério</span>.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {cases.map((c, i) => (
            <div key={c.title} className="reveal rounded-3xl border border-[#E5E1EE] bg-white p-8" style={{ transitionDelay: `${i * 80}ms` }}>
              <c.icon className="h-7 w-7 text-[#551F7E]" strokeWidth={2} />
              <h3 className="mt-6 text-2xl font-bold text-[#0C0416]">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-[#3E3650]">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
