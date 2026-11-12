export const siteConfig = {
  name: "Ely Oliveira",
  profession: "Terapeuta Emocional",
  url: "https://www.terapiaely.com.br",
  whatsapp: "https://wa.me/5531997779876",
  phone: "+55 31 99777-9876",
  instagram: "https://www.instagram.com/terapeutaelyoliveira/",
  facebook: "https://www.facebook.com/1224991564040514",
  agency: "https://jpcreative.com.br",
  title: "Ely Oliveira | Terapeuta Emocional — Atendimento Online",
  description: "Conheça Ely Oliveira, terapeuta emocional com atendimento online. Saiba mais sobre a TRG, sua trajetória e como entrar em contato.",
  assets: {
    horizontalLogo: "/Logo%20Ely%20Oliveira/Ely_02_Logo_Horizontal.svg",
    logo: "/Logo%20Ely%20Oliveira/Ely_Oliveira_Conceito03_Logo_Principal.svg",
    negativeLogo: "/Logo%20Ely%20Oliveira/Ely_04_Negativa_Principal.svg",
    symbol: "/Logo%20Ely%20Oliveira/Ely_03_Simbolo_Isolado.svg",
    hero: "/Imagens/hero.png",
    about: "/Imagens/sobre.png",
    agency: "/Logo%20Footer%20JP%20Creative/Logotipo%20JP%20Minimalista%20em%20Fundo%20Escuro.png",
  },
} as const;

export type ContentStatus = "pending" | "draft" | "approved";
export const isReview = process.env.CONTENT_REVIEW === "true";
export function canDisplay(status: ContentStatus) {
  return status === "approved" || (isReview && status === "draft");
}
