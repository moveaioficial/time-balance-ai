import { useEffect, useRef } from "react";
import "@fontsource/bowlby-one/latin-400.css";
import { aparelhoFraco, CabeloPalavra, FONTE_PALAVRA, type EstadoMaquina } from "@/components/barbearia/cabelo";
import { Maquina, Poste } from "@/components/barbearia/Maquina";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

// O "depois" da seção "Na prática" no computador: só a primeira dobra da landing da Barbearia Move, dentro da moldura.
// A máquina corta a promessa até ela ficar legível; ao lado, o resultado (a foto do degradê), o preço e a reserva.
// Os botões são só visuais. Este arquivo só carrega quando a seção chega perto da tela; não usa GSAP.
// Foto do Pexels (licença gratuita com uso comercial), em public/img/barbearia/:
//   fade-perfil  Brian Silva  pexels.com/photo/39559324 (espelhada, para o rosto olhar para o texto)

const DISPLAY: React.CSSProperties = { fontFamily: "'Bowlby One', 'Arial Black', sans-serif" };
const HORARIOS = ["16h40", "17h20", "18h00", "18h40"];
const ESCOLHIDO = 1;

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
        linhas: ["HORA MARCADA,", "CORTE NA", "RÉGUA."],
        caixa: { x: 3 * em, y: 7.6 * em, w: 45 * em, h: 19.4 * em },
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
      {/* o resultado: a foto ocupa a altura toda, separada por uma faixa de poste de barbearia */}
      <div className="absolute inset-y-0 right-0 w-[28em] overflow-hidden bg-[#6C7178]">
        <img src="/img/barbearia/fade-perfil.webp" alt="" decoding="async" className="h-full w-full -scale-x-100 object-cover object-[50%_32%]" />
        <div className="absolute inset-x-[1.4em] bottom-[1.4em] flex items-center justify-between gap-[1em] bg-[#120E0B] px-[1.2em] py-[0.9em]">
          <div>
            <p className="text-[1.3em] leading-none" style={DISPLAY}>Corte e barba</p>
            <p className="mt-[0.45em] text-[0.9em] leading-none text-[#F0E9DC]/80">Em uma hora, você sai pronto.</p>
          </div>
          <p className="flex-none text-[2.1em] leading-none text-[#F2B632]" style={DISPLAY}>R$ 85</p>
        </div>
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
          <span>Serviços</span><span>Preços</span><span>Como chegar</span>
        </span>
      </div>

      {/* a venda: promessa, horário e o botão */}
      <div className="absolute bottom-[2.2em] left-[3em] w-[45em]">
        <p className="text-[1.3em] font-semibold leading-[1.25]">
          Escolha o horário, chegue e sente na cadeira. Sem esperar a sua vez.
        </p>
        <div className="mt-[1em] flex items-center gap-[0.6em]">
          <span className="mr-[0.3em] text-[1em] font-bold">Hoje:</span>
          {HORARIOS.map((h, i) => (
            <span
              key={h}
              className={`border-[0.12em] border-[#F0E9DC] px-[0.8em] py-[0.45em] text-[1em] font-bold leading-none ${i === ESCOLHIDO ? "bg-[#F0E9DC] text-[#120E0B]" : ""}`}
            >
              {h}
            </span>
          ))}
        </div>
        <div className="mt-[1em] flex items-center gap-[1.2em]">
          <span className="inline-flex items-center gap-[0.5em] whitespace-nowrap bg-[#120E0B] px-[1.1em] py-[0.8em] text-[1.5em] leading-none text-[#F0E9DC] shadow-[0.22em_0.22em_0_#F2B632]" style={DISPLAY}>
            <WhatsAppIcon className="h-[1.1em] w-[1.1em]" colorido /> Reservar minha cadeira
          </span>
          <span className="text-[1em] font-semibold leading-tight">Confirma em<br />uma mensagem.</span>
        </div>
      </div>
    </div>
  );
}
