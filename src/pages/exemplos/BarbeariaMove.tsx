import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSeo } from "@/hooks/use-page-title";
import { SEO } from "@/lib/seo";
import { WHATSAPP_URL } from "@/lib/contato";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { PalavraCabelo, type PalavraCabeloHandle } from "@/components/barbearia/PalavraCabelo";
import { CampoDegrade, PENTES } from "@/components/barbearia/cabelo";
import { Maquina, Poste } from "@/components/barbearia/Maquina";
import "./barbearia-move.css";

// Barbearia Move: site de EXEMPLO da Move AI. A barbearia não existe; nomes, preços, endereço e depoimentos são inventados.
// A ideia: a página tem cabelo de verdade. O nome da barbearia nasce coberto de fios, a máquina passa e a letra limpa aparece;
// o degradê se forma com a rolagem, pente por pente; e no fim o nome cresce de novo, porque cabelo cresce.
//
// Fotos do Pexels (licença gratuita com uso comercial), em public/img/barbearia/:
//   cadeira        Sofía Marquet              pexels.com/photo/18173343
//   salao          Pavel Danilyuk             pexels.com/photo/7518739
//   poste-cafe     Maria Orlova               pexels.com/photo/4947554
//   fade-perfil    Brian Silva                pexels.com/photo/39559324
//   fade-linha     Brian Silva                pexels.com/photo/39559270
//   fade-maquina   Brian Silva                pexels.com/photo/39559262
//   pente          Alexander Mass             pexels.com/photo/33461079
//   toalha         Mathias Reding             pexels.com/photo/20405689
//   cachos         Matheus Wladeka            pexels.com/photo/6487911
//   navalha        Erik Mclean                pexels.com/photo/9456810
//   ferramentas    RDNE Stock project         pexels.com/photo/7697490
//   jorge          ENIO ENGENHEIRO            pexels.com/photo/39218966
//   beto           alexandre saraiva carniato pexels.com/photo/5188606
//   kaique         Mateus Cordeiro            pexels.com/photo/28208787

gsap.registerPlugin(ScrollTrigger);

const IMG = "/img/barbearia/";
const FIM = "fim-do-exemplo";

const SERVICOS = [
  { nome: "Corte", preco: 45, tempo: "40 min", nota: "Tesoura ou máquina, lavado e finalizado.", foto: "pente" },
  { nome: "Degradê", preco: 55, tempo: "50 min", nota: "Do pente 3 à navalha, sem degrau.", foto: "fade-linha" },
  { nome: "Barba com toalha quente", preco: 40, tempo: "30 min", nota: "Toalha, navalha e óleo no final.", foto: "toalha" },
  { nome: "Corte e barba", preco: 85, tempo: "1 h 10", nota: "A cadeira é sua por mais de uma hora.", foto: "navalha" },
  { nome: "Pezinho", preco: 15, tempo: "10 min", nota: "Sem hora marcada, se a cadeira estiver livre.", foto: "fade-maquina" },
  { nome: "Sobrancelha", preco: 15, tempo: "10 min", nota: "Na navalha, só o que precisa sair.", foto: "ferramentas" },
];

const EQUIPE = [
  { nome: "Jorge", papel: "Dono. Abriu a casa e ainda pega a primeira cadeira.", foto: "jorge" },
  { nome: "Beto", papel: "Barba e toalha quente. Conversa só se você quiser.", foto: "beto" },
  { nome: "Kaique", papel: "Degradê e desenho. É ele que os meninos pedem.", foto: "kaique" },
];

const GALERIA = [
  { foto: "fade-linha", nome: "Degradê com risco" },
  { foto: "toalha", nome: "Barba com toalha quente" },
  { foto: "cachos", nome: "Laterais baixas, cachos em cima" },
  { foto: "salao", nome: "A casa num sábado" },
  { foto: "fade-maquina", nome: "Máquina no acabamento" },
  { foto: "pente", nome: "Pente e máquina no social" },
];

