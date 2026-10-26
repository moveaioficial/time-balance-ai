import { useEffect, useRef, useState } from "react";
import { MousePointerClick, Smartphone, ChevronsLeftRight, Snowflake, Wrench, Clock, CalendarCheck, Check } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

// Antes e depois arrastável do MESMO site (MoveAR, empresa fictícia de climatização, só para ilustrar).
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
            <span className="block text-[1.7em] font-bold text-[#1F3A93]">MOVEAR</span>
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
        © 2014 MoveAR Climatização · Todos os direitos reservados
      </div>
    </div>
  );
}

// Ponto de onde sai o ar frio (centro do aparelho na foto de fundo), em % do quadro. Usado pela onda fria e pela área de clique.
const AR = { x: 71, y: 34 };

function Depois({ on }: { on: boolean }) {
  // a temperatura desce de 31° para 22° quando o ar liga
  const [temp, setTemp] = useState(31);
  useEffect(() => {
    if (!on) { setTemp(31); return; }
    const id = window.setInterval(() => setTemp((t) => (t > 22 ? t - 1 : t)), 140);
    return () => clearInterval(id);
  }, [on]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(90%_80%_at_72%_30%,#0B3566_0%,#06203F_42%,#030D1C_100%)] text-white" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* filtros: ondulação do calor e névoa fria */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="ba-haze" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.03" numOctaves="2" seed="4" result="n">
            <animate attributeName="baseFrequency" dur="5s" values="0.004 0.03;0.006 0.04;0.004 0.03" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ba-fog" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.028" numOctaves="4" seed="7" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.92  0 0 0 0 0.97  0 0 0 0 1  0 0 0 2.4 -1" />
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </svg>

      <div className="absolute inset-0" style={{ filter: on ? "none" : "url(#ba-haze)" }}>
        {/* fundo: trama de pontos e linhas de vento que partem do aparelho */}
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(125,211,252,0.18)_1px,transparent_1.2px)] [background-size:1.6em_1.6em] [mask-image:radial-gradient(70%_80%_at_70%_40%,#000,transparent_80%)]" />
        <svg className="ba-wind pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="ba-wind-g" x1="0" x2="1">
              <stop offset="0" stopColor="#7DD3FC" stopOpacity="0" />
              <stop offset="0.55" stopColor="#7DD3FC" stopOpacity="0.28" />
              <stop offset="1" stopColor="#A78BFA" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {["M-20 40 C 160 10, 300 80, 480 46 S 760 4, 840 50","M-20 66 C 160 34, 300 106, 480 72 S 760 30, 840 76","M-20 92 C 160 58, 300 132, 480 98 S 760 56, 840 102","M-20 118 C 160 82, 300 158, 480 124 S 760 82, 840 128","M-20 144 C 160 106, 300 184, 480 150 S 760 108, 840 154","M-20 170 C 160 130, 300 210, 480 176 S 760 134, 840 180","M-20 196 C 160 154, 300 236, 480 202 S 760 160, 840 206","M-20 222 C 160 178, 300 262, 480 228 S 760 186, 840 232","M-20 248 C 160 202, 300 288, 480 254 S 760 212, 840 258"].map((d, i) => (
            <path key={i} d={d} fill="none" stroke="url(#ba-wind-g)" strokeWidth={i % 3 === 0 ? 1.4 : 0.8} style={{ animationDelay: `${i * -1.3}s` }} />
          ))}
        </svg>

        {/* o aparelho, recortado, flutuando no azul do site */}
        <div className="absolute hidden sm:block w-[34%] -translate-x-1/2" style={{ left: `${AR.x}%`, top: "22%" }}>
          <div className={`absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(125,211,252,0.35),transparent)] blur-[2em] transition-opacity duration-[1500ms] ${on ? "opacity-100" : "opacity-40"}`} />
          <img src="/img/clima-ar-recorte.webp" alt="" className="relative w-full drop-shadow-[0_2.4em_2.4em_rgba(0,0,0,0.55)]" />
          <div className={`absolute inset-0 rounded-[1em] bg-[#7DD3FC] mix-blend-multiply transition-opacity duration-[1500ms] ${on ? "opacity-20" : "opacity-0"}`} />
        </div>

        {/* luz fria que o aparelho joga na parede quando liga */}
        <div
          className={`pointer-events-none absolute h-[70%] w-[34%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(125,211,252,0.45),transparent)] blur-[1.5em] transition-opacity duration-[1500ms] ${on ? "opacity-100" : "opacity-0"}`}
          style={{ left: `${AR.x}%`, top: `${AR.y}%` }}
        />

        {/* névoa fria saindo do aparelho */}
        <div className={`ba-mist-wrap absolute h-[52%] w-[34%] -translate-x-1/2 transition-opacity duration-1000 ${on ? "opacity-100" : "opacity-0"}`} style={{ left: `${AR.x}%`, top: `${AR.y + 10}%`, clipPath: "polygon(13% 0, 87% 0, 100% 100%, 0 100%)" }}>
          {[0, 1].map((k) => (
            <svg key={k} className="ba-mist absolute inset-x-0 top-0 h-[170%] w-full" style={{ animationDelay: `${k * -3.5}s` }} viewBox="0 0 200 340" preserveAspectRatio="none">
              <rect width="200" height="340" filter="url(#ba-fog)" />
            </svg>
          ))}
        </div>

        {!on && (
          <span className="ba-pulse absolute flex -translate-x-1/2 items-center gap-[0.5em] whitespace-nowrap rounded-full border border-white/15 bg-[#041228]/80 px-[1em] py-[0.5em] text-[0.8em] font-semibold backdrop-blur" style={{ left: `${AR.x}%`, top: `${AR.y - 2}%` }}>
            <span className="h-[0.55em] w-[0.55em] rounded-full bg-[#FB923C]" /> Toque para ligar
          </span>
        )}

        {/* conteúdo: cabeçalho separado por borda, abertura em duas colunas e faixa de benefícios, tudo na mesma margem */}
        <div className="relative z-10 flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-white/10 bg-[#041228]/45 px-[3em] py-[1em] backdrop-blur-md">
            <span className="flex items-center gap-[0.6em]">
              <span className="flex h-[2.1em] w-[2.1em] items-center justify-center rounded-[0.65em] bg-gradient-to-br from-[#BAE6FD] to-[#2563EB]">
                <Snowflake className="h-[1.15em] w-[1.15em] text-white" strokeWidth={2.4} />
              </span>
              <span className="font-display text-[1.25em] font-bold tracking-[-0.02em]">Move<span className="text-[#7DD3FC]">AR</span></span>
            </span>
            <nav className="hidden sm:flex items-center gap-[1.8em] text-[0.85em] text-white/65">
              <span className="relative text-white">Residencial<span className="absolute -bottom-[0.55em] left-0 h-[0.15em] w-full rounded-full bg-[#7DD3FC]" /></span>
              <span>Empresas</span><span>Planos PMOC</span><span>Contato</span>
            </nav>
            <span className="rounded-full bg-white px-[1.2em] py-[0.55em] text-[0.85em] font-semibold text-[#041228]">Agendar visita</span>
          </header>

          <div className="grid flex-1 items-center px-[3em] sm:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-[0.5em] rounded-full border border-[#7DD3FC]/30 bg-[#7DD3FC]/10 px-[0.9em] py-[0.35em] text-[0.75em] font-semibold text-[#BAE6FD]">
                <span className={`h-[0.5em] w-[0.5em] rounded-full ${on ? "bg-[#4ADE80]" : "bg-[#FB923C]"}`} /> Instalação e manutenção
              </span>
              <div className="mt-[0.2em] grid font-display text-[4.2em] font-bold leading-[0.95] tracking-[-0.045em]">
                <p className={`[grid-area:1/1] transition-all duration-700 ${on ? "translate-y-[-0.2em] opacity-0 blur-sm" : "opacity-100"}`}>
                  Tá calor aí?
                  <span className="block text-[#FDBA74]">A gente resolve.</span>
                </p>
                <p className={`[grid-area:1/1] transition-all delay-300 duration-700 ${on ? "opacity-100" : "translate-y-[0.3em] opacity-0 blur-sm"}`}>
                  Frio na medida.
                  <span className="block text-[#7DD3FC]">Sem dor de cabeça.</span>
                </p>
              </div>
              <p className="mt-[0.9em] max-w-[24em] text-[1.02em] leading-relaxed text-white/70">
                Instalação limpa, técnico no horário e manutenção que você nem precisa lembrar.
              </p>
              <div className="mt-[1.4em] flex flex-wrap items-center gap-[0.8em]">
                <span className="flex items-center gap-[0.6em] rounded-full bg-white py-[0.75em] pl-[1.5em] pr-[0.75em] text-[0.95em] font-semibold text-[#041228] shadow-[0_0.8em_2em_-0.6em_rgba(125,211,252,0.6)]">
                  Pedir orçamento
                  <span className="flex h-[1.7em] w-[1.7em] items-center justify-center rounded-full bg-[#041228] text-white">→</span>
                </span>
                <span className="flex items-center gap-[0.5em] rounded-full border border-white/25 bg-white/[0.04] px-[1.3em] py-[0.75em] text-[0.95em] font-medium text-white/90 backdrop-blur">
                  <WhatsAppIcon className="h-[1.15em] w-[1.15em]" colorido /> WhatsApp
                </span>
              </div>
              <p className="mt-[1.2em] flex flex-wrap gap-x-[1.4em] gap-y-[0.3em] text-[0.78em] text-white/60">
                <span className="flex items-center gap-[0.4em]"><Check className="h-[1.1em] w-[1.1em] text-[#4ADE80]" /> Orçamento em até 24 h</span>
                <span className="flex items-center gap-[0.4em]"><Check className="h-[1.1em] w-[1.1em] text-[#4ADE80]" /> Garantia por escrito</span>
              </p>
            </div>
          </div>

          {/* faixa de benefícios alinhada ao mesmo grid */}
          <div className="hidden sm:grid grid-cols-3 border-t border-white/10 bg-[#041228]/30 px-[3em] py-[1.1em]">
            {[
              [Wrench, "Instalação limpa", "sem sujeira e sem quebra-quebra"],
              [Clock, "Técnico no horário", "você recebe o aviso antes"],
              [CalendarCheck, "Manutenção lembrada", "a gente avisa quando é a hora"],
            ].map(([Ic, t, d], i) => {
              const Icone = Ic as typeof Wrench;
              return (
                <div key={t as string} className={`flex items-center gap-[0.8em] ${i ? "border-l border-white/10 pl-[1.4em]" : ""}`}>
                  <span className="flex h-[2.2em] w-[2.2em] flex-none items-center justify-center rounded-[0.6em] bg-white/[0.06]">
                    <Icone className="h-[1.1em] w-[1.1em] text-[#7DD3FC]" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[0.85em] font-semibold">{t as string}</span>
                    <span className="block text-[0.72em] text-white/55">{d as string}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* temperatura dentro do jato de ar: um leque de vidro fosco com a névoa correndo por dentro */}
        <div
          className={`absolute z-10 hidden sm:block h-[12.5em] w-[22em] -translate-x-1/2 transition-all duration-[1200ms] ${on ? "opacity-100" : "opacity-80"}`}
          style={{ left: `${AR.x}%`, top: "47%", WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)", maskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)" }}
        >
          <div
            className="absolute inset-0 backdrop-blur-[6px]"
            style={{
              clipPath: "polygon(13% 0, 87% 0, 100% 100%, 0 100%)",
              background: on
                ? "linear-gradient(180deg, rgba(224,242,254,0.30), rgba(125,211,252,0.10) 55%, rgba(125,211,252,0.02))"
                : "linear-gradient(180deg, rgba(253,186,116,0.22), rgba(251,146,60,0.06) 60%, transparent)",
            }}
          />
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 220 125" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <clipPath id="ba-leque"><polygon points="28.6,0 191.4,0 220,125 0,125" /></clipPath>
              <linearGradient id="ba-borda" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#E0F2FE" stopOpacity="0.9" />
                <stop offset="1" stopColor="#7DD3FC" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g clipPath="url(#ba-leque)" className={`transition-opacity duration-1000 ${on ? "opacity-60" : "opacity-0"}`}>
              <rect className="ba-mist" width="220" height="250" y="-125" filter="url(#ba-fog)" />
            </g>
            <line x1="28.6" y1="0.5" x2="191.4" y2="0.5" stroke="#E0F2FE" strokeOpacity="0.9" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <polyline points="28.6,0 0,125" fill="none" stroke="url(#ba-borda)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <polyline points="191.4,0 220,125" fill="none" stroke="url(#ba-borda)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="relative flex h-full flex-col items-center pt-[1.1em] text-center">
            <span className="flex items-center gap-[0.45em] text-[0.72em] font-semibold uppercase tracking-[0.22em] text-white/75">
              <span className={`h-[0.5em] w-[0.5em] rounded-full ${on ? "bg-[#4ADE80] shadow-[0_0_0.6em_#4ADE80]" : "bg-[#FB923C]"}`} />
              Sala de estar
            </span>
            <p className="mt-[0.15em] font-display text-[4.4em] font-light leading-none tracking-[-0.05em] tabular-nums [text-shadow:0_0.1em_0.6em_rgba(4,18,40,0.5)]">
              {temp}<span className={`align-top text-[0.4em] font-medium ${on ? "text-[#BAE6FD]" : "text-[#FDBA74]"}`}>°C</span>
            </p>
            <p className="mt-[0.5em] flex gap-[1.1em] text-[0.72em] font-semibold text-white/55">
              {["Frio", "Auto", "Silêncio"].map((m, i) => (
                <span key={m} className={on && i === 0 ? "text-white underline decoration-[#7DD3FC] decoration-2 underline-offset-[0.4em]" : ""}>{m}</span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* lufada de névoa que cobre e limpa o site quando o ar liga */}
      <div className={`ba-burst pointer-events-none absolute inset-0 z-[15] ${on ? "ba-burst-on" : ""}`} style={{ transformOrigin: `${AR.x}% ${AR.y}%` }}>
        <svg className="h-full w-full" viewBox="0 0 400 225" preserveAspectRatio="none"><rect width="400" height="225" filter="url(#ba-fog)" /></svg>
      </div>

      {/* calor por cima do site: some em onda a partir do aparelho quando o ar liga */}
      <div
        className={`ba-heat pointer-events-none absolute inset-0 z-20 ${on ? "ba-cool" : ""}`}
        style={{ ["--x" as string]: `${AR.x}%`, ["--y" as string]: `${AR.y}%` }}
      />
    </div>
  );
}

const points = [
  { Icon: MousePointerClick, title: "Entende na hora", text: "O visitante sabe o que você faz antes de rolar a página." },
  { Icon: Smartphone, title: "Pensado no celular", text: "Fica bom na tela pequena, sem zoom e sem texto cortado." },
  { Icon: WhatsAppIcon, title: "Leva até a conversa", text: "Cada seção aponta para o mesmo lugar: falar com você." },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const [arLigado, setArLigado] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // o ar-condicionado do site novo liga sozinho quando o divisor revela boa parte do "depois"
  useEffect(() => {
    if (pos <= 35) setArLigado(true);
  }, [pos]);

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
                <Depois on={arLigado} />
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

            {/* área de clique sobre o aparelho do site novo (fica acima do arraste) */}
            {pos < AR.x - 14 && (
              <button
                type="button"
                onClick={() => { stopHint(); setArLigado(true); }}
                aria-label="Ligar o ar-condicionado do site de exemplo"
                className="absolute z-10 hidden sm:block h-[24%] w-[26%] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-2xl"
                style={{ left: `${AR.x}%`, top: `${AR.y}%` }}
              />
            )}
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
