import { forwardRef, useId, type Ref } from "react";

// Máquina de cortar cabelo desenhada à mão em SVG, vista de lado, com o pente na ponta direita.
// A altura do desenho é a altura do pente: quem usa posiciona a peça pela ponta.
export const Maquina = forwardRef<HTMLDivElement, { className?: string }>(function Maquina({ className = "" }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", left: 0, top: 0, opacity: 0, pointerEvents: "none", willChange: "transform", transformOrigin: "0 0" }}
    >
      <svg viewBox="0 0 300 120" style={{ display: "block", height: "100%", width: "auto", overflow: "visible" }}>
        <path d="M6 60 C -60 60, -90 90, -170 74 S -300 40, -380 70" fill="none" stroke="#120E0B" strokeWidth="5" strokeLinecap="round" />
        <path d="M6 46 Q6 34 20 32 L170 14 Q200 11 218 11 L236 11 L236 109 L218 109 Q200 109 170 106 L20 88 Q6 86 6 74 Z" fill="#17120E" />
        <path d="M18 42 L168 24 Q196 21 216 21 L216 34 Q196 34 170 37 L18 53 Z" fill="#F0E9DC" opacity=".16" />
        <path d="M96 25 L118 22.5 L118 97.5 L96 95 Z" fill="#F0E9DC" />
        <rect x="140" y="50" width="44" height="20" rx="10" fill="#F0E9DC" />
        <circle cx="172" cy="60" r="7" fill="#17120E" />
        <path d="M236 6 L262 6 Q268 6 268 12 L268 108 Q268 114 262 114 L236 114 Z" fill="#D9D3C6" />
        <rect x="244" y="6" width="5" height="108" fill="#A79F91" />
        {Array.from({ length: 13 }).map((_, i) => (
          <path key={i} d={`M268 ${8 + i * 8} L296 ${10.5 + i * 8} L296 ${12.5 + i * 8} L268 ${14 + i * 8} Z`} fill="#EDE8DC" />
        ))}
      </svg>
    </div>
  );
});

// Poste de barbeiro em SVG. As listras podem ser movidas por fora (rolagem), pelo listrasRef.
export function Poste({ className = "", listrasRef }: { className?: string; listrasRef?: Ref<SVGGElement> }) {
  const id = useId();
  return (
    <svg viewBox="0 0 16 64" className={className} aria-hidden="true">
      <defs>
        <clipPath id={id}><rect x="2" y="6" width="12" height="52" /></clipPath>
      </defs>
      <rect x="2" y="6" width="12" height="52" fill="#F0E9DC" />
      <g clipPath={`url(#${id})`}>
        <g ref={listrasRef}>
          {Array.from({ length: 20 }).map((_, i) => (
            <path key={i} d={`M-2 ${i * 9 - 60} L18 ${i * 9 - 74} L18 ${i * 9 - 70} L-2 ${i * 9 - 56} Z`} fill={i % 2 ? "#16358C" : "#C4291C"} />
          ))}
        </g>
      </g>
      <rect x="0" y="0" width="16" height="7" rx="2" fill="#120E0B" stroke="#F0E9DC" strokeWidth="1" />
      <rect x="0" y="57" width="16" height="7" rx="2" fill="#120E0B" stroke="#F0E9DC" strokeWidth="1" />
    </svg>
  );
}
