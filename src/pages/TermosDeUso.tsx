import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

export default function TermosDeUso() {
  usePageTitle("Termos de Uso | Move AI");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última atualização: 23 de outubro de 2026
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar o site e os serviços da Move AI ("Empresa"), você concorda integralmente com estes Termos de Uso. Caso não concorde com alguma disposição, solicitamos que não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Descrição dos Serviços</h2>
            <p>
              A Move AI é um estúdio digital que oferece criação e redesign de sites, identidade visual e marca, design de conteúdo para redes sociais e desenvolvimento de produtos digitais sob medida. Os serviços são prestados conforme acordado em contrato individual com cada cliente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Cadastro e Dados do Usuário</h2>
            <p>
              Para solicitar nossos serviços, o usuário poderá fornecer dados pessoais como nome, e-mail, telefone e empresa por meio dos formulários disponíveis no site. O usuário se compromete a fornecer informações verdadeiras, completas e atualizadas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Uso Aceitável</h2>
            <p>O usuário se compromete a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Utilizar o site e os serviços de forma lícita e ética;</li>
              <li>Não tentar acessar áreas restritas do sistema sem autorização;</li>
              <li>Não reproduzir, distribuir ou modificar o conteúdo do site sem autorização prévia da Move AI;</li>
              <li>Não utilizar os serviços para fins que violem a legislação vigente.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Propriedade Intelectual</h2>
            <p>
              Os textos, o design, a marca e o código deste site são da Move AI ou usados com licença, e são protegidos pela legislação brasileira de direitos autorais e de propriedade intelectual. Algumas fotos e vídeos de exemplo vêm de bancos de imagens gratuitos (Unsplash e Pexels), usados conforme as licenças deles. Os negócios mostrados nos exemplos do site, como a confeitaria e a empresa de climatização, são fictícios.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Contratação, pagamento e cancelamento</h2>
            <p>
              Este site não vende nada direto. Todo serviço é contratado por proposta escrita, que traz o escopo, o prazo, o valor, a forma de pagamento e o que for combinado sobre cancelamento daquele projeto. Nada aqui no site substitui o que estiver na proposta aceita.
            </p>
            <p className="mt-2">
              As informações do site, como prazos e etapas, são gerais. A Move AI não promete resultados de vendas, de alcance ou de posição no Google, porque eles dependem de fatores que fogem do nosso controle.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Limitação de Responsabilidade</h2>
            <p>
              A Move AI se esforça para manter o site e os serviços disponíveis de forma contínua e sem erros. No entanto, não garante disponibilidade ininterrupta e não se responsabiliza por danos indiretos, lucros cessantes ou perda de dados decorrentes do uso ou impossibilidade de uso dos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Modificações dos Termos</h2>
            <p>
              A Move AI reserva-se o direito de alterar estes Termos a qualquer momento. As alterações serão publicadas nesta página com a data de atualização. O uso continuado do site após alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Legislação Aplicável</h2>
            <p>
              Estes Termos são regidos pela legislação da República Federativa do Brasil. Fica eleito o foro da Comarca de Guarulhos, Estado de São Paulo, para dirimir quaisquer controvérsias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contato</h2>
            <p>
              Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail{" "}
              <a href="mailto:moveaioficial@gmail.com" className="text-primary hover:underline">
                moveaioficial@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
