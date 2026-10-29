import { useId } from "react";

// Logo da Move AI (versão nova, A1 com traço 14, escolhida em 29/10/2026), desenhada em SVG.
// Em repouso: "move" branco e "AI" ciano. No hover do link pai (.logo-link), o "move" ganha o degradê da marca correndo.
export function BrandLogo({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="-6 -6 600 186" role="img" aria-label="Move AI" className={`brand-logo w-auto ${className}`}>
      <defs>
        <linearGradient id={`lg${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="0" spreadMethod="repeat">
          <stop offset="0" stopColor="#4DDDE7" />
          <stop offset=".33" stopColor="#A78BFA" />
          <stop offset=".66" stopColor="#58A6FF" />
          <stop offset="1" stopColor="#4DDDE7" />
          <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="-1200 0" dur="2.4s" repeatCount="indefinite" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className="brand-word" style={{ ["--grad" as string]: `url(#lg${id})` }}>
          <path strokeWidth="20" d="M10 110V45A35 35 0 0 1 80 45V110M80 45A35 35 0 0 1 150 45V136A26 26 0 0 0 176 162H196" />
          <g strokeWidth="14">
            <circle cx="216" cy="70" r="40" />
            <path d="M276 30L312 110L348 30" />
            <path d="M370 70H450A40 40 0 1 0 438.3 98.3" />
          </g>
        </g>
        <path stroke="#00C3D0" strokeWidth="14" d="M480 110L514 30L548 110M491.9 82H536.1M574 30V110" />
      </g>
    </svg>
  );
}
