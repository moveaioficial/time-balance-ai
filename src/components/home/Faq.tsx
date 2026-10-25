import { Plus } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { WHATSAPP_URL } from "@/lib/contato";

const faqs = [
  {
    q: "Quanto custa?",
    a: "Depende do escopo. Depois da análise gratuita, você recebe uma proposta com valor fechado, para saber exatamente o que está contratando.",
  },
  {
    q: "Quanto tempo leva?",
    a: "O prazo vai por escrito na proposta, junto com o escopo. Uma landing page sai bem mais rápido que um site completo com marca nova, e a gente te diz isso logo no começo.",
  },
  {
    q: "Como funcionam os 3 dias de teste?",
    a: "É o seu período para conhecer o nosso jeito de trabalhar antes de seguir com a gente. Os detalhes entram na proposta, por escrito.",
  },
  {
    q: "Já tenho site e logo. Vocês fazem redesign?",
    a: "Fazemos. Dá para partir do que você já tem e melhorar, ou começar do zero. A análise gratuita ajuda a decidir o que vale mais a pena.",
  },
  {
    q: "Preciso entender de tecnologia?",
    a: "Não. A gente explica tudo sem jargão e cuida da parte técnica, como domínio, hospedagem e publicação.",
  },
];

// FAQPage: as perguntas viram resposta citável no Google e nas IAs
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export function Faq() {
  return (
    <section id="faq" className="relative bg-[#0C0416] py-24 lg:py-32 border-t border-white/10">
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <div className="section-container grid lg:grid-cols-[0.8fr_1.2fr] gap-14">
        <div className="reveal">
          <p className="kicker">Dúvidas</p>
          <h2 className="mt-5 text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
            Perguntas que a gente <span className="accent-word">sempre</span> ouve.
          </h2>
          <p className="mt-5 text-white/70">Não achou a sua? Manda no{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#25D366]">
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />WhatsApp
            </a>{" "}
            que a gente responde.</p>
          <p className="mt-3 text-white/70">
            Quer ver as etapas? Está em <a href="#processo" className="text-[#00C3D0] hover:underline">como trabalhamos</a>. E tem um exemplo real em{" "}
            <a href="#na-pratica" className="text-[#00C3D0] hover:underline">na prática</a>.
          </p>
        </div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group reveal py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-display text-xl font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-5 w-5 flex-none text-[#00C3D0] transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
