import { forwardRef, useEffect, useImperativeHandle, useRef, type PointerEvent as ReactPointerEvent } from "react";
import "@fontsource/bowlby-one/latin-400.css";
import { CabeloPalavra, FONTE_PALAVRA, type Caixa, type EstadoMaquina } from "@/components/barbearia/cabelo";
import { Maquina } from "@/components/barbearia/Maquina";

export interface PalavraCabeloHandle {
  crescer: () => void;
  definirCrescimento: (g: number) => void;
}

interface Props {
  /** calcula a palavra (linhas) e a caixa onde ela fica, em função do tamanho do quadro */
  medir: (w: number, h: number) => { linhas: string[]; caixa: Caixa; faixasPorLinha: number; maxFios: number };
  corLetra: string;
  /** auto: passa a máquina uma vez ao abrir. laco: passa, cresce e passa de novo (quadro da home). manual: quem manda é a rolagem. */
  modo: "auto" | "laco" | "manual";
  interativo?: boolean;
  onCortado?: () => void;
  onPronto?: () => void;
  className?: string;
}

/** A palavra de cabelo com a máquina por cima. Enche o elemento pai (position: relative). */
export const PalavraCabelo = forwardRef<PalavraCabeloHandle, Props>(function PalavraCabelo(
  { medir, corLetra, modo, interativo, onCortado, onPronto, className },
  ref,
) {
  const quadro = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const maquina = useRef<HTMLDivElement>(null);
  const motor = useRef<CabeloPalavra | null>(null);
  const cb = useRef({ onCortado, onPronto, medir });
  cb.current = { onCortado, onPronto, medir };

  useImperativeHandle(ref, () => ({
    crescer: () => motor.current?.crescer(),
    definirCrescimento: (g) => motor.current?.definirCrescimento(g),
  }), []);

  useEffect(() => {
    const el = quadro.current;
    const canvas = tela.current;
    if (!el || !canvas) return;
    let vivo = true;
    let timer = 0;
    let ultimaLarg = 0;
    let ultimaAlt = 0;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const moverMaquina = (e: EstadoMaquina) => {
      const m = maquina.current;
      if (!m) return;
      m.style.height = `${e.altura}px`;
      m.style.opacity = e.visivel ? "1" : "0";
      m.style.transform = `translate3d(${e.x}px, ${e.y}px, 0) scaleX(${e.dir}) translate(-100%, -50%)`;
    };

    const ciclo = () => {
      const m = motor.current;
      if (!m || !vivo) return;
      if (modo === "laco") {
        m.passarMaquina(() => {
          timer = window.setTimeout(() => {
            if (!vivo) return;
            m.crescer();
            timer = window.setTimeout(ciclo, 1900);
          }, 2200);
        });
      } else {
        m.passarMaquina();
      }
    };

    const montar = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      ultimaLarg = w;
      ultimaAlt = h;
      clearTimeout(timer);
      motor.current?.destruir();
      motor.current = new CabeloPalavra(canvas, {
        ...cb.current.medir(w, h),
        corLetra,
        largura: w,
        altura: h,
        onMaquina: moverMaquina,
        onCortado: () => cb.current.onCortado?.(),
      });
      if (modo === "manual") {
        motor.current.definirCrescimento(0.02);
      } else if (reduz) {
        motor.current.estadoFinal();
        cb.current.onCortado?.();
      } else {
        motor.current.crescer(700);
        timer = window.setTimeout(ciclo, 900);
      }
      cb.current.onPronto?.();
    };

    document.fonts.load(`100px ${FONTE_PALAVRA}`).finally(() => {
      if (vivo) montar();
    });

    const ro = new ResizeObserver(() => {
      if (!motor.current) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      // no celular a barra do navegador muda a altura o tempo todo: só refaz se a mudança for real
      if (w !== ultimaLarg || Math.abs(h - ultimaAlt) > 140) montar();
    });
    ro.observe(el);

    // parado fora da tela
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) motor.current?.retomar();
      else motor.current?.pausar();
    });
    io.observe(el);

    return () => {
      vivo = false;
      clearTimeout(timer);
      ro.disconnect();
      io.disconnect();
      motor.current?.destruir();
      motor.current = null;
    };
  }, [modo, corLetra]);

  const aoMover = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!motor.current) return;
    if (e.pointerType === "touch" && !e.buttons) return;
    const r = e.currentTarget.getBoundingClientRect();
    motor.current.controlar(e.clientX - r.left, e.clientY - r.top);
  };

  return (
    <div
      ref={quadro}
      className={className}
      onPointerMove={interativo ? aoMover : undefined}
      onPointerDown={interativo ? aoMover : undefined}
      style={{ position: "absolute", inset: 0, overflow: "hidden", touchAction: interativo ? "pan-y" : undefined }}
    >
      <canvas ref={tela} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      <Maquina ref={maquina} />
    </div>
  );
});
