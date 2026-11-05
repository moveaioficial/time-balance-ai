import { useEffect, useRef, useState } from "react";
import "@fontsource/bowlby-one/latin-400.css";
import { aparelhoFraco, CabeloPalavra, CampoDegrade, FONTE_PALAVRA, type EstadoMaquina } from "@/components/barbearia/cabelo";
import { Maquina, Poste } from "@/components/barbearia/Maquina";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

// O "depois" da seção "Na prática": a landing da Barbearia Move em tamanho reduzido, dentro da moldura. A barbearia é FICTÍCIA.
// Três blocos que vendem, cada um com o seu botão (só visual, não funciona): a máquina corta a promessa até ela ficar legível,
// depois vêm o degradê e os serviços com o benefício de cada um. A página desce sozinha,
// só com transform. Este arquivo só carrega quando a seção chega perto da tela; não usa GSAP.
// Fotos do Pexels (licença gratuita com uso comercial), em public/img/barbearia/:
//   fade-perfil  Brian Silva     pexels.com/photo/39559324
//   cadeira      Sofía Marquet   pexels.com/photo/18173343 (recortada para não mostrar rótulos)

const DISPLAY: React.CSSProperties = { fontFamily: "'Bowlby One', 'Arial Black', sans-serif" };
const SERVICOS = [
  { n: "Corte", v: "R$ 45", d: "Lavado e finalizado, do jeito que você pediu." },
  { n: "Degradê", v: "R$ 55", d: "Do pente 3 à navalha, sem degrau." },
  { n: "Barba com toalha", v: "R$ 40", d: "Toalha quente antes da navalha, para a pele não arder." },
  { n: "Corte e barba", v: "R$ 85", d: "Uma hora de cadeira e você sai pronto." },
];
const PENTES = [
  ["Pente 3", "9 mm"],
  ["Pente 1", "3 mm"],
  ["Navalha", "na pele"],
];

