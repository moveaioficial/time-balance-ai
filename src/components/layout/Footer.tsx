import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import logo from "@/assets/move-ai-logo-branca.png";
import { EMAIL, INSTAGRAM_URL, LINKEDIN_URL, WHATSAPP_URL } from "@/lib/contato";

const sections = [
  { href: "#servicos", label: "Serviços" },
  { href: "#metodo", label: "Método" },
  { href: "#trabalho", label: "Feito por nós" },
  { href: "#processo", label: "Como trabalhamos" },
  { href: "#faq", label: "Dúvidas" },
];

const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });

export function Footer() {
  return (
    <footer className="relative bg-[#07040C] border-t border-white/10">
      <div className="section-container py-16 grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <img src={logo} alt="Move AI" className="h-9 w-auto" />
          <p className="mt-5 max-w-sm text-white/65 leading-relaxed">
            Estúdio digital de site, marca, redes sociais e produto digital para pequenas e médias empresas.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { href: INSTAGRAM_URL, label: "Instagram", Icon: Instagram },
              { href: LINKEDIN_URL, label: "LinkedIn", Icon: Linkedin },
              { href: WHATSAPP_URL, label: "WhatsApp", Icon: MessageCircle },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#00C3D0] hover:text-white"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="kicker">Navegue</p>
          <ul className="mt-5 space-y-3">
            {sections.map((s) => (
              <li key={s.href}>
                <a href={s.href} onClick={(e) => { e.preventDefault(); go(s.href); }} className="text-white/70 hover:text-white transition-colors">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="kicker">Fale com a gente</p>
          <ul className="mt-5 space-y-3 text-white/70">
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="h-4 w-4" /> {EMAIL}
              </a>
            </li>
            <li>Guarulhos, SP</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Move AI. Todos os direitos reservados.</p>
          <div className="flex gap-5">
            <Link to="/termos-de-uso" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/politica-de-privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
