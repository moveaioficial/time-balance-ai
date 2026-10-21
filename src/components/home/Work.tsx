import { Instagram } from "lucide-react";

// Trabalho próprio da Move AI: carrosséis criados e publicados no nosso Instagram.
const items = [
  { src: "/work/linha-01.webp", alt: "Capa do carrossel sobre a linha do tempo da IA" },
  { src: "/work/meta-06.webp", alt: "Slide sobre como a IA da Meta gera vídeo a partir de foto" },
  { src: "/work/google-05.webp", alt: "Slide didático sobre consistência de dados entre canais" },
  { src: "/work/muse-01.webp", alt: "Capa do carrossel sobre o agente Muse, da Meta" },
  { src: "/work/linha-05.webp", alt: "Slide sobre a Siri e o Transformer na linha do tempo da IA" },
  { src: "/work/meta-01.webp", alt: "Capa do carrossel sobre vídeo de anúncio feito a partir de foto" },
  { src: "/work/google-01.webp", alt: "Capa do carrossel sobre o link oficial na busca com IA do Google" },
  { src: "/work/muse-05.webp", alt: "Slide com simulação de conversa com um agente de compras" },
  { src: "/work/linha-10.webp", alt: "Slide de chamada para análise gratuita" },
];

export function Work() {
  return (
    <section id="trabalho" className="grain relative overflow-hidden py-24 lg:py-32">
      <div className="section-container relative z-[2]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl reveal">
            <p className="kicker">Feito por nós</p>
            <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.03]">
              A gente começa <span className="accent-word">pela própria casa</span>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/75">
              A marca, o site e o conteúdo da Move AI são feitos pelo mesmo time que vai cuidar da sua empresa.
              Estes são carrosséis que criamos e publicamos no nosso Instagram: pesquisa, texto, direção de arte e design.
            </p>
          </div>
          <a
            href="https://www.instagram.com/moveai.oficial"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost reveal self-start lg:self-auto"
          >
            <Instagram className="h-4 w-4" /> Ver no @moveai.oficial
          </a>
        </div>

        <div className="mt-14 columns-2 md:columns-3 gap-4 [&>*]:mb-4">
          {items.map((it, i) => (
            <figure key={it.src} className="reveal group relative overflow-hidden rounded-2xl ring-1 ring-white/10 break-inside-avoid" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
              <img
                src={it.src}
                alt={it.alt}
                width={720}
                height={900}
                loading="lazy"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07040C]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
