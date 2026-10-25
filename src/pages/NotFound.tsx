import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useContactModal } from "@/components/ui/ContactModal";
import { WHATSAPP_URL } from "@/lib/contato";

// Link quebrado não pode ser beco sem saída: a 404 leva para as partes principais do site
const atalhos = [
  { to: "/#servicos", label: "O que fazemos", desc: "site, marca, redes e produto digital" },
  { to: "/#na-pratica", label: "Na prática", desc: "o antes e depois de um site" },
  { to: "/#processo", label: "Como trabalhamos", desc: "as etapas, do pedido à entrega" },
  { to: "/#faq", label: "Dúvidas", desc: "preço, prazo e teste de 3 dias" },
];

const NotFound = () => {
  const { openModal } = useContactModal();

  useEffect(() => {
    document.title = "Página não encontrada | Move AI";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.title = "Move AI";
      meta.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <p className="font-display text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-[-0.03em]">Essa página saiu do lugar.</h1>
        <p className="mt-5 text-lg text-white/75 leading-relaxed">
          O link pode estar antigo ou com um erro de digitação. Escolha um caminho abaixo ou fale direto com a gente.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {atalhos.map((a) => (
            <li key={a.to}>
              <Link
                to={a.to}
                className="group flex h-full items-center justify-between gap-4 rounded-xl border border-white/10 px-5 py-4 transition-colors hover:border-[#00C3D0]"
              >
                <span>
                  <span className="block font-semibold text-foreground">{a.label}</span>
                  <span className="block text-sm text-muted-foreground">{a.desc}</span>
                </span>
                <ArrowRight className="h-4 w-4 flex-none text-[#00C3D0] transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button onClick={openModal} className="btn-gradient text-base">
            Quero minha análise gratuita <ArrowRight className="h-4 w-4" />
          </button>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
            <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
          </a>
        </div>

        <Link to="/" className="mt-10 inline-block text-sm text-muted-foreground hover:text-foreground">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
