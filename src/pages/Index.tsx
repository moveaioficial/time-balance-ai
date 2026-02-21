import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ToolsMarquee } from "@/components/home/ToolsMarquee";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { ContactSection } from "@/components/home/ContactSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ToolsMarquee />
      <ServicesSection />
      <ComparisonSection />
      <HowItWorksSection />
      <PortfolioSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </Layout>
  );
};

export default Index;
