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
  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden bg-[#050B14] text-white"
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundImage:
          "linear-gradient(rgba(125,211,252,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.05) 1px, transparent 1px)",
        backgroundSize: "3.2em 3.2em",
      }}
    >
      {/* luz azul em movimento */}
      <div className="pointer-events-none absolute inset-0">
        <span className="ba-aurora absolute -left-[8em] -top-[10em] h-[28em] w-[28em] rounded-full bg-[#0EA5E9] opacity-30 blur-[6em]" />
        <span className="ba-aurora absolute right-[-6em] top-[6em] h-[24em] w-[24em] rounded-full bg-[#6366F1] opacity-25 blur-[6em]" style={{ animationDelay: "-6s" }} />
        <span className="ba-aurora absolute bottom-[-12em] left-[30%] h-[26em] w-[26em] rounded-full bg-[#22D3EE] opacity-20 blur-[6em]" style={{ animationDelay: "-11s" }} />
      </div>

      {/* menu */}
      <div className="relative flex items-center justify-between px-[2.4em] py-[1.2em]">
        <span className="flex items-center gap-[0.6em]">
          <span className="flex h-[2.1em] w-[2.1em] items-center justify-center rounded-[0.65em] bg-gradient-to-br from-[#7DD3FC] to-[#2563EB] shadow-[0_0_1.6em_rgba(56,189,248,0.55)]">
            <Snowflake className="h-[1.15em] w-[1.15em] text-white" strokeWidth={2.4} />
          </span>
          <span className="font-display text-[1.2em] font-bold tracking-[-0.02em]">Sua Empresa</span>
        </span>
        <span className="hidden sm:flex items-center gap-[1.8em] text-[0.85em] text-white/60">
          <span className="text-white">Residencial</span><span>Empresas</span><span>Planos PMOC</span><span>Contato</span>
        </span>
        <span className="rounded-full bg-[#7DD3FC] px-[1.2em] py-[0.55em] text-[0.85em] font-semibold text-[#050B14] shadow-[0_0_2em_rgba(125,211,252,0.5)]">Agendar visita</span>
      </div>

      {/* grade em blocos */}
      <div className="relative grid flex-1 grid-cols-1 sm:grid-cols-12 sm:grid-rows-2 gap-[0.9em] px-[2.4em] pb-[2em]">
        {/* bloco principal */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[1.6em] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.01] p-[2em] backdrop-blur-xl sm:col-span-7 sm:row-span-2">
          <p className="flex w-fit items-center gap-[0.5em] rounded-full border border-white/10 bg-white/[0.06] px-[0.9em] py-[0.4em] text-[0.78em] text-white/75">
            <span className="h-[0.5em] w-[0.5em] rounded-full bg-[#4ADE80] shadow-[0_0_0.6em_#4ADE80]" /> Técnicos disponíveis hoje
          </p>
          <div>
            <p className="font-display text-[4.3em] font-bold leading-[0.9] tracking-[-0.05em]">
              Frio na medida.
              <span className="block bg-gradient-to-r from-[#E0F2FE] via-[#7DD3FC] to-[#38BDF8] bg-clip-text pb-[0.08em] font-accent text-[1.1em] font-normal italic tracking-[-0.02em] text-transparent">Sem dor de cabeça.</span>
            </p>
            <p className="mt-[0.9em] max-w-[26em] text-[1em] leading-relaxed text-white/60">
              Instalação limpa, técnico no horário e manutenção que você nem precisa lembrar.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[0.8em]">
            <span className="flex items-center gap-[0.6em] rounded-full bg-white py-[0.75em] pl-[1.5em] pr-[0.75em] text-[0.95em] font-semibold text-[#050B14]">
              Pedir orçamento
              <span className="flex h-[1.7em] w-[1.7em] items-center justify-center rounded-full bg-[#050B14] text-white">→</span>
            </span>
            <span className="flex items-center gap-[0.5em] rounded-full border border-white/15 px-[1.3em] py-[0.75em] text-[0.95em] font-medium text-white/85">
              <MessageCircle className="h-[1.15em] w-[1.15em] text-[#4ADE80]" /> WhatsApp
            </span>
          </div>
        </div>

        {/* mostrador de temperatura */}
        <div className="relative flex items-center justify-between overflow-hidden rounded-[1.6em] border border-white/10 bg-white/[0.04] p-[1.6em] backdrop-blur-xl sm:col-span-5">
          <div>
            <p className="text-[0.8em] text-white/50">Sala de estar</p>
            <p className="mt-[0.3em] font-display text-[1.35em] font-semibold leading-tight">Modo silencioso</p>
            <div className="mt-[0.9em] flex gap-[0.4em]">
              {["Frio", "Seco", "Auto"].map((m, i) => (
                <span key={m} className={`rounded-full px-[0.8em] py-[0.3em] text-[0.72em] ${i === 0 ? "bg-[#7DD3FC] font-semibold text-[#050B14]" : "border border-white/15 text-white/60"}`}>{m}</span>
              ))}
            </div>
          </div>
          <div className="relative flex h-[8em] w-[8em] shrink-0 items-center justify-center">
            <span className="ba-spin absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, #38BDF8, #6366F1, #22D3EE, transparent 75%)" }} />
            <span className="absolute inset-[0.45em] rounded-full bg-[#07111D]" />
            <span className="relative text-center leading-none">
              <span className="font-display text-[2.6em] font-bold tracking-[-0.05em]">22°</span>
              <span className="mt-[0.3em] block text-[0.65em] uppercase tracking-[0.2em] text-[#7DD3FC]">ligado</span>
            </span>
          </div>
        </div>

        {/* foto do técnico */}
        <div className="relative hidden sm:block overflow-hidden rounded-[1.6em] border border-white/10 sm:col-span-3">
          <img src="/img/clima-tecnico.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/30 to-transparent" />
          <p className="absolute bottom-[1em] left-[1.1em] right-[1.1em] leading-tight">
            <span className="block font-display text-[1.05em] font-semibold">Técnico no horário</span>
            <span className="block text-[0.75em] text-white/60">Instalação, manutenção e PMOC</span>
          </p>
        </div>

        {/* agenda */}
        <div className="relative hidden sm:flex flex-col justify-between overflow-hidden rounded-[1.6em] bg-[#7DD3FC] p-[1.2em] text-[#050B14] sm:col-span-2">
          <p className="text-[0.75em] font-semibold uppercase tracking-[0.18em] opacity-70">Próxima visita</p>
          <p className="font-display leading-none">
            <span className="block text-[0.95em] font-semibold">Amanhã</span>
            <span className="block text-[2.8em] font-bold tracking-[-0.05em]">9h</span>
          </p>
          <span className="flex items-center justify-between rounded-full bg-[#050B14] px-[0.9em] py-[0.45em] text-[0.75em] font-semibold text-white">
            Agendar <span>→</span>
          </span>
        </div>
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
