import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import moveaiWordmark from "@/assets/moveai-wordmark.png";

const navLinks = [
  { href: "#inicio",   label: "Início" },
  { href: "#solucoes", label: "Soluções" },
  { href: "#casos",    label: "Cases" },
  { href: "#faq",      label: "FAQ" },
  { href: "#contato",  label: "Contato" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-white/6 shadow-lg shadow-black/20"
          : "backdrop-blur-sm bg-transparent"
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => { e.preventDefault(); handleNavClick("#inicio"); }}
            className="flex items-center flex-shrink-0"
          >
            <img
              src={moveaiWordmark}
              alt="MoveAI"
              className="h-14 lg:h-16 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors link-underline cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => handleNavClick("#contato")}
              className="btn-gradient text-base"
            >
              Fale com Vendas
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/6 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-base font-medium py-2 px-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-white/6">
                <button
                  onClick={() => handleNavClick("#contato")}
                  className="btn-gradient w-full text-base"
                >
                  Fale com Vendas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
