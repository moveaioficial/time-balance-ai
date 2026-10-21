import { useEffect, useRef, useState } from "react";
import { MousePointerClick, Smartphone, MessageCircle, ChevronsLeftRight, Snowflake, Wrench, ClipboardCheck, Phone } from "lucide-react";

// Antes e depois arrastável do MESMO site (empresa fictícia de climatização, só para ilustrar).
// As medidas internas são em "em": o quadro define o tamanho base (maior no celular), e tudo escala junto.

function Antes() {
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-[#555]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div className="flex justify-between bg-[#1F3A93] px-[3em] py-[0.5em] text-[0.8em] text-white">
        <span>☎ (11) 0000-0000 &nbsp;|&nbsp; ✉ contato@seusite.com.br</span>
        <span className="hidden sm:inline">Siga-nos: f &nbsp; in &nbsp; ▶</span>
      </div>

      <div className="flex items-center justify-between px-[3em] py-[1.2em] border-b-[0.3em] border-[#F7941D]">
        <span className="flex items-center gap-[0.6em]">
          <span className="flex h-[2.4em] w-[2.4em] items-center justify-center rounded-full bg-[#29ABE2] text-[1.3em] text-white">❄</span>
          <span className="leading-none">
            <span className="block text-[1.7em] font-bold text-[#1F3A93]">SUA EMPRESA</span>
            <span className="block text-[1em] italic text-[#F7941D]">Climatização</span>
          </span>
        </span>
        <span className="hidden sm:flex gap-[1.6em] text-[0.85em] font-bold text-[#777]">
          <span className="text-[#F7941D]">HOME</span><span>EMPRESA</span><span>SERVIÇOS</span><span>GALERIA</span><span>CONTATO</span>
        </span>
        <span className="sm:hidden text-[1.6em] text-[#777]">≡</span>
      </div>

      <div
        className="relative flex h-[17em] items-center justify-center text-center"
        style={{
          backgroundColor: "#7D8FA6",
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle at 75% 60%, rgba(40,60,90,.5), transparent 45%), repeating-linear-gradient(45deg, rgba(255,255,255,.05) 0 2px, transparent 2px 5px)",
        }}
      >
        <span className="absolute left-[1em] text-[2.6em] text-white/70">‹</span>
        <span className="absolute right-[1em] text-[2.6em] text-white/70">›</span>
        <div className="px-[4em]">
          <p className="text-[2em] font-bold uppercase leading-tight text-white" style={{ textShadow: "2px 2px 4px #000" }}>
            Qualidade e compromisso em climatização
          </p>
          <p className="mt-[0.6em] text-[1em] text-white" style={{ textShadow: "1px 1px 2px #000" }}>
            Há anos oferecendo as melhores soluções em ar-condicionado para você e sua empresa!
          </p>
          <span className="mt-[1em] inline-block bg-[#F7941D] px-[1.4em] py-[0.5em] text-[0.9em] font-bold text-white">SAIBA MAIS</span>
        </div>
        <div className="absolute bottom-[0.8em] flex gap-[0.5em]">
          <span className="h-[0.6em] w-[0.6em] rounded-full bg-white" />
          <span className="h-[0.6em] w-[0.6em] rounded-full bg-white/50" />
          <span className="h-[0.6em] w-[0.6em] rounded-full bg-white/50" />
        </div>
      </div>

      <div className="flex-1 px-[3em] py-[1.6em] text-center">
        <p className="text-[1.4em] font-bold text-[#1F3A93]">NOSSOS SERVIÇOS</p>
        <span className="mx-auto mt-[0.3em] block h-[0.25em] w-[4em] bg-[#F7941D]" />
        <div className="mt-[1.4em] grid grid-cols-3 gap-[1.6em]">
          {["INSTALAÇÃO", "MANUTENÇÃO", "CONTRATO PMOC"].map((t) => (
            <div key={t}>
              <span className="mx-auto flex h-[3em] w-[3em] items-center justify-center rounded-full bg-[#F7941D] text-[1.2em] text-white">✔</span>
              <p className="mt-[0.6em] text-[0.95em] font-bold text-[#1F3A93]">{t}</p>
              <p className="mt-[0.4em] hidden sm:block text-[0.75em] leading-snug">
                Realizamos serviços com qualidade e excelência, sempre buscando a total satisfação dos nossos clientes.
              </p>
              <p className="mt-[0.4em] text-[0.75em] font-bold text-[#F7941D]">LEIA MAIS »</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#333] px-[3em] py-[0.6em] text-center text-[0.7em] text-[#aaa]">
        © 2014 Sua Empresa Climatização · Todos os direitos reservados
      </div>
    </div>
  );
}

function Depois() {
  const services = [
    { src: "/img/clima-instalacao.webp", t: "Instalação", d: "Split e multi-split, com acabamento limpo." },
    { src: "/img/clima-manutencao.webp", t: "Manutenção", d: "Limpeza, carga de gás e revisão." },
    { src: "/img/clima-contrato.webp", t: "Contrato PMOC", d: "Plano mensal e laudo para empresas." },
  ];
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-white text-[#0E1B2C]" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex items-center justify-between border-b border-[#0E1B2C]/[0.08] px-[3em] py-[1.1em]">
        <span className="flex items-center gap-[0.6em]">
          <span className="flex h-[2.1em] w-[2.1em] items-center justify-center rounded-[0.55em] bg-[#0E5BD8] text-white">
            <Snowflake className="h-[1.15em] w-[1.15em]" strokeWidth={2.4} />
          </span>
          <span className="font-display text-[1.3em] font-bold tracking-[-0.02em]">Sua Empresa<span className="text-[#0E5BD8]">.</span></span>
        </span>
        <span className="hidden sm:flex items-center gap-[2em] text-[0.9em] font-medium text-[#0E1B2C]/70">
          <span>Serviços</span><span>Para empresas</span><span>Sobre</span>
          <span className="flex items-center gap-[0.45em] font-semibold text-[#0E1B2C]"><Phone className="h-[1em] w-[1em] text-[#0E5BD8]" /> (11) 0000-0000</span>
          <span className="rounded-[0.5em] bg-[#0E1B2C] px-[1.1em] py-[0.6em] font-semibold text-white">Orçamento</span>
        </span>
      </div>

      <div className="grid flex-1 sm:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center px-[3em] py-[1.6em] sm:py-0">
          <p className="inline-flex w-fit items-center gap-[0.5em] rounded-full bg-[#E8F0FE] px-[0.9em] py-[0.35em] text-[0.78em] font-semibold text-[#0E5BD8]">
            <span className="h-[0.5em] w-[0.5em] rounded-full bg-[#16A34A]" /> Atendimento de segunda a sábado
          </p>
          <p className="mt-[0.8em] font-display text-[3em] font-bold leading-[1.02] tracking-[-0.035em]">
            Ar-condicionado instalado do jeito certo, <span className="text-[#0E5BD8]">no dia combinado.</span>
          </p>
          <p className="mt-[0.9em] max-w-[30em] text-[1em] leading-relaxed text-[#0E1B2C]/65">
            Instalação, manutenção e contratos PMOC para casas, lojas e escritórios.
          </p>
          <div className="mt-[1.3em] flex flex-wrap gap-[0.7em]">
            <span className="rounded-[0.6em] bg-[#0E5BD8] px-[1.5em] py-[0.85em] text-[0.95em] font-semibold text-white">Pedir orçamento</span>
            <span className="flex items-center gap-[0.5em] rounded-[0.6em] border border-[#0E1B2C]/15 px-[1.3em] py-[0.85em] text-[0.95em] font-semibold">
              <MessageCircle className="h-[1.1em] w-[1.1em] text-[#16A34A]" /> WhatsApp
            </span>
          </div>
          <div className="mt-[1.5em] hidden sm:flex gap-[1.6em] text-[0.8em] text-[#0E1B2C]/60">
            <span className="flex items-center gap-[0.4em]"><ClipboardCheck className="h-[1.2em] w-[1.2em] text-[#0E5BD8]" /> Orçamento sem custo</span>
            <span className="flex items-center gap-[0.4em]"><Wrench className="h-[1.2em] w-[1.2em] text-[#0E5BD8]" /> Garantia no serviço</span>
          </div>
        </div>
        <div className="relative hidden sm:block">
          <img src="/img/clima-hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute bottom-[1.4em] left-[1.4em] flex items-center gap-[0.7em] rounded-[0.8em] bg-white/95 px-[1em] py-[0.7em] shadow-lg">
            <span className="flex h-[2.2em] w-[2.2em] items-center justify-center rounded-full bg-[#E8F0FE] text-[#0E5BD8]"><Wrench className="h-[1.1em] w-[1.1em]" /></span>
            <span className="leading-tight">
              <span className="block text-[0.85em] font-semibold">Técnico com hora marcada</span>
              <span className="block text-[0.72em] text-[#0E1B2C]/55">Você recebe a confirmação no WhatsApp</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[1em] bg-[#F5F7FA] px-[3em] py-[1.2em]">
        {services.map(({ src, t, d }) => (
          <div key={t} className="overflow-hidden rounded-[0.8em] bg-white ring-1 ring-[#0E1B2C]/[0.06]">
            <img src={src} alt="" className="aspect-[16/6] w-full object-cover" />
            <div className="px-[0.9em] py-[0.7em]">
              <p className="font-display text-[1.05em] font-semibold">{t}</p>
              <p className="mt-[0.2em] hidden sm:block text-[0.78em] text-[#0E1B2C]/60">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const points = [
  { Icon: MousePointerClick, title: "Entende na hora", text: "O visitante sabe o que você faz antes de rolar a página." },
  { Icon: Smartphone, title: "Pensado no celular", text: "Fica bom na tela pequena, sem zoom e sem texto cortado." },
  { Icon: MessageCircle, title: "Leva até a conversa", text: "Cada seção aponta para o mesmo lugar: falar com você." },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Enquanto ninguém mexe, o divisor vai e volta sozinho a cada poucos segundos para mostrar que dá para arrastar.
  useEffect(() => {
    if (touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = frameRef.current;
    if (!el) return;

    let raf = 0;
    let timer = 0;
    let visible = false;
    const path = [50, 18, 82, 50];
    const legMs = 1100;

    const sweep = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = (now - start) / legMs;
        const leg = Math.min(Math.floor(t), path.length - 2);
        const k = Math.min(t - leg, 1);
        setPos(path[leg] + (path[leg + 1] - path[leg]) * ease(k));
        if (t < path.length - 1) raf = requestAnimationFrame(step);
        else timer = window.setTimeout(() => visible && sweep(), 4500);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) timer = window.setTimeout(sweep, 900);
      if (!visible) { cancelAnimationFrame(raf); clearTimeout(timer); setPos(50); }
    }, { threshold: 0.5 });
    io.observe(el);

    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [touched]);

  const stopHint = () => setTouched(true);

  return (
    <section id="na-pratica" className="grain relative overflow-hidden py-24 lg:py-32">
      <div className="section-container relative z-[2]">
        <div className="max-w-3xl reveal">
          <p className="kicker">Na prática</p>
          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.03]">
            Mesmo site. <span className="accent-word">Outra</span> primeira impressão.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            Arraste e compare. É o mesmo negócio, contado de outro jeito.
          </p>
        </div>

        <div className="reveal mt-14">
          <div className="mb-4 flex items-center justify-between font-display text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-white/55">Antes</span>
            <span className="hidden sm:block font-accent text-base normal-case italic tracking-normal text-white/50">arraste para comparar</span>
            <span className="text-[#4DDDE7]">Com a Move</span>
          </div>
          <div
            ref={frameRef}
            className="relative aspect-[3/4] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(85,31,126,0.8)] select-none"
            style={{ containerType: "inline-size" }}
          >
            <div className="absolute inset-0 text-[2.5cqw] sm:text-[1.25cqw]">
              <Antes />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
                <Depois />
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,195,208,0.8)]" style={{ left: `${pos}%` }}>
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0C0416] shadow-xl ring-4 ring-[#00C3D0]/30">
                <ChevronsLeftRight className="h-5 w-5" />
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              onPointerDown={stopHint}
              onKeyDown={stopHint}
              onFocus={stopHint}
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
