// Frases que o dono de empresa diz antes de procurar a gente. Duas fileiras em sentidos opostos.
const top = [
  "Meu site parece de 2012.",
  "Ninguém entende o que eu vendo.",
  "Tenho vergonha de mandar o link.",
  "Meu Instagram está parado faz meses.",
];
const bottom = [
  "Cada post sai de um jeito.",
  "A logo foi feita às pressas.",
  "O cliente pede o site e eu mando o WhatsApp.",
  "Pelo celular, meu site quebra.",
];

function Row({ items, reverse = false, dim = false }: { items: string[]; reverse?: boolean; dim?: boolean }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className={`flex w-max gap-12 ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}>
      {row.map((t, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className={`font-accent italic text-3xl sm:text-5xl ${dim ? "text-white/35" : "text-white/90"}`}>“{t}”</span>
          <span className="h-2 w-2 rounded-full bg-[#00C3D0]" />
        </span>
      ))}
    </div>
  );
}

export function WordsMarquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[#0C0416] py-8">
      <p className="kicker justify-center w-full mb-6">Soa familiar?</p>
      <div className="space-y-4" aria-hidden="true">
        <Row items={top} />
        <Row items={bottom} reverse dim />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-[#0C0416] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-[#0C0416] to-transparent" />
    </div>
  );
}