const COMANDAS = [
  { n: "0412", item: "Degradê", valor: "R$ 55", texto: "Marquei às 16:40 e sentei na cadeira às 16:40. Nunca tinha visto isso em barbearia.", quem: "Diego, 29" },
  { n: "0433", item: "Corte infantil", valor: "R$ 40", texto: "O Theo chorava em todo barbeiro. Aqui pediu para voltar na semana seguinte.", quem: "Patrícia, mãe do Theo" },
  { n: "0451", item: "Corte e barba", valor: "R$ 85", texto: "Vim pela barba e fiquei para o café. Agora volto de quinze em quinze dias.", quem: "Seu Antônio, 67" },
];

const HORARIOS = [
  ["Terça a sexta", "9h às 20h"],
  ["Sábado", "8h às 18h"],
  ["Domingo e segunda", "fechado"],
];

const irPara = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const alvo = document.getElementById(id);
  if (!alvo) return;
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: alvo.getBoundingClientRect().top + window.scrollY, behavior: reduz ? "auto" : "smooth" });
};

function BotaoMarcar({ claro, children = "Marcar horário" }: { claro?: boolean; children?: string }) {
  return (
    <a href={`#${FIM}`} onClick={(e) => irPara(e, FIM)} className={`bm-botao ${claro ? "bm-botao-claro" : ""}`}>
      <span className="bm-botao-listras" aria-hidden="true" />
      <span className="bm-botao-txt">{children}</span>
    </a>
  );
}

// Foto que a navalha abre: o recorte anda junto com a lâmina.
function FotoNavalha({ src, alt, className = "", eager }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <figure className={`bm-foto ${className}`} data-navalha>
      <div className="bm-foto-recorte">
        <img src={`${IMG}${src}.webp`} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
      </div>
      <svg className="bm-lamina" viewBox="0 0 40 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M18 0 L40 0 L40 400 L18 400 Q0 200 18 0 Z" fill="#E7E2D7" />
        <path d="M34 0 L40 0 L40 400 L34 400 Z" fill="#A79F91" />
      </svg>
    </figure>
  );
}

// Abertura: a palavra de cabelo e a máquina
function Abertura() {
  const palavra = useRef<PalavraCabeloHandle>(null);
  const [cortado, setCortado] = useState(false);
  const [celular] = useState(() => window.matchMedia("(pointer: coarse)").matches);

  const medir = useCallback((w: number, h: number) => {
    const emPe = w < 700;
    if (emPe) {
      const topo = 66;
      return { linhas: ["MO", "VE"], caixa: { x: 16, y: topo, w: w - 44, h: h - topo - 236 }, faixasPorLinha: 2, maxFios: 5200 };
    }
    const topo = 92;
    return { linhas: ["MOVE"], caixa: { x: 32, y: topo, w: w - 96, h: h - topo - 196 }, faixasPorLinha: 3, maxFios: 13000 };
  }, []);

  return (
    <section className="bm-abertura" data-abertura>
      <PalavraCabelo
        ref={palavra}
        medir={medir}
        modo="auto"
        corLetra="#F0E9DC"
        interativo
        onCortado={() => setCortado(true)}
      />
      <header className="bm-nav">
        <a href="#topo" onClick={(e) => irPara(e, "topo")} className="bm-marca">
          <Poste className="bm-marca-poste" />
          <span>Barbearia Move</span>
        </a>
        <nav aria-label="Seções do site">
          <a href="#a-casa" onClick={(e) => irPara(e, "a-casa")}>A casa</a>
          <a href="#degrade" onClick={(e) => irPara(e, "degrade")}>Degradê</a>
          <a href="#servicos" onClick={(e) => irPara(e, "servicos")}>Serviços</a>
          <a href="#equipe" onClick={(e) => irPara(e, "equipe")}>Equipe</a>
          <a href="#como-chegar" onClick={(e) => irPara(e, "como-chegar")}>Como chegar</a>
        </nav>
        <BotaoMarcar claro />
      </header>
      <div className="bm-abertura-rodape">
        <div>
          <h1>Você senta de um jeito e levanta de outro.</h1>
          <p>Barbearia Move: corte, barba e degradê com hora marcada, em Guarulhos.</p>
        </div>
        <div className="bm-abertura-acao">
          <BotaoMarcar claro />
          {cortado ? (
            <button type="button" className="bm-crescer" onClick={() => { setCortado(false); palavra.current?.crescer(); }}>
              Deixar crescer e cortar você mesmo
            </button>
          ) : (
            <p className="bm-dica">{celular ? "Arraste o dedo no nome: a máquina é sua." : "Passe o mouse no nome: a máquina é sua."}</p>
          )}
        </div>
      </div>
    </section>
  );
}

