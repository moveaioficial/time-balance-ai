import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useScrollReveal();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
