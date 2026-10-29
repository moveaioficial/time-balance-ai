import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

// Antes e depois da confeitaria no celular (seção "Na prática"). O ar-condicionado só funciona bem no computador,
// então no celular entra a mesma Move Doces da abertura, com as duas versões desenhadas para a tela em pé.
// A confeitaria é fictícia. Fotos: Unsplash (licença gratuita), as mesmas da abertura.

export function AntesCelular() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white" style={{ fontFamily: "Verdana, Arial, sans-serif" }}>
      <div className="flex justify-between bg-[#E75480] px-[4cqw] py-[1.4cqw] text-[3cqw] text-white">
        <span>☎ (11) 0000-0000</span>
        <span>☰ MENU</span>
      </div>
      <div className="px-[4cqw] py-[3cqw] text-center">
        <span className="text-[9cqw] text-[#C71585]" style={{ fontFamily: "'Brush Script MT', 'Comic Sans MS', cursive" }}>Move Doces</span>
      </div>
      <div className="relative mx-[4cqw] flex h-[46cqw] items-center justify-center bg-gradient-to-b from-[#F9C5D5] to-[#F4A3BC] px-[4cqw] text-center">
        <span className="absolute left-[2cqw] text-[7cqw] text-white/80">‹</span>
        <span className="absolute right-[2cqw] text-[7cqw] text-white/80">›</span>
        <div>
          <p className="text-[6.6cqw] font-bold leading-tight text-[#FFE600]" style={{ textShadow: "2px 2px 0 #C71585" }}>OS MELHORES BOLOS DA REGIÃO!!!</p>
          <p className="mt-[2cqw] text-[3.2cqw] text-white">Venha conhecer nossas delícias feitas com muito amor</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[3cqw] px-[4cqw] py-[4cqw]">
        {["BOLOS", "DOCES"].map((t) => (
          <div key={t} className="flex flex-col items-center border border-[#ddd] bg-[#FAFAFA] p-[2cqw]">
            <div className="flex h-[20cqw] w-full items-center justify-center bg-[#E5E5E5] text-[3cqw] text-[#999]">sem imagem</div>
            <p className="mt-[1.6cqw] text-[3.6cqw] font-bold text-[#6A0DAD]">{t}</p>
            <span className="mt-[1.2cqw] bg-[#FF8C00] px-[3cqw] py-[0.8cqw] text-[2.8cqw] font-bold text-white">SAIBA +</span>
          </div>
        ))}
      </div>
      <p className="px-[4cqw] text-[3cqw] leading-snug text-[#666]">
        A Move Doces nasceu de um sonho e hoje é referência em qualidade e sabor. Faça já a sua encomenda! Consulte nossos preços.
      </p>
      {/* pop-up que tapa metade da tela, como em muito site antigo no celular */}
      <div className="absolute left-1/2 top-[30%] w-[80%] -translate-x-1/2 border-[0.8cqw] border-[#FF00AA] bg-[#FFFF66] p-[4cqw] text-center shadow-[1.4cqw_1.4cqw_0_#6A0DAD]" style={{ fontFamily: "'Comic Sans MS', cursive" }}>
        <span className="absolute right-[2cqw] top-[1cqw] text-[4cqw] text-[#999]">✕</span>
        <p className="text-[5.4cqw] font-bold text-[#FF0000]">🎉 PARABÉNS!!! 🎉</p>
        <p className="mt-[1.4cqw] text-[3.4cqw] text-[#333]">Você é o VISITANTE Nº 1.000.000!!! Cadastre seu e-mail e ganhe 5% OFF*</p>
        <span className="mt-[2cqw] inline-block bg-[#00AA00] px-[3cqw] py-[1cqw] text-[3.2cqw] font-bold text-white">QUERO MEU DESCONTO!!!</span>
      </div>
    </div>
  );
}

