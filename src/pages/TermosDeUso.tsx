import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermosDeUso() {
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
          Ultima atualização: 10 de abril de 2026
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
              A Move AI oferece serviços de automação com inteligência artificial, incluindo automação de atendimento, geração de leads, análise de dados, integração de sistemas, criação e redesign de sites, e consultoria em IA. Os serviços são prestados conforme acordado em contrato individual com cada cliente.
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
              Todo o conteúdo do site — incluindo textos, imagens, logotipos, design, código-fonte e materiais gráficos — é de propriedade da Move AI ou de seus licenciadores, protegido pela legislação brasileira de propriedade intelectual e direitos autorais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Limitação de Responsabilidade</h2>
            <p>
              A Move AI se esforça para manter o site e os serviços disponíveis de forma contínua e sem erros. No entanto, não garante disponibilidade ininterrupta e não se responsabiliza por danos indiretos, lucros cessantes ou perda de dados decorrentes do uso ou impossibilidade de uso dos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Modificações dos Termos</h2>
            <p>
              A Move AI reserva-se o direito de alterar estes Termos a qualquer momento. As alterações serão publicadas nesta página com a data de atualização. O uso continuado do site após alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Legislação Aplicável</h2>
            <p>
              Estes Termos são regidos pela legislação da República Federativa do Brasil. Fica eleito o foro da Comarca de Guarulhos, Estado de São Paulo, para dirimir quaisquer controvérsias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Contato</h2>
            <p>
              Em caso de dúvidas sobre estes Termos, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@moveai.com.br" className="text-primary hover:underline">
                contato@moveai.com.br
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
