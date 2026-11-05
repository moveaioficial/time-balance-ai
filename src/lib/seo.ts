// Título, descrição e indexação de cada página do site.
// É a fonte única: o hook useSeo usa estes dados no navegador, e o vite.config.ts
// gera no build um HTML por rota já com eles (o Google e as redes leem sem rodar JS).
// Título: até 60 caracteres. Descrição: até 155.

export const SITE_URL = "https://www.moveai.tech";

export interface PageSeo {
  path: string;
  title: string;
  description: string;
  /** true = fora do Google (página de obrigado e 404) */
  noindex?: boolean;
}

export const SEO: Record<string, PageSeo> = {
  home: {
    path: "/",
    title: "Site, marca e redes para empresas em Guarulhos | Move AI",
    description:
      "Estúdio digital de Guarulhos que cuida do site, da marca e das redes da sua empresa. Peça uma análise gratuita da sua presença digital.",
  },
  termos: {
    path: "/termos-de-uso",
    title: "Termos de uso do site | Move AI",
    description:
      "Regras de uso do site da Move AI: o que oferecemos, como funciona a contratação por proposta, propriedade intelectual e foro.",
  },
  privacidade: {
    path: "/politica-de-privacidade",
    title: "Política de privacidade | Move AI",
    description:
      "Quais dados a Move AI coleta no site e no formulário, para que usa, com quem compartilha, por quanto tempo guarda e como pedir para apagar.",
  },
  obrigado: {
    path: "/obrigado",
    title: "Pedido recebido | Move AI",
    description: "Recebemos o seu pedido de análise gratuita. A Move AI responde pelo WhatsApp ou pelo e-mail que você deixou.",
    noindex: true,
  },
  naoEncontrada: {
    path: "/404",
    title: "Página não encontrada | Move AI",
    description: "Essa página não existe mais ou o link veio com erro. Veja os serviços da Move AI ou fale com a gente.",
    noindex: true,
  },
};

export const canonicalUrl = (path: string) => (path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`);
