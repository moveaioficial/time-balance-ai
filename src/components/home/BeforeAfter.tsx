import { useEffect, useRef, useState } from "react";
import { MousePointerClick, Smartphone, MessageCircle, ChevronsLeftRight, Snowflake } from "lucide-react";

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
    { src: "/img/clima-tecnico.webp", t: "Instalação" },
    { src: "/img/clima-manutencao.webp", t: "Manutenção" },
    { src: "/img/clima-contrato.webp", t: "Contrato PMOC" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#08131F] text-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* foto: coluna da direita no desktop, fundo no celular */}
      <div className="absolute inset-0 sm:left-auto sm:w-[40%]">
        <img src="/img/clima-sala.webp" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#08131F]/80 sm:bg-transparent sm:bg-[linear-gradient(90deg,#08131F_0%,rgba(8,19,31,0.35)_22%,transparent_45%)]" />
      </div>
      <div className="pointer-events-none absolute -left-[10em] top-[20%] h-[30em] w-[30em] rounded-full bg-[#38BDF8] opacity-[0.16] blur-[6em]" />

      {/* menu flutuante */}
      <div className="relative z-10 mx-[2.4em] mt-[1.4em] flex items-center justify-between rounded-full border border-white/10 bg-white/[0.06] py-[0.6em] pl-[1.2em] pr-[0.6em] backdrop-blur-xl">
        <span className="flex items-center gap-[0.55em] font-display text-[1.15em] font-bold tracking-[-0.02em]">
          <Snowflake className="h-[1.1em] w-[1.1em] text-[#7DD3FC]" strokeWidth={2.4} /> Sua Empresa
        </span>
        <span className="hidden sm:flex items-center gap-[1.8em] text-[0.85em] text-white/70">
          <span>Residencial</span><span>Empresas</span><span>Planos PMOC</span><span>Contato</span>
        </span>
        <span className="rounded-full bg-[#7DD3FC] px-[1.2em] py-[0.55em] text-[0.85em] font-semibold text-[#08131F]">Agendar visita</span>
      </div>

      <div className="relative z-10 flex h-[calc(100%-4.5em)] flex-col px-[3em] pb-[2em] sm:w-[64%]">
        <div className="flex flex-1 flex-col justify-center">
          <p className="flex items-center gap-[0.6em] text-[0.8em] font-medium uppercase tracking-[0.28em] text-[#7DD3FC]">
            <span className="h-px w-[2.4em] bg-[#7DD3FC]" /> Climatização residencial e comercial
          </p>
          <p className="mt-[0.7em] font-display text-[4.4em] font-bold leading-[0.92] tracking-[-0.045em]">
            Frio na medida.
            <span className="block bg-gradient-to-r from-[#BAE6FD] via-[#7DD3FC] to-[#38BDF8] bg-clip-text font-accent text-[1.08em] font-normal italic tracking-[-0.02em] text-transparent">Sem dor de cabeça.</span>
          </p>
          <p className="mt-[1em] max-w-[28em] text-[1.05em] leading-relaxed text-white/65">
            Instalação limpa, técnico no horário e manutenção que você nem precisa lembrar.
          </p>
          <div className="mt-[1.5em] flex flex-wrap items-center gap-[0.8em]">
            <span className="flex items-center gap-[0.6em] rounded-full bg-white px-[1.6em] py-[0.85em] text-[0.95em] font-semibold text-[#08131F]">
              Pedir orçamento <span className="flex h-[1.5em] w-[1.5em] items-center justify-center rounded-full bg-[#08131F] text-[0.8em] text-white">→</span>
            </span>
            <span className="flex items-center gap-[0.5em] text-[0.95em] font-medium text-white/80">
              <MessageCircle className="h-[1.2em] w-[1.2em] text-[#4ADE80]" /> Falar no WhatsApp
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[0.8em]">
          {services.map(({ src, t }) => (
            <div key={t} className="relative h-[6.6em] overflow-hidden rounded-[1em] ring-1 ring-white/10">
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08131F] via-[#08131F]/40 to-transparent" />
              <p className="absolute bottom-[0.7em] left-[0.9em] right-[0.9em] flex items-center justify-between text-[0.95em] font-semibold">
                {t} <span className="text-[#7DD3FC]">↗</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* cartões de vidro sobre a foto */}
      <div className="absolute right-[3%] top-[22%] z-10 hidden sm:block w-[13em] rounded-[1.2em] border border-white/15 bg-[#08131F]/55 p-[1.1em] backdrop-blur-xl">
        <div className="flex items-center justify-between text-[0.75em] text-white/60">
          <span>Sala de estar</span>
          <span className="flex items-center gap-[0.35em] text-[#4ADE80]"><span className="h-[0.5em] w-[0.5em] rounded-full bg-[#4ADE80]" /> Ligado</span>
        </div>
        <p className="mt-[0.3em] font-display text-[3.2em] font-bold leading-none tracking-[-0.04em]">22<span className="text-[0.5em] align-top text-[#7DD3FC]">°C</span></p>
        <div className="mt-[0.7em] h-[0.35em] overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#38BDF8] to-[#BAE6FD]" />
        </div>
        <p className="mt-[0.5em] text-[0.72em] text-white/55">Modo silencioso · filtro limpo</p>
      </div>

      <div className="absolute bottom-[6%] right-[3%] z-10 hidden sm:flex w-[19.5em] items-center gap-[0.8em] rounded-[1.1em] bg-white p-[0.8em] text-[#08131F] shadow-[0_1.5em_3em_-1em_rgba(0,0,0,0.6)]">
        <span className="flex h-[2.6em] w-[2.6em] shrink-0 flex-col items-center justify-center rounded-[0.7em] bg-[#E0F2FE] leading-none text-[#0369A1]">
          <span className="text-[0.55em] font-semibold uppercase">Amanhã</span>
          <span className="text-[1.05em] font-bold">9h</span>
        </span>
        <span className="flex-1 leading-tight">
          <span className="block text-[0.85em] font-semibold">Próxima visita livre</span>
          <span className="block text-[0.72em] text-[#08131F]/55">Confirmação pelo WhatsApp</span>
        </span>
        <span className="rounded-full bg-[#08131F] px-[0.9em] py-[0.45em] text-[0.72em] font-semibold text-white">Agendar</span>
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
