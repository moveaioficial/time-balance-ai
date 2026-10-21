import { useState } from "react";
import { MousePointerClick, Smartphone, MessageCircle, ChevronsLeftRight } from "lucide-react";

// Antes e depois arrastável. "Sua empresa" é genérica de propósito: não é cliente, é o leitor.
// As duas telas usam unidades cqw para escalar junto com a largura do quadro.

function Antes() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#ECECEC] text-[#333]" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div className="bg-[#2B4C9B] px-[3cqw] py-[1.6cqw] text-white" style={{ fontFamily: "Arial, sans-serif" }}>
        <p className="text-[clamp(14px,3.4cqw,30px)] font-bold tracking-wide">SUA EMPRESA LTDA</p>
        <p className="mt-[0.4cqw] text-[clamp(9px,1.4cqw,13px)] underline opacity-90">Home | Quem Somos | Serviços | Galeria | Contato</p>
      </div>
      <div className="flex-1 px-[3cqw] py-[2.4cqw]">
        <p className="text-center text-[clamp(15px,3cqw,28px)] font-bold text-[#B22222]">Seja bem-vindo ao nosso site!!</p>
        <div className="mt-[2cqw] flex flex-col sm:flex-row gap-[2.4cqw]">
          <div className="flex h-[clamp(70px,16cqw,150px)] sm:w-[34%] shrink-0 items-center justify-center border-2 border-dashed border-[#999] bg-[#D6D6D6] text-[clamp(10px,1.4cqw,13px)] text-[#777]">
            foto_fachada_2014.jpg
          </div>
          <p className="text-[clamp(10px,1.45cqw,14px)] leading-snug text-[#555]">
            A Sua Empresa atua no mercado há muitos anos oferecendo soluções de qualidade com excelência,
            comprometimento e responsabilidade para todos os nossos clientes e parceiros. Nossa missão é superar
            as expectativas através de um atendimento diferenciado. Para mais informações sobre nossos produtos
            e serviços, entre em contato pelo telefone ou e-mail ou visite a nossa sede.
          </p>
        </div>
        <p className="mt-[2cqw] text-[clamp(10px,1.5cqw,14px)] text-[#0000EE] underline">Clique aqui para saber mais</p>
        <p className="mt-[3cqw] text-[clamp(12px,2cqw,20px)] font-bold text-[#2B4C9B]">NOSSOS PRODUTOS</p>
        <div className="mt-[1.4cqw] grid w-full sm:w-[62%] grid-cols-3 gap-[1.6cqw]">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex aspect-[16/10] items-center justify-center border border-[#AAA] bg-[#DCDCDC] text-[clamp(9px,1.3cqw,13px)] text-[#777]">
              produto{n}.jpg
            </div>
          ))}
        </div>
        <p className="mt-[2cqw] text-center text-[clamp(9px,1.3cqw,13px)] text-[#777]">Você é o visitante nº 004187</p>
      </div>
      <div className="bg-[#C9C9C9] px-[3cqw] py-[1cqw] text-[clamp(8px,1.1cqw,11px)] text-[#666]" style={{ fontFamily: "Arial, sans-serif" }}>
        Melhor visualizado em 1024x768 · Última atualização: 03/2014
      </div>
    </div>
  );
}

