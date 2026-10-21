import { Monitor, PenTool, LayoutGrid, Boxes, ArrowUpRight } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";

const services = [
  {
    icon: Monitor,
    n: "01",
    title: "Sites",
    text: "Site institucional, landing page e redesign. Feito para o cliente entender em segundos o que você vende e chamar você.",
    tags: ["Institucional", "Landing page", "Redesign"],
  },
  {
    icon: PenTool,
    n: "02",
    title: "Marca",
    text: "Logo, paleta, tipografia e guia de uso. A sua empresa com a mesma cara no site, no Instagram, na proposta e na fachada.",
    tags: ["Identidade visual", "Guia de marca", "Material de vendas"],
  },
  {
    icon: LayoutGrid,
    n: "03",
    title: "Redes sociais",
    text: "Posts e carrosséis todo mês, com padrão visual e texto que soa como gente. Conteúdo que faz a pessoa parar e lembrar de você.",
    tags: ["Carrosséis", "Posts", "Padrão visual"],
  },
  {
    icon: Boxes,
    n: "04",
    title: "Produto digital",
    text: "Ferramentas web sob medida para a sua operação, quando o seu negócio pede algo que nenhum sistema pronto resolve.",
    tags: ["Sistemas internos", "Painéis", "Sob medida"],
  },
];

export function Services() {
  const { openModal } = useContactModal();

  return (
    <section id="servicos" className="section-light on-light py-24 lg:py-32">
      <div className="section-container">
        <div className="max-w-3xl reveal">
          <p className="kicker">O que fazemos</p>
          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-[#0C0416]">
            Quatro frentes. O mesmo <span className="accent-word">cuidado</span>.
          </h2>
          <p className="mt-6 text-lg text-[#3E3650] leading-relaxed">
            Você pode começar por uma delas ou juntar todas. O importante é a sua empresa parecer, em todo lugar, a empresa que ela é.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <article
              key={s.title}
              className="reveal group relative overflow-hidden rounded-3xl border border-[#E5E1EE] bg-white p-8 lg:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(58,10,93,0.45)]"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="pointer-events-none absolute -right-4 -top-10 font-display text-[9rem] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(85,31,126,0.12)]">
                {s.n}
              </span>
              <div className="relative flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg" style={{ background: "var(--brand-gradient)" }}>
                  <s.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <ArrowUpRight className="h-6 w-6 text-[#551F7E] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </div>
              <h3 className="relative mt-8 text-3xl font-bold text-[#0C0416]">{s.title}</h3>
              <p className="relative mt-3 text-base leading-relaxed text-[#3E3650]">{s.text}</p>
              <ul className="relative mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <li key={t} className="rounded-full border border-[#E5E1EE] bg-[#F2F0F7] px-3.5 py-1.5 text-xs font-medium text-[#3A0A5D]">{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 reveal">
          <button onClick={openModal} className="btn-gradient text-base">Pedir análise gratuita</button>
          <p className="text-sm text-[#3E3650]">Não sabe por onde começar? A análise mostra o que vale mais a pena agora.</p>
        </div>
      </div>
    </section>
  );
}
