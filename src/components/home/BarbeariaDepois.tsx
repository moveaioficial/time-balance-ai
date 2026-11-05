import { useEffect, useRef, useState } from "react";
import "@fontsource/bowlby-one/latin-400.css";
import { aparelhoFraco, CabeloPalavra, CampoDegrade, FONTE_PALAVRA, type EstadoMaquina } from "@/components/barbearia/cabelo";
import { Maquina, Poste } from "@/components/barbearia/Maquina";

// O "depois" da seção "Na prática": a landing da Barbearia Move em tamanho reduzido, dentro da moldura. A barbearia é FICTÍCIA.
// Três blocos em sequência: a abertura com a máquina cortando o nome, o degradê e os serviços. A página desce sozinha,
// só com transform. Este arquivo só carrega quando a seção chega perto da tela; não usa GSAP.
// Fotos do Pexels (licença gratuita com uso comercial), em public/img/barbearia/:
//   fade-perfil  Brian Silva     pexels.com/photo/39559324
//   cadeira      Sofía Marquet   pexels.com/photo/18173343 (recortada para não mostrar rótulos)

const DISPLAY: React.CSSProperties = { fontFamily: "'Bowlby One', 'Arial Black', sans-serif" };
const SERVICOS: [string, string][] = [
  ["Corte", "R$ 45"],
  ["Degradê", "R$ 55"],
  ["Barba com toalha", "R$ 40"],
  ["Corte e barba", "R$ 85"],
];
const PENTES = [
  ["Pente 3", "9 mm"],
  ["Pente 1", "3 mm"],
  ["Navalha", "na pele"],
];