function Depois() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#0B0614] text-white">
      <div className="pointer-events-none absolute -right-[10cqw] -top-[14cqw] h-[48cqw] w-[48cqw] rounded-full bg-[#551F7E] opacity-60 blur-[8cqw]" />
      <div className="pointer-events-none absolute -bottom-[18cqw] left-[20cqw] h-[40cqw] w-[40cqw] rounded-full bg-[#225C9E] opacity-50 blur-[8cqw]" />

      <div className="relative flex items-center justify-between px-[4cqw] py-[2.2cqw]">
        <span className="flex items-center gap-[1cqw] font-display text-[clamp(12px,1.9cqw,18px)] font-bold">
          <span className="h-[clamp(14px,2.2cqw,22px)] w-[clamp(14px,2.2cqw,22px)] rounded-[30%]" style={{ background: "var(--brand-gradient)" }} />
          Sua empresa
        </span>
        <span className="hidden sm:flex gap-[2.4cqw] text-[clamp(9px,1.3cqw,13px)] text-white/60">
          <span>O que fazemos</span><span>Como funciona</span><span>Contato</span>
        </span>
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-[4cqw] pb-[3cqw]">
        <p className="font-display text-[clamp(9px,1.2cqw,12px)] font-semibold uppercase tracking-[0.25em] text-[#4DDDE7]">Atendimento em todo o estado</p>
        <p className="mt-[1.4cqw] max-w-[80%] font-display text-[clamp(22px,5.4cqw,54px)] font-bold leading-[1.02] tracking-[-0.03em]">
          O que você faz, entendido <span className="font-accent font-normal italic text-[#4DDDE7]">de relance</span>.
        </p>
        <p className="mt-[1.6cqw] max-w-[62%] text-[clamp(11px,1.6cqw,16px)] leading-snug text-white/70">
          Uma frase clara, uma prova de confiança e um caminho direto até a conversa.
        </p>
        <div className="mt-[2.6cqw] flex flex-wrap items-center gap-[1.4cqw]">
          <span className="rounded-full px-[2.6cqw] py-[1.1cqw] text-[clamp(10px,1.4cqw,14px)] font-semibold" style={{ background: "var(--brand-gradient)" }}>
            Pedir orçamento
          </span>
          <span className="flex items-center gap-[0.8cqw] rounded-full border border-white/20 px-[2.2cqw] py-[1.1cqw] text-[clamp(10px,1.4cqw,14px)] text-white/85">
            <MessageCircle className="h-[1.2em] w-[1.2em]" /> WhatsApp
          </span>
        </div>
      </div>

      <div className="relative grid grid-cols-3 gap-[1.6cqw] px-[4cqw] pb-[4cqw]">
        {[
          { t: "Instalação", c: "linear-gradient(135deg,#48156F,#225C9E)" },
          { t: "Manutenção", c: "linear-gradient(160deg,#225C9E,#00C3D0)" },
          { t: "Projetos", c: "linear-gradient(200deg,#551F7E,#48156F)" },
        ].map(({ t, c }) => (
          <div key={t} className="overflow-hidden rounded-[1.6cqw] bg-white/[0.05] ring-1 ring-white/10">
            <div className="aspect-[16/9]" style={{ background: c }} />
            <p className="px-[1.6cqw] py-[1.2cqw] font-display text-[clamp(10px,1.5cqw,15px)] font-semibold">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const points = [
  { Icon: MousePointerClick, title: "Entende na hora", text: "O visitante sabe o que você faz antes de rolar a página." },
  { Icon: Smartphone, title: "Pensado no celular", text: "Fica bom na tela pequena, que é onde muita gente vai te conhecer." },
  { Icon: MessageCircle, title: "Leva até a conversa", text: "Cada seção aponta para o mesmo lugar: falar com você." },
];

export function BeforeAfter() {
  const [pos, setPos] = useState(50);

  return (
    <section id="na-pratica" className="grain relative overflow-hidden py-24 lg:py-32">
      <div className="section-container relative z-[2]">
        <div className="max-w-3xl reveal">
          <p className="kicker">Na prática</p>
          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.03]">
            Mesma empresa. <span className="accent-word">Outra</span> primeira impressão.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            Arraste e compare. De um lado, o site que só existe. Do outro, o site que trabalha por você.
          </p>
        </div>

        <div className="reveal mt-14">
          <div className="mb-4 flex items-center justify-between font-display text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-white/55">Antes</span>
            <span className="hidden sm:block font-accent text-base normal-case italic tracking-normal text-white/50">arraste para comparar</span>
            <span className="text-[#4DDDE7]">Depois</span>
          </div>
          <div
            className="relative aspect-[4/5] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(85,31,126,0.8)] select-none"
            style={{ containerType: "inline-size" }}
          >
            <Antes />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
              <Depois />
            </div>

            <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,195,208,0.8)]" style={{ left: `${pos}%` }}>
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0C0416] shadow-xl">
                <ChevronsLeftRight className="h-5 w-5" />
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Arraste para comparar o antes e o depois"
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {points.map(({ Icon, title, text }, i) => (
            <div key={title} className="reveal dark-card p-6" style={{ transitionDelay: `${i * 80}ms` }}>
              <Icon className="h-6 w-6 text-[#4DDDE7]" />
              <p className="mt-4 font-display text-lg font-semibold">{title}</p>
              <p className="mt-2 text-white/65 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
