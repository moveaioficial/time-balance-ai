import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { MousePointerClick, Smartphone, ChevronsLeftRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { AntesBarbearia, DepoisBarbearia } from "@/components/home/BarbeariaMock";

// Antes e depois arrastável do MESMO site: a Barbearia Move, fictícia, só para ilustrar (ver BarbeariaMock.tsx).
// O mesmo exemplo vale para o celular e para o computador. As medidas internas são em "em": o quadro define o
// tamanho base (maior no celular), e tudo escala junto.

const points = [
  { Icon: MousePointerClick, title: "Entende na hora", text: "O visitante sabe o que você faz antes de rolar a página." },
  { Icon: Smartphone, title: "Pensado no celular", text: "Fica bom na tela pequena, sem zoom e sem texto cortado." },
  { Icon: WhatsAppIcon, title: "Chama para a conversa", text: "Cada parte da página convida o visitante a falar com você." },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const arrastando = useRef(false);

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

  // Arraste feito à mão (e não por um input range por cima de tudo), para os botões do site de exemplo
  // continuarem clicáveis. O input fica para o teclado e para leitores de tela.
  const moverPara = (clientX: number) => {
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    stopHint();
    if ((e.target as HTMLElement).closest("a, button")) return;
    arrastando.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    moverPara(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => { if (arrastando.current) moverPara(e.clientX); };
  const onPointerUp = () => { arrastando.current = false; };

  return (
    <section id="na-pratica" className="grain relative overflow-hidden py-24 lg:py-32">
      <div className="section-container relative z-[2]">
        <div className="max-w-3xl reveal">
          <p className="kicker">Na prática</p>
          <h2 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.03]">
            Mesmo site. <span className="accent-word">Outra</span> primeira impressão.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/75">
            Arraste e compare. É a mesma barbearia, contada de outro jeito. No site novo, a máquina corta o nome na sua frente. (A barbearia é fictícia, só para ilustrar.)
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
            role="group"
            aria-label="Exemplo de antes e depois do site de uma barbearia fictícia"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative aspect-[3/4] sm:aspect-[16/9] w-full cursor-ew-resize touch-pan-y overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(85,31,126,0.8)] select-none"
            style={{ containerType: "inline-size" }}
          >
            <div className="absolute inset-0 text-[2.5cqw] sm:text-[1.25cqw]">
              <AntesBarbearia />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
                <DepoisBarbearia interativo={pos < 80} />
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              onKeyDown={stopHint}
              onFocus={stopHint}
              aria-label="Arraste para comparar o antes e o depois"
              className="peer pointer-events-none absolute inset-0 h-full w-full opacity-0"
            />

            <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,195,208,0.8)] peer-focus-visible:[&>span]:ring-[#00C3D0]" style={{ left: `${pos}%` }}>
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0C0416] shadow-xl ring-4 ring-[#00C3D0]/30">
                <ChevronsLeftRight className="h-5 w-5" />
              </span>
            </div>
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