export default function BarbeariaDepois() {
  const quadro = useRef<HTMLDivElement>(null);
  const telaPalavra = useRef<HTMLCanvasElement>(null);
  const telaFade = useRef<HTMLCanvasElement>(null);
  const maqPalavra = useRef<HTMLDivElement>(null);
  const maqFade = useRef<HTMLDivElement>(null);
  const [bloco, setBloco] = useState(0);
  const [pente, setPente] = useState(-1);

  useEffect(() => {
    const el = quadro.current;
    const cp = telaPalavra.current;
    const cf = telaFade.current;
    if (!el || !cp || !cf) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fraco = aparelhoFraco();
    let vivo = true;
    let ativo = false;
    let timers: number[] = [];
    let palavra: CabeloPalavra | null = null;
    let campo: CampoDegrade | null = null;
    let largMontada = 0;

    const esperar = (ms: number, f: () => void) => { timers.push(window.setTimeout(f, ms)); };
    const limpar = () => { timers.forEach(clearTimeout); timers = []; };

    const moverMaq = (m: HTMLDivElement | null, x: number, y: number, dir: number, visivel: boolean, altura: number) => {
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
      const emPe = w < h;
      const em = w / (emPe ? 40 : 80);
      const dpr = Math.min(window.devicePixelRatio || 1, fraco ? 1 : emPe ? 1.5 : 1.25);
      palavra?.destruir();
      campo?.parar();
      palavra = new CabeloPalavra(cp, {
        linhas: emPe ? ["MO", "VE"] : ["MOVE"],
        caixa: emPe
          ? { x: 2 * em, y: 5.2 * em, w: w - 4 * em, h: h - 22 * em }
          : { x: 3 * em, y: 5 * em, w: w - 6 * em, h: h - 15.5 * em },
        corLetra: "#F0E9DC",
        largura: w,
        altura: h,
        dpr,
        maxFios: (emPe ? 4400 : 8500) * (fraco ? 0.6 : 1),
        faixasPorLinha: 2,
        onMaquina: (e: EstadoMaquina) => moverMaq(maqPalavra.current, e.x, e.y, e.dir, e.visivel, e.altura),
      });
      campo = new CampoDegrade(cf, w, h, Math.min(dpr, 1.25), (emPe ? 3200 : 6500) * (fraco ? 0.6 : 1));
      return true;
    };

    // a sequência da página
    const ciclo = () => {
      if (!vivo || !ativo || !palavra || !campo) return;
      const p = palavra;
      const c = campo;
      setBloco(0);
      setPente(-1);
      c.desenhar(0);
      p.crescer(650, () => {
        esperar(250, () => {
          p.passarMaquina(() => {
            esperar(1700, () => {
              setBloco(1);
              esperar(900, () => {
                c.passar(
                  2700,
                  (x, y, alt, faixa, visivel) => {
                    setPente((v) => (v === faixa ? v : faixa));
                    moverMaq(maqFade.current, x, y, 1, visivel, alt * 1.05);
                  },
                  () => {
                    esperar(1300, () => {
                      setBloco(2);
                      esperar(3900, ciclo);
                    });
                  },
                );
              });
            });
          });
        });
      });
    };

    const iniciar = () => {
      if (reduz) {
        palavra?.estadoFinal();
        campo?.desenhar(1);
        setPente(2);
        return;
      }
      ciclo();
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
        campo?.parar();
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
      campo?.parar();
    };
  }, []);

  return (
    <div ref={quadro} className="absolute inset-0 overflow-hidden bg-[#C4291C] text-[#F0E9DC]" style={{ fontFamily: "Inter, sans-serif" }}>
      <div
        className="absolute inset-x-0 top-0 h-[300%] transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.2,1)] motion-reduce:transition-none"
        style={{ transform: `translate3d(0, ${-(bloco * 100) / 3}%, 0)` }}
      >
        {/* abertura */}
        <section className="relative h-1/3 overflow-hidden bg-[#C4291C]">
          <canvas ref={telaPalavra} className="absolute inset-0 h-full w-full" />
          <Maquina ref={maqPalavra} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[2em] py-[1em] sm:px-[3em]">
            <span className="flex items-center gap-[0.5em]">
              <Poste className="h-[2em] w-auto" />
              <span className="text-[1.3em] leading-none" style={DISPLAY}>Barbearia Move</span>
            </span>
            <span className="hidden gap-[1.8em] text-[0.85em] font-medium sm:flex">
              <span>A casa</span><span>Degradê</span><span>Serviços</span><span>Equipe</span><span>Como chegar</span>
            </span>
            <span className="hidden bg-[#F0E9DC] px-[1em] py-[0.55em] text-[0.85em] font-semibold leading-none text-[#120E0B] sm:block">Marcar horário</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 px-[2em] pb-[3.4em] sm:px-[3em] sm:pb-[2em]">
            <p className="max-w-[15em] text-[2.1em] leading-[1.03] sm:text-[2.2em]" style={DISPLAY}>Você senta de um jeito e levanta de outro.</p>
            <p className="mt-[0.5em] text-[1.05em] leading-snug">Corte, barba e degradê com hora marcada.</p>
          </div>
        </section>

        {/* degradê */}
        <section className="relative h-1/3 overflow-hidden bg-[#C79A79]">
          <canvas ref={telaFade} className="absolute inset-0 h-full w-full" />
          <Maquina ref={maqFade} />
          <div className="absolute inset-0 flex flex-col justify-between px-[2em] pb-[3.4em] pt-[2em] sm:flex-row sm:px-[3em] sm:pb-[3em] sm:pt-[2.6em]">
            <p className="max-w-[8.6em] text-[3.1em] leading-[0.98] sm:text-[4.6em]" style={DISPLAY}>Degradê se faz pente por pente.</p>
            <div className="flex w-full flex-none gap-[1em] self-end bg-[#F0E9DC] p-[0.8em] text-[#120E0B] sm:block sm:w-[21em]">
              <img src="/img/barbearia/fade-perfil.webp" alt="" decoding="async" className="aspect-[4/3] w-[42%] object-cover object-[50%_30%] sm:w-full" />
              <ul className="flex-1 sm:mt-[0.6em]">
                {PENTES.map(([n, m], i) => (
                  <li key={n} className={`flex justify-between px-[0.6em] py-[0.35em] text-[0.95em] font-semibold transition-colors duration-200 ${2 - i === pente ? "bg-[#C4291C] text-[#F0E9DC]" : ""}`}>
                    <span>{n}</span><span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* serviços */}
        <section className="relative flex h-1/3 flex-col overflow-hidden bg-[#16358C] sm:grid sm:grid-cols-[1fr_1.35fr]">
          <div className="relative h-[17em] flex-none overflow-hidden sm:h-auto">
            <img src="/img/barbearia/cadeira.webp" alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-1 flex-col justify-center px-[2em] pb-[3em] pt-[1.4em] sm:px-[3em] sm:py-[2em]">
            <p className="text-[3.1em] leading-none sm:text-[4.2em]" style={DISPLAY}>Serviços</p>
            <p className="mt-[0.5em] text-[1em]">Preços de exemplo, como tudo aqui.</p>
            <ul className="mt-[1em] sm:mt-[1.4em]">
              {SERVICOS.map(([n, v], i) => (
                <li
                  key={n}
                  className={`flex items-baseline justify-between gap-[1em] border-t-[0.12em] border-[#F0E9DC]/30 py-[0.55em] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none sm:py-[0.7em] ${bloco === 2 ? "translate-y-0 opacity-100" : "translate-y-[1em] opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"}`}
                  style={{ transitionDelay: bloco === 2 ? `${300 + i * 90}ms` : "0ms" }}
                >
                  <span className="text-[1.5em] leading-tight sm:text-[1.8em]" style={DISPLAY}>{n}</span>
                  <span className="flex-none text-[1.5em] leading-tight sm:text-[1.8em]" style={DISPLAY}>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      {/* selo fixo: o exemplo é fictício */}
      <span className="absolute bottom-[1em] right-[1em] bg-[#120E0B] px-[0.7em] py-[0.4em] text-[0.8em] font-semibold leading-none text-[#F0E9DC]">Exemplo fictício</span>
    </div>
  );
}
