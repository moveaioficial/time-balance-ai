import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyMoveAI } from "@/components/home/WhyMoveAI";
import { ResultsSection } from "@/components/home/ResultsSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <WhyMoveAI />
      <ResultsSection />
      <ClientsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
