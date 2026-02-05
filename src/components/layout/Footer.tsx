import { Link } from "react-router-dom";
import { Linkedin, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoFullWhite from "@/assets/logo-full-white.png";

const footerLinks = {
  produto: [
    { label: "Soluções", href: "/solucoes" },
    { label: "Pricing", href: "/pricing" },
    { label: "Casos de Sucesso", href: "/casos" },
  ],
  empresa: [
    { label: "Sobre", href: "/sobre" },
    { label: "Blog", href: "/blog" },
    { label: "Trabalhe Conosco", href: "/carreiras" },
  ],
  suporte: [
    { label: "FAQ", href: "/faq" },
    { label: "Documentação", href: "/docs" },
    { label: "Contato", href: "/contato" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/">
              <img src={logoFullWhite} alt="MoveAI" className="h-8 mb-6" />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6 max-w-xs">
              Devolvemos tempo e equilíbrio ao mundo corporativo através de automação inteligente com IA.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Receba novidades</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Seu email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button variant="secondary" size="sm">
                  Enviar
                </Button>
              </div>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-3">
              {footerLinks.produto.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-background/60">
            <Link to="/termos" className="hover:text-background transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-background transition-colors">
              Política de Privacidade
            </Link>
          </div>

          <p className="text-xs text-background/60">
            © 2026 MoveAI. Devolvemos tempo ao mundo corporativo.
          </p>
        </div>
      </div>
    </footer>
  );
}
