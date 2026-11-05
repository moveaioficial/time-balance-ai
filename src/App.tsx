import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import { ContactModalProvider } from "@/components/ui/ContactModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { TabReturn } from "@/components/TabReturn";
import Index from "./pages/Index";

// Páginas secundárias carregadas sob demanda (reduz o bundle inicial)
const TermosDeUso = lazy(() => import("./pages/TermosDeUso"));
const PoliticaDePrivacidade = lazy(() => import("./pages/PoliticaDePrivacidade"));
const Obrigado = lazy(() => import("./pages/Obrigado"));
const BarbeariaMove = lazy(() => import("./pages/exemplos/BarbeariaMove"));
const NotFound = lazy(() => import("./pages/NotFound"));

// 04/11/2026: saíram Toaster, Sonner, TooltipProvider e QueryClientProvider, que vieram do
// template do Lovable e não eram usados por nenhuma página (só pesavam no JS da abertura).
const App = () => (
  <ContactModalProvider>
    <BrowserRouter>
      <ScrollToTop />
      <TabReturn />
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="/exemplos/barbearia-move" element={<BarbeariaMove />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    <SpeedInsights />
    <Analytics />
  </ContactModalProvider>
);

export default App;
