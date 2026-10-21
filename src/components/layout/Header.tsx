import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/move-ai-logo-branca.png";
import { useContactModal } from "@/components/ui/ContactModal";

const navLinks = [
  { href: "#servicos", label: "Serviços" },
  { href: "#metodo", label: "Método" },
  { href: "#trabalho", label: "Feito por nós" },
  { href: "#processo", label: "Como trabalhamos" },
  { href: "#faq", label: "Dúvidas" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useContactModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || isMenuOpen ? "backdrop-blur-xl bg-[#07040C]/75 border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="section-container">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          <a href="#inicio" onClick={(e) => { e.preventDefault(); go("#inicio"); }} className="flex items-center flex-shrink-0">
            <img src={logo} alt="Move AI" className="h-8 lg:h-9 w-auto" />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); go(link.href); }}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors link-underline"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex">
            <button onClick={openModal} className="btn-gradient">Análise gratuita</button>
          </div>

          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden pb-6 animate-fade-in-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); go(link.href); }}
                  className="font-display text-2xl font-semibold py-3 text-white/85 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <button onClick={() => { setIsMenuOpen(false); openModal(); }} className="btn-gradient w-full mt-4 text-base">
                Análise gratuita
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
