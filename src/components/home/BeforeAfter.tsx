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
    { Icon: Snowflake, t: "Instalação", d: "Do furo na parede ao primeiro ligar." },
    { Icon: Wrench, t: "Manutenção", d: "Limpeza e revisão com hora marcada." },
    { Icon: ClipboardCheck, t: "Contrato PMOC", d: "Para empresas que precisam do laudo em dia." },
  ];
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#F3F7FB] text-[#0B1B3A]">
      <div className="pointer-events-none absolute -right-[8em] -top-[10em] h-[30em] w-[30em] rounded-full bg-[#BFE3FF] opacity-70 blur-[4em]" />

      <div className="relative flex items-center justify-between px-[3em] py-[1.3em]">
        <span className="flex items-center gap-[0.6em]">
          <span className="flex h-[2.2em] w-[2.2em] items-center justify-center rounded-[0.7em] bg-[#0B1B3A] text-white">
            <Snowflake className="h-[1.2em] w-[1.2em]" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.35em] font-bold">Sua Empresa</span>
            <span className="block text-[0.8em] text-[#0B1B3A]/55">climatização</span>
          </span>
        </span>
        <span className="hidden sm:flex items-center gap-[2em] text-[0.9em] text-[#0B1B3A]/70">
          <span>Serviços</span><span>Sobre</span><span>Contato</span>
          <span className="flex items-center gap-[0.4em] rounded-full border border-[#0B1B3A]/15 bg-white px-[1em] py-[0.5em] font-semibold text-[#0B1B3A]">
            <Phone className="h-[1em] w-[1em]" /> (11) 0000-0000
          </span>
        </span>
      </div>

      <div className="relative grid flex-1 items-center gap-[2em] px-[3em] sm:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="text-[0.8em] font-semibold uppercase tracking-[0.22em] text-[#1E6BFF]">Instalação · Manutenção · Contratos</p>
          <p className="mt-[0.5em] font-display text-[3.3em] font-bold leading-[0.98] tracking-[-0.035em]">
            Ar-condicionado instalado, limpo e <span className="font-accent font-normal italic text-[#1E6BFF]">gelando</span>.
          </p>
          <p className="mt-[0.9em] max-w-[30em] text-[1.05em] leading-snug text-[#0B1B3A]/65">
            Para casas e empresas. Orçamento sem custo e técnico com horário marcado.
          </p>
          <div className="mt-[1.4em] flex flex-wrap gap-[0.8em]">
            <span className="rounded-full bg-[#1E6BFF] px-[1.6em] py-[0.8em] text-[0.95em] font-semibold text-white shadow-[0_0.6em_1.6em_-0.4em_rgba(30,107,255,0.6)]">Pedir orçamento</span>
            <span className="flex items-center gap-[0.5em] rounded-full border border-[#0B1B3A]/15 bg-white px-[1.4em] py-[0.8em] text-[0.95em] font-semibold">
              <MessageCircle className="h-[1.1em] w-[1.1em] text-[#16A34A]" /> WhatsApp
            </span>
          </div>
        </div>

        {/* aparelho desenhado */}
        <div className="relative hidden sm:block">
          <div className="relative mx-auto w-[90%] rounded-[1.4em] bg-white p-[1.2em] shadow-[0_1.6em_3em_-1em_rgba(11,27,58,0.25)]">
            <div className="h-[4.4em] rounded-[0.8em] bg-gradient-to-b from-white to-[#E7EEF6] ring-1 ring-[#0B1B3A]/10" />
            <div className="mx-[1em] -mt-[0.9em] h-[0.5em] rounded-full bg-[#0B1B3A]/15" />
            <div className="mt-[1.4em] space-y-[0.6em] px-[1.4em]">
              {[100, 80, 60].map((w) => (
                <span key={w} className="block h-[0.35em] rounded-full bg-gradient-to-r from-[#7CC4FF] to-transparent" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div className="absolute -bottom-[1.4em] left-0 flex items-center gap-[0.6em] rounded-[1em] bg-[#0B1B3A] px-[1em] py-[0.7em] text-white shadow-xl">
            <span className="h-[0.6em] w-[0.6em] rounded-full bg-[#4ADE80]" />
            <span className="text-[0.8em] font-semibold">Técnico confirmado · 14h</span>
          </div>
        </div>
      </div>

      <div className="relative grid grid-cols-3 gap-[1em] px-[3em] pb-[2.2em] pt-[2em]">
        {services.map(({ Icon, t, d }) => (
          <div key={t} className="rounded-[1.1em] bg-white p-[1.1em] ring-1 ring-[#0B1B3A]/[0.06]">
            <Icon className="h-[1.5em] w-[1.5em] text-[#1E6BFF]" />
            <p className="mt-[0.6em] font-display text-[1.05em] font-semibold">{t}</p>
            <p className="mt-[0.3em] hidden sm:block text-[0.8em] leading-snug text-[#0B1B3A]/60">{d}</p>
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
