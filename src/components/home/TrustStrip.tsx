import { SearchCheck, FileCheck2, CalendarCheck, Handshake } from "lucide-react";

// Faixa logo abaixo da abertura: o que a Move AI garante em todo projeto.
// Quando houver clientes, este espaço pode virar a faixa de logos.
const items = [
  { Icon: SearchCheck, title: "Análise gratuita", text: "Olhamos seu site e suas redes antes de qualquer proposta." },
  { Icon: FileCheck2, title: "Preço fechado", text: "Escopo e valor definidos antes de começar." },
  { Icon: CalendarCheck, title: "7 dias de teste", text: "Tempo para conhecer o nosso trabalho na prática." },
  { Icon: Handshake, title: "Fala com quem faz", text: "Você conversa direto com os sócios, sem intermediário." },
];

export function TrustStrip() {
  return (
    <div className="relative border-y border-white/10 bg-[#0C0416]">
      <div className="section-container grid grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text }, i) => (
          <div
            key={title}
            className={`group flex items-start gap-4 py-7 lg:py-9 px-2 sm:px-5 ${i % 2 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t lg:border-t-0 border-white/10" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 text-[#4DDDE7] transition-colors group-hover:bg-[#00C3D0]/15">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-base sm:text-lg font-semibold leading-tight">{title}</p>
              <p className="mt-1 hidden sm:block text-sm leading-snug text-white/55">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
