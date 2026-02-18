import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoGradient from "@/assets/logo-gradient.png";

const urgencyMessages = [
  "🔥 3 vagas disponíveis este mês para novos projetos",
  "✅ Economize centenas de horas com automação inteligente",
  "🚀 Primeira entrega em 2-3 dias úteis — sem surpresas",
  "⭐ +50 processos automatizados entregues com sucesso",
];

const navLinks = [
  { href: "#inicio",   label: "Início" },
  { href: "#solucoes", label: "Soluções" },
  { href: "#compare",  label: "Compare" },
  { href: "#processo", label: "Processo" },
  { href: "#casos",    label: "Cases" },
  { href: "#faq",      label: "FAQ" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [fadeMsg, setFadeMsg] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeMsg(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % urgencyMessages.length);
        setFadeMsg(true);
      }, 350);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Top Urgency Bar */}
      <div className="relative z-50 bg-gradient-to-r from-brand-purple via-purple-700 to-brand-blue py-2 px-4 text-center overflow-hidden">
        <p
          className="text-xs sm:text-sm font-medium text-white transition-opacity duration-300"
          style={{ opacity: fadeMsg ? 1 : 0 }}
        >
          {urgencyMessages[msgIndex]}
        </p>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-background/70 border-b border-white/6 shadow-lg shadow-black/20"
            : "backdrop-blur-sm bg-transparent"
        }`}
      >
        <div className="section-container">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); handleNavClick("#inicio"); }}
              className="flex items-center"
            >
              <img src={logoGradient} alt="MoveAI" className="h-10 lg:h-14 w-auto" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors link-underline cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => handleNavClick("#contato")}
                className="btn-gradient text-sm animate-pulse-glow"
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
                    className="text-sm font-medium py-2 px-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-white/6">
                  <button
                    onClick={() => handleNavClick("#contato")}
                    className="btn-gradient w-full text-sm"
                  >
                    Fale com Vendas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
