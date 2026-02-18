import { Link } from "react-router-dom";
import logoGradient from "@/assets/logo-gradient.png";

const footerLinks = {
  solucoes: [
    { label: "Automação de Atendimento", href: "#solucoes" },
    { label: "Geração de Leads", href: "#solucoes" },
    { label: "Análise de Dados", href: "#solucoes" },
    { label: "CRM com IA", href: "#solucoes" },
  ],
  empresa: [
    { label: "Sobre nós", href: "#sobre" },
    { label: "Como Funciona", href: "#processo" },
    { label: "Cases de Sucesso", href: "#casos" },
    { label: "FAQ", href: "#faq" },
  ],
  contato: [
    { label: "Fale com Vendas", href: "#contato" },
    { label: "WhatsApp", href: "https://wa.me/5511999999999" },
    { label: "Email", href: "mailto:contato@moveai.com.br" },
  ],
};

const handleAnchor = (href: string) => {
  if (href.startsWith("#")) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
};

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/6">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="#inicio" onClick={(e) => { e.preventDefault(); handleAnchor("#inicio"); }}>
              <img src={logoGradient} alt="MoveAI" className="h-14 w-auto mb-6" />
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Tornamos a tecnologia mais humana, acessível e útil. Libertamos pessoas do trabalho operacional para que foquem em pensar, criar e decidir.
            </p>
            <div className="flex gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/6 hover:bg-primary/20 border border-white/8 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-muted-foreground"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/6 hover:bg-primary/20 border border-white/8 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-muted-foreground"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Soluções */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Soluções</h4>
            <ul className="space-y-3">
              {footerLinks.solucoes.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleAnchor(link.href); }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleAnchor(link.href); }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3">
              {footerLinks.contato.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={link.href.startsWith("#") ? (e) => { e.preventDefault(); handleAnchor(link.href); } : undefined}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 MoveAI. Tornando a tecnologia mais humana.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
