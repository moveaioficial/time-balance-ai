const words = ["Sites", "Identidade visual", "Redes sociais", "Landing pages", "Redesign", "Produto digital", "Carrosséis", "Guia de marca"];

export function WordsMarquee() {
  const row = [...words, ...words];
  return (
    <div className="relative border-y border-white/10 bg-[#0C0416] py-6 overflow-hidden" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-3xl sm:text-5xl font-semibold tracking-tight whitespace-nowrap">
            <span className={i % 2 ? "outline-text" : "text-white/90"}>{w}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C3D0]" />
          </span>
        ))}
      </div>
    </div>
  );
}