// Só visual: o site é de exemplo, o botão não leva a lugar nenhum.
function Agendar({ claro = true, grande = false }: { claro?: boolean; grande?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center gap-[0.5em] whitespace-nowrap px-[1.15em] py-[0.8em] font-semibold leading-none ${grande ? "text-[1.1em]" : "text-[0.92em]"} ${claro ? "bg-[#F0E9DC] text-[#120E0B]" : "bg-[#120E0B] text-[#F0E9DC]"}`}>
      <WhatsAppIcon className="h-[1.2em] w-[1.2em]" colorido /> Agendar pelo WhatsApp
    </span>
  );
}

function Estrelas() {
  return (
    <span className="inline-flex gap-[0.08em]" aria-label="5 estrelas">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-[1em] w-[1em] fill-current" aria-hidden="true"><path d="M12 2l3 6.6 7 .9-5.1 4.8 1.4 7.1L12 17l-6.3 4.4 1.4-7.1L2 9.5l7-.9z" /></svg>
      ))}
    </span>
  );
}

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
        linhas: emPe ? ["HORA", "MARCADA,", "CORTE NA", "RÉGUA."] : ["HORA MARCADA,", "CORTE NA RÉGUA."],
        caixa: emPe
          ? { x: 2 * em, y: 6.6 * em, w: w - 4 * em, h: h - 24.6 * em }
          : { x: 3 * em, y: 6.6 * em, w: w - 6 * em, h: h - 20 * em },
        corLetra: "#F0E9DC",
        largura: w,
        altura: h,
        dpr,
        maxFios: (emPe ? 4400 : 8500) * (fraco ? 0.6 : 1),
        faixasPorLinha: emPe ? 1 : 2,
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
            esperar(2400, () => {
              setBloco(1);
              esperar(900, () => {
                c.passar(
                  2700,
                  (x, y, alt, faixa, visivel) => {
                    setPente((v) => (v === faixa ? v : faixa));
                    moverMaq(maqFade.current, x, y, 1, visivel, alt * 1.05);
                  },
                  () => {
                    esperar(1800, () => {
                      setBloco(2);
                      esperar(5200, ciclo);
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
        {/* abertura: a máquina corta a promessa até ela ficar legível */}
        <section className="relative h-1/3 overflow-hidden bg-[#C4291C]">
          <canvas ref={telaPalavra} className="absolute inset-0 h-full w-full" />
          <Maquina ref={maqPalavra} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-[1em] px-[2em] py-[1em] sm:px-[3em]">
            {/* a marca: placa com filete duplo, como a de uma barbearia de rua */}
            <span className="flex items-center gap-[0.6em] border-[0.14em] border-[#F0E9DC] bg-[#120E0B] px-[0.8em] py-[0.45em] outline outline-[0.08em] outline-offset-[0.2em] outline-[#F0E9DC]">
              <Poste className="h-[2.3em] w-auto" />
              <span className="text-[1.6em] leading-none" style={DISPLAY}>Barbearia Move</span>
            </span>
            <span className="hidden gap-[1.6em] text-[0.85em] font-medium sm:flex">
              <span>Serviços</span><span>Degradê</span><span>Como chegar</span>
            </span>
            <span className="hidden sm:block"><Agendar /></span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[1em] px-[2em] pb-[2.8em] sm:flex-row sm:items-end sm:justify-between sm:gap-[3em] sm:px-[3em] sm:pb-[2.6em]">
            <p className="max-w-[27em] text-[1.15em] font-medium leading-[1.3] sm:text-[1.3em]">
              Você marca pelo WhatsApp, chega no horário e senta na cadeira. Sem ficar esperando a sua vez.
            </p>
            <div className="flex flex-none flex-col items-start gap-[0.8em] sm:items-end">
              <Agendar grande />
              <p className="flex items-center gap-[0.5em] text-[0.88em] leading-tight sm:text-[0.82em]">
                <Estrelas /> <span>4,9 no Google · nota inventada para o exemplo</span>
              </p>
            </div>
          </div>
        </section>

        {/* degradê */}
        <section className="relative h-1/3 overflow-hidden bg-[#C79A79]">
          <canvas ref={telaFade} className="absolute inset-0 h-full w-full" />
          <Maquina ref={maqFade} />
          <div className="absolute inset-0 flex flex-col justify-between px-[2em] pb-[1.8em] pt-[2em] sm:flex-row sm:gap-[2em] sm:px-[3em] sm:pb-[2em] sm:pt-[2.4em]">
            <div>
              <p className="max-w-[8.6em] text-[3.1em] leading-[0.98] sm:text-[4.2em]" style={DISPLAY}>Degradê se faz pente por pente.</p>
              <p className="mt-[0.7em] max-w-[23em] text-[1.15em] font-semibold leading-[1.3] sm:text-[1.25em]">
                Por isso o seu não fica com degrau nem marca de máquina.
              </p>
            </div>
            <div className="flex w-full flex-none flex-col gap-[0.8em] self-end bg-[#F0E9DC] p-[0.8em] text-[#120E0B] sm:w-[21em]">
              <div className="flex gap-[0.8em] sm:block">
                <img src="/img/barbearia/fade-perfil.webp" alt="" decoding="async" className="aspect-[4/3] w-[42%] object-cover object-[50%_30%] sm:aspect-[16/10] sm:w-full" />
                <ul className="flex-1 sm:mt-[0.5em]">
                  {PENTES.map(([n, m], i) => (
                    <li key={n} className={`flex justify-between px-[0.6em] py-[0.3em] text-[0.92em] font-semibold transition-colors duration-200 ${2 - i === pente ? "bg-[#C4291C] text-[#F0E9DC]" : ""}`}>
                      <span>{n}</span><span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Agendar claro={false} />
            </div>
          </div>
        </section>

        {/* serviços, cada um com o que o cliente ganha */}
        <section className="relative flex h-1/3 flex-col overflow-hidden bg-[#16358C] sm:grid sm:grid-cols-[0.8fr_1.5fr]">
          <div className="relative h-[10em] flex-none overflow-hidden sm:h-auto">
            <img src="/img/barbearia/cadeira.webp" alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
          </div>
          <div className="flex flex-1 flex-col justify-center px-[2em] py-[1.2em] sm:px-[3em] sm:py-[1.6em]">
            <p className="text-[2.7em] leading-none sm:text-[3.4em]" style={DISPLAY}>Serviços e preços</p>
            <p className="mt-[0.4em] text-[0.95em]">Preços de exemplo, como tudo aqui.</p>
            <ul className="mt-[0.8em]">
              {SERVICOS.map(({ n, v, d }, i) => (
                <li
                  key={n}
                  className={`border-t-[0.12em] border-[#F0E9DC]/30 py-[0.45em] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${bloco === 2 ? "translate-y-0 opacity-100" : "translate-y-[1em] opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"}`}
                  style={{ transitionDelay: bloco === 2 ? `${300 + i * 90}ms` : "0ms" }}
                >
                  <span className="flex items-baseline justify-between gap-[1em] text-[1.4em] leading-tight sm:text-[1.5em]" style={DISPLAY}>
                    <span>{n}</span><span className="flex-none">{v}</span>
                  </span>
                  <span className="mt-[0.15em] block text-[0.95em] leading-snug">{d}</span>
                </li>
              ))}
            </ul>
            <div className="mt-[0.9em] flex flex-col items-start gap-[0.7em] sm:flex-row sm:items-center sm:justify-between">
              <Agendar />
              <p className="text-[0.85em] leading-tight sm:max-w-[17em]">“Marquei às 16:40 e sentei às 16:40.” Diego (cliente de exemplo)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
