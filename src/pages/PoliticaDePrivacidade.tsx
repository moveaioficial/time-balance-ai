import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

export default function PoliticaDePrivacidade() {
  usePageTitle("Política de Privacidade | Move AI");
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
          Última atualização: 23 de outubro de 2026
        </p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Quem somos</h2>
            <p>
              A Move AI é um estúdio digital de Guarulhos, SP, que cria sites, marcas, conteúdo para redes sociais e produtos digitais. Nesta política, "Move AI", "nós" e "a gente" se referem ao estúdio, responsável pelos dados pessoais tratados neste site, nos termos da Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018). A Move AI ainda não tem CNPJ; por enquanto, quem responde pelos dados são os sócios do estúdio.
            </p>
            <p className="mt-2">
              Contato para qualquer assunto de privacidade e dados pessoais:{" "}
              <a href="mailto:moveaioficial@gmail.com" className="text-primary hover:underline">moveaioficial@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Que dados coletamos</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-foreground">No formulário de contato:</strong> nome, empresa, e-mail, WhatsApp e a descrição do que você precisa. Só pedimos o necessário para responder ao seu pedido.</li>
              <li><strong className="text-foreground">No WhatsApp ou no e-mail:</strong> o que você escolher nos enviar na conversa.</li>
              <li><strong className="text-foreground">Na navegação:</strong> estatísticas de visita agregadas e anônimas (páginas vistas, país, tipo de aparelho e tempo de carregamento), sem identificar você e sem cookies.</li>
            </ul>
            <p className="mt-2">Não pedimos dados sensíveis, como saúde, religião ou opinião política, e não coletamos dados de menores de idade de propósito.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Para que usamos e com qual base legal</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-foreground">Responder ao seu contato e preparar uma análise ou proposta:</strong> com base no seu consentimento, dado no formulário, e nos procedimentos preliminares de um contrato que você pediu (art. 7º, I e V, da LGPD).</li>
              <li><strong className="text-foreground">Prestar o serviço contratado:</strong> para executar o contrato (art. 7º, V).</li>
              <li><strong className="text-foreground">Melhorar o site:</strong> com as estatísticas anônimas de visita, que não identificam ninguém.</li>
              <li><strong className="text-foreground">Cumprir obrigações legais:</strong> quando a lei exigir (art. 7º, II).</li>
            </ul>
            <p className="mt-2">Só enviamos novidades ou conteúdo por e-mail ou WhatsApp se você pedir.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Com quem os dados são compartilhados</h2>
            <p>Não vendemos nem alugamos dados pessoais. Para o site funcionar, usamos estes fornecedores, que tratam os dados em nosso nome:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong className="text-foreground">Supabase:</strong> banco de dados onde ficam as mensagens do formulário.</li>
              <li><strong className="text-foreground">Vercel:</strong> hospedagem do site e estatísticas anônimas de visita.</li>
              <li><strong className="text-foreground">Google Fonts:</strong> entrega as fontes do site, o que faz o seu navegador se conectar aos servidores do Google.</li>
              <li><strong className="text-foreground">WhatsApp (Meta) e Gmail (Google):</strong> quando você fala com a gente por esses canais.</li>
            </ul>
            <p className="mt-2">
              Esses fornecedores podem guardar dados em servidores fora do Brasil. Nesses casos, a transferência segue as garantias da LGPD (art. 33), como as cláusulas contratuais dos próprios fornecedores. Também podemos compartilhar dados quando uma autoridade exigir por lei.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cookies</h2>
            <p>
              Este site não usa cookies de publicidade nem de rastreamento. As estatísticas de visita funcionam sem cookies. Se um dia passarmos a usar cookies que não sejam essenciais, vamos pedir a sua permissão antes, com um aviso no site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Por quanto tempo guardamos</h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Contatos que não viraram projeto: até 12 meses depois da última conversa. Depois disso, apagamos.</li>
              <li>Se virar cliente: pelo tempo do contrato e, depois, pelo prazo que a lei exigir para documentos fiscais e contratuais.</li>
              <li>Se você pedir a exclusão antes, apagamos, salvo quando a lei obrigar a manter.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Segurança</h2>
            <p>
              O site usa conexão segura (HTTPS), o banco de dados tem acesso restrito e o formulário tem proteção contra spam. Nenhum sistema é 100% imune, mas adotamos medidas técnicas e administrativas razoáveis para proteger os seus dados e avisaremos você e a ANPD em caso de incidente relevante, como a lei manda.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Os seus direitos</h2>
            <p>Pela LGPD (art. 18), você pode pedir a qualquer momento:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>a confirmação de que tratamos os seus dados e o acesso a eles;</li>
              <li>a correção de dados incompletos ou errados;</li>
              <li>a exclusão dos dados tratados com o seu consentimento;</li>
              <li>a revogação do consentimento;</li>
              <li>a portabilidade e a informação sobre com quem os dados foram compartilhados.</li>
            </ul>
            <p className="mt-2">
              É só escrever para{" "}
              <a href="mailto:moveaioficial@gmail.com" className="text-primary hover:underline">moveaioficial@gmail.com</a>. Confirmamos o recebimento assim que lermos e respondemos por completo em até 15 dias. Você também pode reclamar na Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Mudanças nesta política</h2>
            <p>
              Quando esta política mudar, a nova versão fica nesta página com a data atualizada no topo.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
