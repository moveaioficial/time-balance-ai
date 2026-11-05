import { useEffect, useRef, useState } from "react";
import { Check, MapPin, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";

// Antes e depois da seção "Na prática": o site da Barbearia Move, uma barbearia FICTÍCIA (não existe, só ilustra).
// Fotos do Pexels (licença gratuita com uso comercial, sem crédito obrigatório), em public/img/:
//   barbearia-hero.webp  · Kawê Rodrigues · https://www.pexels.com/photo/barber-in-hair-salon-standing-by-client-on-chari-19664892/
//   barbearia-barba.webp · Th2city Santana · https://www.pexels.com/photo/barber-shaving-man-s-facial-hair-2014808/
//   barbearia-antes.webp · Nikolaos Dimou · https://www.pexels.com/photo/gray-hand-tool-1319459/
// Preços, horários, nota e avaliação são de exemplo. As medidas são em "em": o quadro define o tamanho base.

const CONDENSADA = "'Barlow Condensed', 'Arial Narrow', sans-serif";

/* ------------------------------------------------------------------ */
/* ANTES: o site típico de barbearia feito às pressas num construtor   */
/* ------------------------------------------------------------------ */

export function AntesBarbearia() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col overflow-hidden bg-black text-[#8a8a8a]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <div className="flex justify-between bg-[#1a1a1a] px-[2em] sm:px-[3em] py-[0.5em] text-[0.8em]" style={{ fontFamily: "Arial, sans-serif" }}>
        <span>☎ (11) 0000-0000</span>
        <span className="hidden sm:inline">Seg a Sáb das 9h às 19h *exceto feriados</span>
        <span className="sm:hidden">☰</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-[0.6em] border-b-[0.2em] border-[#C9A227] px-[3em] py-[1em]">
        <span className="flex items-center gap-[0.5em]">
          <span className="flex h-[2.4em] w-[2.4em] items-center justify-center rounded-full border-[0.15em] border-[#C9A227] text-[1.2em] text-[#C9A227]">✂</span>
          <span className="leading-none">
            <span className="block text-[1.8em] tracking-[0.04em] text-[#C9A227]" style={{ fontFamily: "Impact, 'Arial Black', sans-serif" }}>BARBEARIA MOVE</span>
            <span className="block text-[0.95em] italic text-white/70">desde 2015</span>
          </span>
        </span>
        <span className="hidden sm:flex gap-[1.4em] text-[0.8em] font-bold text-white" style={{ fontFamily: "Arial, sans-serif" }}>
          <span className="text-[#C9A227]">INÍCIO</span><span>SOBRE NÓS</span><span>SERVIÇOS</span><span>GALERIA</span><span>CONTATO</span>
        </span>
      </div>

      {/* "slider" com uma foto qualquer escurecida e esticada */}
      <div className="relative flex h-[17em] sm:h-[15em] items-center justify-center overflow-hidden text-center">
        <img src="/img/barbearia-antes.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-fill opacity-45 saturate-[0.4] sepia-[0.35]" />
        <span className="absolute left-[0.8em] text-[2.6em] text-white/60">‹</span>
        <span className="absolute right-[0.8em] text-[2.6em] text-white/60">›</span>
        <div className="relative px-[3em]">
          <p className="text-[2em] font-bold uppercase leading-tight text-[#FFD700]" style={{ textShadow: "2px 2px 3px #000" }}>
            Bem-vindo à Barbearia Move!!
          </p>
          <p className="mt-[0.5em] text-[1em] italic text-white" style={{ textShadow: "1px 1px 2px #000" }}>
            Tradição, estilo e qualidade para o homem moderno.
          </p>
          <span className="mt-[0.9em] inline-block bg-[#C9A227] px-[1.4em] py-[0.45em] text-[0.85em] font-bold text-black" style={{ fontFamily: "Arial, sans-serif" }}>SAIBA MAIS</span>
        </div>
      </div>

      <div className="flex-1 px-[2em] sm:px-[3em] pt-[1.4em] text-center">
        <p className="text-[1.4em] text-[#C9A227]">~ NOSSOS SERVIÇOS ~</p>
        <div className="mt-[1em] grid grid-cols-3 gap-[1.2em]">
          {["CORTE", "BARBA", "PIGMENTAÇÃO"].map((t) => (
            <div key={t}>
              <p className="text-[0.95em] font-bold text-white">{t}</p>
              <p className="mt-[0.3em] text-[0.75em] leading-snug">Consulte valores</p>
              <p className="mt-[0.3em] hidden sm:block text-[0.72em] leading-snug text-[#666]">Atendimento de qualidade com profissionais experientes e ambiente climatizado.</p>
            </div>
          ))}
        </div>
        <p className="mt-[1.2em] text-[0.85em] font-bold text-[#C0392B]" style={{ fontFamily: "Arial, sans-serif" }}>
          *** AGENDAMENTOS SOMENTE POR TELEFONE ***
        </p>
        {/* galeria com as mesmas fotos do site novo, só que espremidas, e o plugin do Instagram que quebrou */}
        <p className="mt-[1.2em] text-[1.1em] text-[#C9A227]">~ GALERIA ~</p>
        <div className="mx-auto mt-[0.6em] grid max-w-[30em] grid-cols-3 gap-[0.4em]">
          <img src="/img/barbearia-hero.webp" alt="" loading="lazy" decoding="async" className="h-[5em] w-full object-fill opacity-80" />
          <img src="/img/barbearia-barba.webp" alt="" loading="lazy" decoding="async" className="h-[5em] w-full object-fill opacity-80" />
          <div className="flex h-[5em] items-center justify-center border border-[#333] bg-[#111] px-[0.6em] text-[0.68em] leading-snug text-[#777]" style={{ fontFamily: "Arial, sans-serif" }}>
            ⚠ Erro ao carregar o feed do Instagram
          </div>
        </div>
      </div>

      <div className="bg-[#111] px-[3em] py-[0.6em] text-center text-[0.7em] text-[#555]" style={{ fontFamily: "Arial, sans-serif" }}>
        © 2015 Barbearia Move · Todos os direitos reservados
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DEPOIS: a mesma barbearia, com horário marcado em dois toques        */
/* ------------------------------------------------------------------ */

const SERVICOS = [
  { nome: "Corte", preco: 45, min: 30 },
  { nome: "Barba", preco: 35, min: 25 },
  { nome: "Corte e barba", preco: 70, min: 50 },
];

const HORARIOS = [
  { h: "14:00", livre: false },
  { h: "14:40", livre: true },
  { h: "15:20", livre: false },
  { h: "16:00", livre: true },
  { h: "16:40", livre: true },
  { h: "17:20", livre: true },
];

// Poste de barbeiro desenhado (listras em diagonal), usado como símbolo da marca fictícia.
function Poste({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 30" className={className} aria-hidden="true">
      <defs>
        <clipPath id="bb-poste"><rect x="1" y="3" width="10" height="24" rx="5" /></clipPath>
      </defs>
      <rect x="1" y="3" width="10" height="24" rx="5" fill="#F1ECE3" />
      <g clipPath="url(#bb-poste)" className="bb-listras">
        {[-24, -16, -8, 0, 8, 16, 24, 32].map((y) => (
          <path key={y} d={`M-2 ${y + 10} L14 ${y} L14 ${y + 3.4} L-2 ${y + 13.4} Z`} fill="#C8342A" />
        ))}
      </g>
      <rect x="2.5" y="0" width="7" height="3" rx="1.2" fill="#F1ECE3" />
      <rect x="2.5" y="27" width="7" height="3" rx="1.2" fill="#F1ECE3" />
    </svg>
  );
}

function useMovimentoReduzido() {
  const [reduz, setReduz] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduz(mq.matches);
    const fn = () => setReduz(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduz;
}

export function DepoisBarbearia({ ativo, interativo }: { ativo: boolean; interativo: boolean }) {
  const reduz = useMovimentoReduzido();
  const [servico, setServico] = useState(2);
  const [hora, setHora] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [apertando, setApertando] = useState(false);
  const mexeu = useRef(false);

  // Quando o divisor revela o site novo, a página "marca" sozinha o horário das 16:40 e a barbearia responde no WhatsApp.
  useEffect(() => {
    if (!ativo || mexeu.current) return;
    if (reduz) { setHora("16:40"); setEnviado(true); return; }
    const t = [
      window.setTimeout(() => !mexeu.current && setHora("16:40"), 2300),
      window.setTimeout(() => !mexeu.current && setApertando(true), 3100),
      window.setTimeout(() => { setApertando(false); if (!mexeu.current) setEnviado(true); }, 3280),
    ];
    return () => t.forEach(clearTimeout);
  }, [ativo, reduz]);

  const s = SERVICOS[servico];
  const tab = interativo ? 0 : -1;

  const escolherHora = (h: string) => { mexeu.current = true; setHora(h); setEnviado(false); };
  const escolherServico = (i: number) => { mexeu.current = true; setServico(i); setEnviado(false); };
  const reservar = () => { if (!hora) return; mexeu.current = true; setEnviado(true); };

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#F1ECE3] text-[#15120E]" style={{ fontFamily: "Inter, sans-serif" }}>
      <header className="flex flex-none items-center justify-between bg-[#15120E] px-[2em] sm:px-[3em] py-[0.9em] text-[#F1ECE3]">
        <span className="flex items-center gap-[0.55em]">
          <Poste className="h-[2.1em] w-auto" />
          <span className="text-[1.55em] font-bold uppercase leading-none tracking-[0.01em]" style={{ fontFamily: CONDENSADA }}>Barbearia Move</span>
        </span>
        <nav className="hidden sm:flex items-center gap-[1.8em] text-[0.85em] text-[#F1ECE3]/75">
          <span className="text-[#F1ECE3]">Horários</span><span>Serviços</span><span>Onde fica</span>
        </nav>
        <span className="flex items-center gap-[0.45em] rounded-[0.25em] bg-[#C8342A] px-[1em] py-[0.5em] text-[0.85em] font-semibold text-white">
          <WhatsAppIcon className="h-[1.1em] w-[1.1em]" /> (11) 0000-0000
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col sm:grid sm:grid-cols-2">
        {/* foto real ocupando metade da tela, com o endereço e uma avaliação de exemplo */}
        <div className="relative h-[22em] flex-none overflow-hidden sm:h-auto">
          <img src="/img/barbearia-hero.webp" alt="Barbeiro cortando o cabelo de um cliente sentado na cadeira da barbearia" loading="lazy" decoding="async" className="bb-drift absolute inset-0 h-full w-full object-cover object-[50%_28%]" />
          <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[linear-gradient(to_top,rgba(12,10,8,0.88),rgba(12,10,8,0))]" />
          <div className="absolute inset-x-0 bottom-0 px-[2em] pb-[1.4em] sm:px-[3em] sm:pb-[2.4em] text-[#F1ECE3]">
            <p className="hidden sm:block max-w-[17em] text-[1.9em] font-semibold leading-[1.02]" style={{ fontFamily: CONDENSADA }}>
              “Marquei 16:40 e sentei na cadeira às 16:40.”
            </p>
            <p className="mt-[0.5em] hidden sm:block text-[0.8em] text-[#F1ECE3]/80">Diego, cliente · avaliação de exemplo</p>
            <p className="mt-[0.9em] flex items-center gap-[0.4em] text-[0.8em] font-medium">
              <MapPin className="h-[1.1em] w-[1.1em] text-[#E8695E]" /> Rua Exemplo, 40 · Guarulhos · ter a sáb, 9h às 20h
            </p>
          </div>
        </div>

        {/* painel de agendamento: a coisa viva da página */}
        <div className="flex min-h-0 flex-1 flex-col justify-center px-[2em] py-[1.6em] sm:justify-end sm:px-[3em] sm:pb-[2.3em] sm:pt-[2em]">
          <p className="text-[3.9em] sm:text-[4.5em] font-semibold leading-[0.9] tracking-[-0.01em]" style={{ fontFamily: CONDENSADA }}>
            Corte na hora marcada.
          </p>
          <p className="mt-[0.7em] max-w-[26em] text-[1em] leading-[1.45] text-[#4A433B]">
            Corte, barba e sobrancelha em Guarulhos. Escolha o horário aqui e confirme pelo WhatsApp, sem fila.
          </p>

          <div data-ba-interativo className="relative mt-[1.3em] grid grid-cols-3 rounded-[0.3em] bg-[#E3DBCD] p-[0.25em]">
            <span
              className="absolute bottom-[0.25em] left-[0.25em] top-[0.25em] w-[calc((100%-0.5em)/3)] rounded-[0.2em] bg-white transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transform: `translateX(${servico * 100}%)` }}
            />
            {SERVICOS.map((sv, i) => (
              <button
                key={sv.nome}
                type="button"
                tabIndex={tab}
                aria-pressed={servico === i}
                onClick={() => escolherServico(i)}
                className="relative z-[1] rounded-[0.2em] py-[0.45em] text-center leading-tight outline-none transition-colors duration-150 focus-visible:ring-[0.15em] focus-visible:ring-[#C8342A]"
              >
                <span className={`block text-[0.85em] font-semibold ${servico === i ? "text-[#15120E]" : "text-[#5B5249]"}`}>{sv.nome}</span>
                <span className="block text-[0.72em] tabular-nums text-[#6B6257]">R$ {sv.preco}</span>
              </button>
            ))}
          </div>

          <p className="mt-[1.1em] text-[0.8em] font-semibold text-[#4A433B]">Horários livres hoje</p>
          <div data-ba-interativo className="mt-[0.5em] grid grid-cols-6 gap-[0.4em]">
            {HORARIOS.map(({ h, livre }) => {
              const sel = hora === h;
              return (
                <button
                  key={h}
                  type="button"
                  tabIndex={livre ? tab : -1}
                  disabled={!livre}
                  aria-pressed={sel}
                  aria-label={livre ? `Marcar às ${h}` : `${h}, ocupado`}
                  onClick={() => escolherHora(h)}
                  className={`flex h-[2.5em] items-center justify-center gap-[0.25em] rounded-[0.25em] text-[0.9em] font-semibold tabular-nums outline-none transition-[background-color,color,transform] duration-150 ease-out focus-visible:ring-[0.15em] focus-visible:ring-[#C8342A] focus-visible:ring-offset-1 ${
                    !livre
                      ? "cursor-not-allowed text-[#A39A8E] line-through"
                      : sel
                        ? "bb-press bg-[#C8342A] text-white"
                        : "bg-[#E3DBCD] text-[#15120E] hover:bg-[#D8CEBE] active:scale-[0.96]"
                  }`}
                >
                  {sel && enviado && <Check className="h-[1em] w-[1em]" strokeWidth={3} />}
                  {h}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            data-ba-interativo
            tabIndex={hora ? tab : -1}
            aria-disabled={!hora}
            onClick={reservar}
            className={`mt-[1.2em] flex h-[3.1em] items-center justify-center gap-[0.6em] rounded-[0.25em] text-[0.95em] font-semibold outline-none transition-[background-color,color,transform] duration-150 ease-out focus-visible:ring-[0.15em] focus-visible:ring-[#C8342A] focus-visible:ring-offset-2 ${
              hora ? "bg-[#15120E] text-[#F1ECE3] hover:bg-[#2A251F] active:scale-[0.98]" : "cursor-default bg-[#D8CEBE] text-[#5B5249]"
            } ${apertando ? "scale-[0.97]" : ""}`}
          >
            {hora && <WhatsAppIcon className="h-[1.2em] w-[1.2em]" colorido />}
            <span key={`${hora}-${enviado}`} className="bb-swap">
              {!hora ? "Escolha um horário" : enviado ? `Pedido enviado: ${hora}` : `Marcar ${hora} pelo WhatsApp`}
            </span>
          </button>

          <div className="mt-[0.8em] flex flex-wrap items-center justify-between gap-x-[1em] gap-y-[0.3em] text-[0.75em] text-[#5B5249]">
            <span className="tabular-nums">{s.nome} · {s.min} min · R$ {s.preco}</span>
            <span className="flex items-center gap-[0.35em]">
              <span className="flex flex-none gap-[0.08em] text-[#C8342A]">
                {[0, 1, 2, 3, 4].map((k) => <Star key={k} className="h-[1em] w-[1em] fill-current" strokeWidth={0} />)}
              </span>
              4,9 no Google · nota de exemplo
            </span>
          </div>
        </div>
      </div>

      {/* resposta da barbearia chegando no WhatsApp (fictícia, como a barbearia) */}
      <div
        aria-hidden="true"
        className={`bb-toast pointer-events-none absolute left-[2em] right-[2em] top-[5.4em] sm:left-auto sm:right-[2em] sm:top-[5.2em] sm:w-[21em] flex items-center gap-[0.8em] rounded-[0.8em] bg-white p-[0.8em] text-[#15120E] shadow-[0_1.2em_2.4em_-0.8em_rgba(21,18,14,0.45)] ${enviado && hora ? "bb-toast-on" : ""}`}
      >
        <span className="flex h-[2.4em] w-[2.4em] flex-none items-center justify-center rounded-[0.6em] bg-[#25D366]">
          <WhatsAppIcon className="h-[1.4em] w-[1.4em] text-white" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="flex justify-between gap-[1em] text-[0.8em] font-semibold"><span>Barbearia Move</span><span className="font-normal text-[#777]">agora</span></span>
          <span className="mt-[0.2em] block text-[0.78em] text-[#444]">Fechado! {s.nome} hoje às {hora}. Até mais tarde.</span>
        </span>
      </div>
    </div>
  );
}
