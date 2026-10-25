import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const SITE = "https://www.moveai.tech";

interface Crumb {
  label: string;
  to: string;
}

/** Trilha "Início › Página" visível e em BreadcrumbList (JSON-LD) para o Google. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Início", to: "/" }, ...items];
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE}${c.to}`,
    })),
  };

  return (
    <nav aria-label="Você está em" className="mb-10 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={c.to} className="inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-foreground">{c.label}</span>
              ) : (
                <Link to={c.to} className="hover:text-foreground transition-colors">{c.label}</Link>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </nav>
  );
}