// O degradê que se forma com a rolagem, fios de verdade
function Degrade() {
  const secao = useRef<HTMLElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const maquina = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  useEffect(() => {
    const canvas = tela.current;
    const el = secao.current;
    if (!canvas || !el) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = el.clientWidth;
    const H = window.innerHeight;
    const campo = new CampoDegrade(canvas, W, H, W < 700 ? 4200 : 10000);
    if (reduz) {
      campo.desenhar(1);
      setAtivo(PENTES.length - 1);
      return;
    }
    campo.desenhar(0);
    const estado = { p: 0 };
    const m = maquina.current;
    const alturaMaq = Math.max(70, H * 0.14);
    if (m) m.style.height = `${alturaMaq}px`;
    const ctx = gsap.context(() => {
      gsap.to(estado, {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
        onUpdate: () => {
          campo.desenhar(estado.p);
          const pos = campo.posicaoMaquina(estado.p);
          setAtivo(Math.min(pos.faixa, PENTES.length - 1));
          if (m) {
            m.style.opacity = estado.p > 0.002 && estado.p < 0.995 ? "1" : "0";
            m.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-100%, -50%)`;
          }
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const pente = PENTES[PENTES.length - 1 - ativo];
  return (
    <section className="bm-degrade" id="degrade" ref={secao}>
      <canvas ref={tela} aria-hidden="true" className="bm-degrade-tela" />
      <Maquina ref={maquina} />
      <div className="bm-degrade-conteudo">
        <h2 data-aparar>Degradê se faz pente por pente.</h2>
        <aside className="bm-pentes">
          <div className="bm-pentes-foto">
            <img src={`${IMG}fade-perfil.webp`} alt="Homem de perfil com degradê baixo e barba desenhada" loading="lazy" decoding="async" style={{ clipPath: `inset(${100 - ((ativo + 1) / PENTES.length) * 100}% 0 0 0)` }} />
          </div>
          <ol>
            {PENTES.map((p, i) => (
              <li key={p.nome} className={i === PENTES.length - 1 - ativo ? "bm-pente-ativo" : i > PENTES.length - 1 - ativo ? "bm-pente-feito" : ""}>
                <span>{p.nome}</span>
                <span>{p.medida}</span>
              </li>
            ))}
          </ol>
          <p className="bm-pente-agora" aria-hidden="true"><strong>{pente.nome}</strong> {pente.medida}</p>
        </aside>
      </div>
    </section>
  );
}

// Serviços: a foto do serviço acompanha o mouse
function Servicos() {
  const foto = useRef<HTMLDivElement>(null);
  const [atual, setAtual] = useState<string | null>(null);
  const mover = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  useEffect(() => {
    if (!foto.current) return;
    mover.current = {
      x: gsap.quickTo(foto.current, "x", { duration: 0.45, ease: "power3" }),
      y: gsap.quickTo(foto.current, "y", { duration: 0.45, ease: "power3" }),
    };
  }, []);

  return (
    <section
      className="bm-servicos"
      id="servicos"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mover.current?.x(e.clientX - r.left);
        mover.current?.y(e.clientY - r.top);
      }}
      onMouseLeave={() => setAtual(null)}
    >
      <div className="bm-servicos-titulo">
        <h2 data-aparar>Serviços</h2>
        <p>O tempo está na tabela porque é o tempo que a gente usa. Preços de exemplo, como tudo aqui.</p>
      </div>
      <ul className="bm-lista">
        {SERVICOS.map((s) => (
          <li key={s.nome} data-sobe onMouseEnter={() => setAtual(s.foto)}>
            <div className="bm-lista-nome">
              <h3>{s.nome}</h3>
              <p>{s.nota}</p>
            </div>
            <span className="bm-lista-tempo">{s.tempo}</span>
            <span className="bm-lista-preco">R$ {s.preco}</span>
          </li>
        ))}
      </ul>
      <div ref={foto} className={`bm-servicos-foto ${atual ? "bm-on" : ""}`} aria-hidden="true">
        {SERVICOS.map((s) => (
          <img key={s.nome} src={`${IMG}${s.foto}.webp`} alt="" loading="lazy" decoding="async" className={atual === s.foto ? "bm-on" : ""} />
        ))}
      </div>
    </section>
  );
}

function Mapa() {
  // no celular o mapa fecha no caminho, para os nomes das ruas continuarem legíveis
  const [celular] = useState(() => window.matchMedia("(max-width: 699px)").matches);
  return (
    <svg className="bm-mapa" viewBox={celular ? "130 110 450 390" : "0 0 720 620"} role="img" aria-label="Mapa desenhado com o caminho da avenida até a Rua Exemplo, 40. O endereço é de mentira.">
      <rect width="720" height="620" fill="#F0E9DC" />
      {/* quadras */}
      <g fill="#120E0B">
        <path d="M-10 -10 H250 V150 H-10 Z" />
        <path d="M290 -10 H500 V150 H290 Z" />
        <path d="M540 -10 H730 V210 H540 Z" />
        <path d="M-10 190 H180 V390 H-10 Z" />
        <path d="M220 190 H500 V300 H220 Z" />
        <path d="M220 340 H500 V450 H220 Z" />
        <path d="M540 250 H730 V450 H540 Z" />
        <path d="M-10 430 H180 V630 H-10 Z" />
        <path d="M220 490 H730 V630 H220 Z" />
      </g>
      {/* praça */}
      <path d="M580 280 H700 V420 H580 Z" fill="#16358C" />
      <g fill="#120E0B" fontFamily="Inter, sans-serif" fontSize="17" fontWeight="600">
        <text x="290" y="176">Avenida da Ponte</text>
        <text x="418" y="326">Rua Exemplo</text>
        <text x="228" y="475">Rua do Pente</text>
        <text transform="translate(514 300) rotate(90)">Rua da Tesoura</text>
      </g>
      <text x="598" y="356" fill="#F0E9DC" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="600">Praça</text>
      {/* caminho */}
      <path data-rota d="M0 170 H200 V320 H390" fill="none" stroke="#C4291C" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
      {/* a casa */}
      <g data-pino transform="translate(394 244)">
        <rect x="0" y="0" width="16" height="64" fill="#F0E9DC" stroke="#F0E9DC" strokeWidth="5" />
        <path d="M0 14 L16 2 V12 L0 24 Z M0 34 L16 22 V32 L0 44 Z M0 54 L16 42 V52 L0 64 Z" fill="#C4291C" />
      </g>
    </svg>
  );
}

export default function BarbeariaMove() {
  useSeo(SEO.barbearia);
  const raiz = useRef<HTMLDivElement>(null);
  const listras = useRef<SVGGElement>(null);
  const rodape = useRef<PalavraCabeloHandle>(null);
  const trilho = useRef<HTMLDivElement>(null);

  const medirRodape = useCallback((w: number, h: number) => {
    const emPe = w < 700;
    return {
      linhas: emPe ? ["MO", "VE"] : ["MOVE"],
      caixa: { x: emPe ? 16 : 32, y: 16, w: w - (emPe ? 32 : 64), h: h - 32 },
      faixasPorLinha: 2,
      maxFios: emPe ? 4500 : 11000,
    };
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // poste de barbeiro: as listras giram com a rolagem da página inteira
      if (listras.current) {
        gsap.to(listras.current, {
          y: 18 * 40,
          ease: "none",
          modifiers: { y: (v) => `${parseFloat(v) % 18}`},
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        });
      }

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // os títulos entram "aparados": cada letra sobe de trás de uma linha
        gsap.utils.toArray<HTMLElement>("[data-aparar]").forEach((t) => {
          const texto = t.textContent ?? "";
          t.setAttribute("aria-label", texto);
          t.innerHTML = texto
            .split(" ")
            .map((p) => `<span class="bm-pal" aria-hidden="true">${[...p].map((c) => `<span class="bm-letra">${c}</span>`).join("")}</span>`)
            .join(" ");
          gsap.from(t.querySelectorAll(".bm-letra"), {
            yPercent: 112,
            rotate: 5,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.016,
            scrollTrigger: { trigger: t, start: "top 88%", once: true },
          });
        });

        // a navalha abre as fotos
        gsap.utils.toArray<HTMLElement>("[data-navalha]").forEach((f) => {
          const recorte = f.querySelector<HTMLElement>(".bm-foto-recorte");
          const lamina = f.querySelector<HTMLElement>(".bm-lamina");
          const img = f.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: f, start: "top 82%", once: true } });
          tl.fromTo(recorte, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.15, ease: "power3.inOut" }, 0)
            .fromTo(lamina, { left: "0%", opacity: 1 }, { left: "100%", duration: 1.15, ease: "power3.inOut" }, 0)
            .to(lamina, { opacity: 0, duration: 0.2 }, 1.05)
            .fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);
        });

        // fotos da casa e da equipe andam em velocidades diferentes
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((p) => {
          gsap.to(p, {
            yPercent: Number(p.dataset.parallax),
            ease: "none",
            scrollTrigger: { trigger: p, start: "top bottom", end: "bottom top", scrub: true },
          });
        });

        // linhas que sobem
        gsap.utils.toArray<HTMLElement>("[data-sobe]").forEach((l) => {
          gsap.from(l, { y: 28, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: l, start: "top 90%", once: true } });
        });

        // comandas caindo na mesa
        gsap.from("[data-comanda]", {
          y: -140,
          rotate: (i) => [-22, 16, -12][i],
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.3)",
          stagger: 0.16,
          scrollTrigger: { trigger: "[data-comandas]", start: "top 72%", once: true },
        });

        // o caminho no mapa se desenha com a rolagem, e o poste aparece no fim
        const rota = el.querySelector<SVGPathElement>("[data-rota]");
        if (rota) {
          const comp = rota.getTotalLength();
          gsap.set(rota, { strokeDasharray: comp, strokeDashoffset: comp });
          gsap.to(rota, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: rota.ownerSVGElement, start: "top 75%", end: "center 45%", scrub: 0.4 },
          });
          gsap.from("[data-pino]", {
            scale: 0,
            transformOrigin: "50% 100%",
            ease: "back.out(2)",
            duration: 0.5,
            scrollTrigger: { trigger: rota.ownerSVGElement, start: "center 50%", once: true },
          });
        }
      });

      // galeria: rola de lado no computador; no celular é um carrossel nativo, com o dedo
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 900px)", () => {
        const t = trilho.current;
        if (!t) return;
        const distancia = () => t.scrollWidth - window.innerWidth;
        gsap.to(t, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: t.parentElement,
            start: "top top",
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 0.5,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });

      // o botão fixo só aparece depois da abertura e some no fim
      ScrollTrigger.create({
        trigger: "[data-abertura]",
        start: "bottom 60%",
        endTrigger: `#${FIM}`,
        end: "top bottom",
        toggleClass: { targets: ".bm-fixo", className: "bm-on" },
      });

      // rodapé: o nome cresce de novo enquanto a pessoa rola até o fim
      if (!reduz) {
        ScrollTrigger.create({
          trigger: "[data-rodape]",
          start: "top 85%",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (s) => rodape.current?.definirCrescimento(0.02 + s.progress * 0.98),
        });
      }
    }, el);

    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <div className="bm" ref={raiz} id="topo">
      <p className="bm-aviso">
        Site de exemplo feito pela Move AI. A Barbearia Move não existe. <Link to="/">Voltar para a Move AI</Link>
      </p>

      <div className="bm-poste-fixo" aria-hidden="true"><Poste listrasRef={listras} /></div>

      <main>
        <Abertura />

        <section className="bm-casa" id="a-casa">
          <FotoNavalha src="cadeira" alt="Cadeira de barbeiro de couro vermelho sobre piso de ladrilho preto e branco" className="bm-casa-grande" />
          <div className="bm-casa-texto">
            <h2 data-aparar>Três cadeiras e nenhuma pressa.</h2>
            <p data-sobe>
              A Barbearia Move abriu em 2011 numa garagem da Vila Galvão. Hoje são três cadeiras vermelhas, café passado na hora e o jogo na TV quando tem jogo.
            </p>
            <p data-sobe>
              Cada cliente fica 40 minutos na cadeira, porque é o tempo que um corte bem feito leva. Por isso a gente trabalha com hora marcada: você chega, senta e ninguém fica olhando o relógio.
            </p>
            <div className="bm-casa-menor" data-parallax="-14">
              <FotoNavalha src="poste-cafe" alt="Poste de barbeiro na vitrine, com a máquina de café logo abaixo" />
            </div>
          </div>
        </section>

        <Degrade />

        <Servicos />

        <section className="bm-equipe" id="equipe">
          <h2 data-aparar>Quem segura a máquina</h2>
          <div className="bm-equipe-grade">
            {EQUIPE.map((p, i) => (
              <article key={p.nome} className={`bm-barbeiro bm-barbeiro-${i}`} data-parallax={[-6, 5, -10][i]}>
                <FotoNavalha src={p.foto} alt={`${p.nome}, barbeiro`} />
                <h3>{p.nome}</h3>
                <p>{p.papel}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bm-galeria" id="galeria">
          <div className="bm-galeria-trilho" ref={trilho}>
            <div className="bm-galeria-abre">
              <h2 data-aparar>Saiu daqui.</h2>
              <p>Alguns cortes da semana. Peça pelo nome ou mostre uma foto, que a gente diz se fica bom em você.</p>
            </div>
            {GALERIA.map((g, i) => (
              <figure key={g.foto} className={`bm-galeria-foto bm-galeria-foto-${i % 3}`}>
                <img src={`${IMG}${g.foto}.webp`} alt={g.nome} loading="lazy" decoding="async" />
                <figcaption>{g.nome}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="bm-depoimentos">
          <div className="bm-depoimentos-titulo">
            <h2 data-aparar>Direto da comanda</h2>
            <p>Depoimentos fictícios, como a barbearia.</p>
          </div>
          <div className="bm-comandas" data-comandas>
            {COMANDAS.map((c) => (
              <article key={c.n} className="bm-comanda" data-comanda>
                <header><span>Barbearia Move</span><span>Comanda {c.n}</span></header>
                <p className="bm-comanda-item"><span>{c.item}</span><span>{c.valor}</span></p>
                <blockquote>{c.texto}</blockquote>
                <footer>{c.quem}</footer>
              </article>
            ))}
          </div>
        </section>

        <section className="bm-chegar" id="como-chegar">
          <Mapa />
          <div className="bm-chegar-texto">
            <h2 data-aparar>Como chegar</h2>
            <p className="bm-endereco">Rua Exemplo, 40<br />Vila Galvão, Guarulhos</p>
            <p>Quem vem pela Avenida da Ponte entra na segunda à direita. O poste fica na calçada e dá para ver da esquina. Dá para parar na rua depois das 10h.</p>
            <table>
              <caption>Horário de funcionamento</caption>
              <tbody>
                {HORARIOS.map(([d, h]) => (
                  <tr key={d}><th scope="row">{d}</th><td>{h}</td></tr>
                ))}
              </tbody>
            </table>
            <BotaoMarcar />
          </div>
        </section>

        <section className="bm-volta" data-rodape>
          <div className="bm-volta-palavra">
            <PalavraCabelo ref={rodape} medir={medirRodape} modo="manual" corLetra="#F0E9DC" />
          </div>
          <div className="bm-volta-texto">
            <h2>Cresceu? Volta.</h2>
            <BotaoMarcar claro />
          </div>
        </section>
      </main>

      <footer className="bm-fim" id={FIM}>
        <div>
          <h2>Até aqui, tudo de mentira.</h2>
          <p>
            A Barbearia Move não existe. Nomes, preços, endereço e depoimentos foram inventados, e o botão de marcar horário só traz você até aqui. O site é de verdade: foi a Move AI que fez, e faz um assim para a sua empresa.
          </p>
        </div>
        <div className="bm-fim-acoes">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bm-botao">
            <span className="bm-botao-listras" aria-hidden="true" />
            <span className="bm-botao-txt"><WhatsAppIcon className="bm-icone" /> Falar com a Move AI</span>
          </a>
          <Link to="/" className="bm-link">Voltar para o site da Move AI</Link>
          <p className="bm-creditos">Fotos do Pexels: Sofía Marquet, Pavel Danilyuk, Maria Orlova, Brian Silva, Alexander Mass, Mathias Reding, Matheus Wladeka, Erik Mclean, RDNE Stock project, ENIO ENGENHEIRO, alexandre saraiva carniato e Mateus Cordeiro. As pessoas das fotos não têm relação com esta barbearia inventada.</p>
        </div>
      </footer>

      <div className="bm-fixo">
        <BotaoMarcar />
      </div>
    </div>
  );
}
