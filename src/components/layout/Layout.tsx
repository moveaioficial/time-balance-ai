import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MobileCta } from "@/components/ui/MobileCta";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useScrollReveal();

  return (
    <div className="flex flex-col min-h-screen">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#0C0416]"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileCta />
      <WhatsAppButton />
    </div>
  );
}
