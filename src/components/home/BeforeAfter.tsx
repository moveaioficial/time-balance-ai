import { memo, useCallback, useEffect, useRef, useSyncExternalStore, type PointerEvent as ReactPointerEvent } from "react";
import { MousePointerClick, Smartphone, ChevronsLeftRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { AntesBarbearia, DepoisBarbearia } from "@/components/home/BarbeariaMock";
import { AntesDoces, DepoisDoces } from "@/components/home/DocesMock";

// Antes e depois arrastável do MESMO site: no computador, a Barbearia Move; no celular, a Move Doces. As duas são inventadas.
// As medidas internas são em "em": o quadro define o tamanho base (maior no celular), e tudo escala junto.
// O divisor NÃO passa pelo estado do React: cada movimento só muda o recorte e a posição da alça, direto no estilo.
// Assim, arrastar não redesenha nenhum componente, nem no celular fraco.

const points = [
  { Icon: MousePointerClick, title: "Entende na hora", text: "O visitante sabe o que você faz antes de rolar a página." },
  { Icon: Smartphone, title: "Pensado no celular", text: "Fica bom na tela pequena, sem zoom e sem texto cortado." },
  { Icon: WhatsAppIcon, title: "Leva até a conversa", text: "Cada parte da página leva o visitante a falar com você." },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const Antes = memo(AntesBarbearia);
const Depois = memo(DepoisBarbearia);
const AntesCelular = memo(AntesDoces);
const DepoisCelular = memo(DepoisDoces);

const CONSULTA_CELULAR = "(max-width: 639px)";
const assinar = (avisar: () => void) => {
  const m = window.matchMedia(CONSULTA_CELULAR);
  m.addEventListener("change", avisar);
  return () => m.removeEventListener("change", avisar);
};
const lerCelular = () => window.matchMedia(CONSULTA_CELULAR).matches;

export function BeforeAfter() {
  const celular = useSyncExternalStore(assinar, lerCelular, () => false);
  const frameRef = useRef<HTMLDivElement>(null);
  const recorte = useRef<HTMLDivElement>(null);
  const alca = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const arrastando = useRef(false);
  const tocou = useRef(false);
  const pendente = useRef<number | null>(null);
  const quadroRaf = useRef(0);

  const aplicar = useCallback((p: number) => {
    if (recorte.current) recorte.current.style.clipPath = `inset(0 0 0 ${p}%)`;
    if (alca.current) alca.current.style.left = `${p}%`;
    if (campo.current) campo.current.value = String(p);
  }, []);

  // no máximo uma atualização por quadro, por mais rápido que o dedo mexa
  const moverPos = useCallback((p: number) => {
    pendente.current = p;
    if (quadroRaf.current) return;
    quadroRaf.current = requestAnimationFrame(() => {
      quadroRaf.current = 0;
      if (pendente.current !== null) aplicar(pendente.current);
    });
  }, [aplicar]);

  // Enquanto ninguém mexe, o divisor vai e volta sozinho a cada poucos segundos para mostrar que dá para arrastar.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = frameRef.current;
    if (!el) return;

    let raf = 0;
    let timer = 0;
    let visible = false;
    const path = [50, 18, 82, 50];
    const legMs = 1100;

    const sweep = () => {
      if (tocou.current) return;
      const start = performance.now();
      const step = (now: number) => {
        if (tocou.current) return;
        const t = (now - start) / legMs;
        const leg = Math.min(Math.floor(t), path.length - 2);
        const k = Math.min(t - leg, 1);
        aplicar(path[leg] + (path[leg + 1] - path[leg]) * ease(k));
        if (t < path.length - 1) raf = requestAnimationFrame(step);
        else timer = window.setTimeout(() => visible && sweep(), 6500);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && !was) timer = window.setTimeout(sweep, 900);
      if (!visible) {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
        if (!tocou.current) aplicar(50);
      }
    }, { threshold: 0.5 });
    io.observe(el);

    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [aplicar]);

  const stopHint = () => { tocou.current = true; };

  const moverPara = (clientX: number) => {
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    moverPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    stopHint();
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
            Arraste e compare. É a mesma empresa, contada de outro jeito. (O negócio é inventado por nós, para ilustrar. Não é cliente da Move.)
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
            aria-label={`Exemplo de antes e depois do site de uma ${celular ? "confeitaria" : "barbearia"}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative aspect-[3/4] sm:aspect-[16/9] w-full cursor-ew-resize touch-pan-y overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_40px_120px_-40px_rgba(85,31,126,0.8)] select-none"
            style={{ containerType: "inline-size", contain: "layout paint" }}
          >
            <div className="absolute inset-0 text-[2.5cqw] sm:text-[1.25cqw]">
              {celular ? <AntesCelular /> : <Antes />}
              <div ref={recorte} className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: "inset(0 0 0 50%)" }}>
                {celular ? <DepoisCelular /> : <Depois />}
              </div>
            </div>

            <input
              ref={campo}
              type="range"
              min={0}
              max={100}
              step={0.5}
              defaultValue={50}
              onInput={(e) => aplicar(Number(e.currentTarget.value))}
              onKeyDown={stopHint}
              onFocus={stopHint}
              aria-label="Arraste para comparar o antes e o depois"
              className="peer pointer-events-none absolute inset-0 h-full w-full opacity-0"
            />

            <div ref={alca} className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,195,208,0.8)] peer-focus-visible:[&>span]:ring-[#00C3D0]" style={{ left: "50%" }}>
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
