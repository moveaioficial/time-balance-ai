import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { usePageTitle } from "@/hooks/use-page-title";
import { INSTAGRAM_URL, PRAZO_RESPOSTA, WHATSAPP_URL } from "@/lib/contato";

/** Página de obrigado: cada visita aqui é um pedido de análise enviado (conversão no Vercel Analytics). */
export default function Obrigado() {
  usePageTitle("Pedido recebido | Move AI");

  // Não deve aparecer no Google
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-16 lg:py-24">
        <Breadcrumbs items={[{ label: "Pedido recebido", to: "/obrigado" }]} />

        <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
        <h1 className="mt-6 text-3xl sm:text-5xl font-bold tracking-[-0.03em]">Recebemos o seu pedido.</h1>
        <p className="mt-5 text-lg text-white/75 leading-relaxed">
          A gente {PRAZO_RESPOSTA}, pelo WhatsApp ou pelo e-mail que você deixou. Se já marcou um horário, o convite está no seu e-mail.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-gradient text-base">
            <WhatsAppIcon className="h-4 w-4" /> Adiantar pelo WhatsApp
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost text-base">
            <Instagram className="h-4 w-4" /> Ver nosso Instagram
          </a>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Enquanto isso: <Link to="/#servicos" className="text-primary hover:underline">o que fazemos</Link>
          {" · "}
          <Link to="/#faq" className="text-primary hover:underline">dúvidas frequentes</Link>
        </p>
      </div>
    </div>
  );
}