const produtos = [
  { src: "/img/confeitaria-bolos.webp", t: "Bolos inteiros", d: "Encomenda com 1 dia" },
  { src: "/img/confeitaria-doces.webp", t: "Doces finos", d: "Caixas de 6 a 50" },
];

export function DepoisCelular() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#FBF6F0] text-[#2B1D16]">
      <div className="relative h-[86cqw] overflow-hidden">
        <img src="/img/confeitaria-hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B110C]/95 via-[#1B110C]/50 to-[#1B110C]/30" />
        <div className="relative flex items-center justify-between px-[5cqw] py-[4cqw] text-white">
          <span className="font-accent text-[7cqw] italic leading-none">Move Doces</span>
          <span className="rounded-full bg-white px-[3.4cqw] py-[1.6cqw] text-[3.2cqw] font-semibold text-[#2B1D16]">Encomendar</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-[5cqw] pb-[5cqw] text-white">
          <p className="text-[2.8cqw] font-semibold uppercase tracking-[0.28em] text-[#F2C9A0]">Confeitaria artesanal</p>
          <p className="mt-[1.6cqw] font-accent text-[11cqw] leading-[0.95]">
            Bolo de verdade, feito <span className="italic text-[#F2C9A0]">todo dia.</span>
          </p>
          <div className="mt-[3.6cqw] flex gap-[2cqw]">
            <span className="rounded-full bg-[#F2C9A0] px-[4cqw] py-[2cqw] text-[3.3cqw] font-semibold text-[#2B1D16]">Ver cardápio</span>
            <span className="flex items-center gap-[1.4cqw] rounded-full border border-white/50 px-[4cqw] py-[2cqw] text-[3.3cqw] font-semibold"><WhatsAppIcon className="h-[3.8cqw] w-[3.8cqw]" colorido /> WhatsApp</span>
          </div>
        </div>
      </div>

      {/* sabores correndo */}
      <div className="overflow-hidden whitespace-nowrap bg-[#2B1D16] py-[2cqw] text-[3cqw] font-semibold uppercase tracking-[0.2em] text-[#F2C9A0]">
        <div className="hv-marq inline-block">
          {[0, 1].map((k) => (
            <span key={k}>Pistache ✦ Red velvet ✦ Ninho com morango ✦ Brigadeiro belga ✦ Limão siciliano ✦&nbsp;</span>
          ))}
        </div>
      </div>

      <div className="px-[5cqw] pt-[5cqw]">
        <div className="flex items-end justify-between">
          <p className="font-accent text-[6.4cqw] leading-none">Mais pedidos</p>
          <p className="text-[3cqw] font-semibold text-[#9A5B34]">Ver tudo →</p>
        </div>
        <div className="mt-[3.4cqw] grid grid-cols-2 gap-[3.4cqw]">
          {produtos.map((p) => (
            <div key={p.t}>
              <img src={p.src} alt="" className="aspect-[4/3] w-full rounded-[2.4cqw] object-cover" />
              <p className="mt-[1.6cqw] text-[3.4cqw] font-semibold">{p.t}</p>
              <p className="text-[2.8cqw] text-[#2B1D16]/55">{p.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* pedido chegando no WhatsApp (fictício, como a confeitaria) */}
      <div className="absolute inset-x-[5cqw] top-[22cqw] flex items-center gap-[2.6cqw] rounded-[3cqw] bg-white/95 p-[2.6cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,0.5)]">
        <span className="flex h-[8cqw] w-[8cqw] flex-none items-center justify-center rounded-[2cqw] bg-[#25D366]"><WhatsAppIcon className="h-[4.8cqw] w-[4.8cqw] text-white" /></span>
        <span className="min-w-0 leading-tight">
          <span className="block text-[3cqw] font-semibold text-[#111]">Novo pedido · Move Doces</span>
          <span className="block truncate text-[2.7cqw] text-[#555]">Bolo de pistache para sábado, 15h</span>
        </span>
      </div>
    </div>
  );
}
