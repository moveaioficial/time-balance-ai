import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PoliticaDePrivacidade() {
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

        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última atualização: 10 de abril de 2026
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Introdução</h2>
            <p>
              A Move AI ("Empresa"), com sede em Guarulhos, SP, respeita a privacidade de seus usuários e está comprometida com a proteção de seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Dados Coletados</h2>
            <p>Podemos coletar os seguintes dados pessoais:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-foreground">Dados de identificação:</strong> nome, e-mail, telefone (WhatsApp) e empresa;</li>
              <li><strong className="text-foreground">Dados de uso:</strong> informações sobre navegação no site, como páginas visitadas, tempo de permanência e dispositivo utilizado;</li>
              <li><strong className="text-foreground">Dados de comunicação:</strong> mensagens enviadas por formulários de contato, e-mail ou WhatsApp.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Finalidade do Tratamento</h2>
            <p>Os dados pessoais coletados são utilizados para:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Responder solicitações de contato e propostas comerciais;</li>
              <li>Qualificar leads e personalizar a comunicação;</li>
              <li>Prestar e melhorar nossos serviços de automação e IA;</li>
              <li>Enviar comunicações relevantes sobre nossos serviços (com consentimento);</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Compartilhamento de Dados</h2>
            <p>
              A Move AI não vende, aluga ou compartilha dados pessoais com terceiros para fins de marketing. Os dados podem ser compartilhados apenas com prestadores de serviço essenciais (como provedores de hospedagem e CRM), sempre sob obrigação de confidencialidade, ou quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Armazenamento e Segurança</h2>
            <p>
              Os dados são armazenados em servidores seguros com criptografia e acesso restrito. Adotamos medidas técnicas e administrativas adequadas para proteger os dados contra acesso não autorizado, perda, alteração ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Direitos do Titular</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Acessar seus dados pessoais;</li>
              <li>Solicitar correção de dados incompletos ou desatualizados;</li>
              <li>Solicitar a exclusão de seus dados pessoais;</li>
              <li>Revogar consentimento a qualquer momento;</li>
              <li>Solicitar portabilidade dos dados.</li>
            </ul>
            <p className="mt-2">
              Para exercer esses direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@moveai.com.br" className="text-primary hover:underline">
                contato@moveai.com.br
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Cookies</h2>
            <p>
              O site pode utilizar cookies e tecnologias similares para melhorar a experiência de navegação e coletar dados analíticos. O usuário pode configurar seu navegador para bloquear cookies, embora isso possa afetar a funcionalidade do site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Retenção de Dados</h2>
            <p>
              Os dados pessoais são mantidos pelo tempo necessário para cumprir as finalidades para as quais foram coletados, ou conforme exigido por obrigações legais. Após esse período, os dados são eliminados de forma segura.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Alterações nesta Política</h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente. As alterações serão publicadas nesta página com a data de atualização. Recomendamos que consulte esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contato</h2>
            <p>
              Para dúvidas, solicitações ou reclamações sobre o tratamento de dados pessoais, entre em contato pelo e-mail{" "}
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
