import logo from "@/assets/move-ai-logo-branca.png";

// Logo oficial (PNG branco) usada como máscara: em repouso fica branca,
// no hover do link pai (.logo-link) ganha o degradê da marca correndo.
export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Move AI"
      className={`logo-mask ${className}`}
      style={{ ["--logo" as string]: `url(${logo})` }}
    />
  );
}
