import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { WordsMarquee } from "@/components/home/WordsMarquee";
import { Services } from "@/components/home/Services";
import { Method } from "@/components/home/Method";
import { Process } from "@/components/home/Process";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { ForWho } from "@/components/home/ForWho";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <WordsMarquee />
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
