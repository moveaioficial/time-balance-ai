import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Services } from "@/components/home/Services";
import { Method } from "@/components/home/Method";
import { Process } from "@/components/home/Process";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ForWho } from "@/components/home/ForWho";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { useSeo } from "@/hooks/use-page-title";
import { SEO } from "@/lib/seo";

const Index = () => {
  useSeo(SEO.home);
  return (
    <Layout>
      <Hero />
      <TrustStrip />
      <Services />
      <Method />
      <BeforeAfter />
      <ForWho />
      <Process />
      <Faq />
      <FinalCta />
    </Layout>
  );
};

export default Index;
