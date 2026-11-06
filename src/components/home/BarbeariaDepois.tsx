import { useEffect, useRef } from "react";
import "@fontsource/bowlby-one/latin-400.css";
import { aparelhoFraco, CabeloPalavra, FONTE_PALAVRA, type EstadoMaquina } from "@/components/barbearia/cabelo";
import { ArrowRight, Check } from "lucide-react";
import { Maquina, Poste } from "@/components/barbearia/Maquina";
import { BarbeariaFotos } from "@/components/home/BarbeariaFotos";

// O "depois" da seção "Na prática" no computador: só a primeira dobra da landing da Barbearia Move, dentro da moldura.
// A máquina corta a promessa até ela ficar legível; ao lado, as fotos trocam cortadas (BarbeariaFotos.tsx).
// Os botões são só visuais. Este arquivo só carrega quando a seção chega perto da tela; não usa GSAP.
// Fotos do Pexels (licença gratuita com uso comercial), em public/img/barbearia/:
//   fade-perfil  Brian Silva    pexels.com/photo/39559324 (espelhada, para o rosto olhar para o texto)
//   cadeira      Sofía Marquet  pexels.com/photo/18173343 (recortada para não mostrar rótulos)

const DISPLAY: React.CSSProperties = { fontFamily: "'Bowlby One', 'Arial Black', sans-serif" };
const BENEFICIOS = ["Degradê do pente à navalha", "Barba com toalha quente", "De segunda a sábado"];

export default function BarbeariaDepois() {
  const quadro = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const maquina = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = quadro.current;
    const cv = tela.current;
    if (!el || !cv) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fraco = aparelhoFraco();
    let vivo = true;
    let ativo = false;
    let timers: number[] = [];
    let palavra: CabeloPalavra | null = null;
    let largMontada = 0;

    const esperar = (ms: number, f: () => void) => { timers.push(window.setTimeout(f, ms)); };
    const limpar = () => { timers.forEach(clearTimeout); timers = []; };

    const moverMaq = ({ x, y, dir, visivel, altura }: EstadoMaquina) => {
      const m = maquina.current;
      if (!m) return;
      m.style.height = `${altura}px`;
      m.style.opacity = visivel ? "1" : "0";
      m.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${dir}) translate(-100%, -50%)`;
    };

    const montar = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return false;
      largMontada = w;
      const em = w / 80;
      palavra?.destruir();
      palavra = new CabeloPalavra(cv, {
        linhas: ["CORTE NA RÉGUA,", "BARBA NO", "CAPRICHO."],
        caixa: { x: 3 * em, y: 7.4 * em, w: 45 * em, h: 18.6 * em },
        alinharEsquerda: true,
        corLetra: "#F0E9DC",
        largura: w,
        altura: h,
        dpr: Math.min(window.devicePixelRatio || 1, fraco ? 1 : 1.25),
        maxFios: 8000 * (fraco ? 0.6 : 1),
        faixasPorLinha: 2,
        onMaquina: moverMaq,
      });
      return true;
    };

    // o corte recomeça depois de um tempo parado, para quem ainda está olhando
    const ciclo = () => {
      if (!vivo || !ativo || !palavra) return;
      const p = palavra;
      p.crescer(650, () => esperar(250, () => p.passarMaquina(() => esperar(9000, ciclo))));
    };

    const iniciar = () => {
      if (reduz) palavra?.estadoFinal();
      else ciclo();
    };

    const io = new IntersectionObserver(([e]) => {
      if (!vivo) return;
      if (e.isIntersecting && !ativo) {
        ativo = true;
        palavra?.retomar();
        iniciar();
      } else if (!e.isIntersecting && ativo) {
        ativo = false;
        limpar();
        palavra?.pausar();
      }
    }, { threshold: 0.05 });

    document.fonts.load(`100px ${FONTE_PALAVRA}`).finally(() => {
      if (vivo && montar()) io.observe(el);
    });

    const ro = new ResizeObserver(() => {
      if (!palavra || el.clientWidth === largMontada) return;
      limpar();
      if (montar() && ativo) iniciar();
    });
    ro.observe(el);

    return () => {
      vivo = false;
      limpar();
      io.disconnect();
      ro.disconnect();
      palavra?.destruir();
    };
  }, []);

  return (
    <div ref={quadro} className="absolute inset-0 overflow-hidden bg-[#C4291C] text-[#F0E9DC]" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* as fotos, que trocam cortadas, separadas do texto por uma faixa de poste de barbearia */}
      <div className="absolute inset-y-0 right-0 w-[28em]">
        <BarbeariaFotos />
      </div>
      <div
        className="absolute inset-y-0 right-[28em] w-[1.1em]"
        style={{ background: "repeating-linear-gradient(135deg, #F0E9DC 0 1em, #C4291C 1em 2em, #F0E9DC 2em 3em, #16358C 3em 4em)" }}
      />

      <canvas ref={tela} className="absolute inset-0 h-full w-full" />
      <Maquina ref={maquina} />

      {/* a marca e o caminho mais curto até a reserva */}
      <div className="absolute left-0 right-[29.1em] top-0 flex items-center justify-between gap-[1em] px-[3em] pt-[1.5em]">
        <span className="flex items-center gap-[0.6em] border-[0.14em] border-[#F0E9DC] bg-[#120E0B] px-[0.8em] py-[0.45em] outline outline-[0.08em] outline-offset-[0.2em] outline-[#F0E9DC]">
          <Poste className="h-[2.3em] w-auto" />
          <span className="text-[1.6em] leading-none" style={DISPLAY}>Barbearia Move</span>
        </span>
        <span className="flex gap-[1.5em] text-[0.95em] font-semibold">
          <span>Cortes</span><span>Preços</span><span>Como chegar</span>
        </span>
      </div>

      {/* a venda: subtítulo, o que a pessoa leva e os botões */}
      <div className="absolute bottom-[2.4em] left-[3em] w-[45em]">
        <p className="max-w-[31em] text-[1.3em] font-semibold leading-[1.25]">
          Degradê sem marca de máquina, barba feita na navalha e aquele cuidado que faz você voltar.
        </p>
        <ul className="mt-[1em] flex flex-wrap gap-x-[1.5em] gap-y-[0.4em] text-[1em] font-semibold">
          {BENEFICIOS.map((b) => (
            <li key={b} className="flex items-center gap-[0.4em]">
              <Check className="h-[1.1em] w-[1.1em] text-[#F2B632]" strokeWidth={3.5} aria-hidden="true" /> {b}
            </li>
          ))}
        </ul>
        <div className="mt-[1.3em] flex items-center gap-[1em]">
          <span className="inline-flex items-center gap-[0.5em] whitespace-nowrap bg-[#120E0B] px-[1.1em] py-[0.8em] text-[1.5em] leading-none text-[#F0E9DC] shadow-[0.22em_0.22em_0_#F2B632]" style={DISPLAY}>
            Quero esse corte <ArrowRight className="h-[1em] w-[1em]" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className="whitespace-nowrap border-[0.14em] border-[#F0E9DC] px-[1.1em] py-[0.8em] text-[1.15em] font-bold leading-none">
            Ver cortes e preços
          </span>
        </div>
      </div>
    </div>
  );
}
