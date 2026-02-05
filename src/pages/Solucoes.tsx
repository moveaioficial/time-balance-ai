import { Layout } from "@/components/layout/Layout";
import { SolutionsHero } from "@/components/solutions/SolutionsHero";
import { SolutionsGrid } from "@/components/solutions/SolutionsGrid";
import { HowItWorks } from "@/components/solutions/HowItWorks";
import { CTASection } from "@/components/home/CTASection";

const Solucoes = () => {
  return (
    <Layout>
      <SolutionsHero />
      <SolutionsGrid />
      <HowItWorks />
      <CTASection />
    </Layout>
  );
};

export default Solucoes;
