import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { privacyContent } from "@/content/privacy";
import { canDisplay, isReview, siteConfig } from "@/lib/site-config";
import { PreferencesButton } from "@/components/site/CookiePreferences";
import { SiteIcon } from "@/components/ui/SiteIcon";

export const metadata: Metadata = { title: "Política de Privacidade", alternates: { canonical: "/politica-de-privacidade" }, robots: { index: !isReview && privacyContent.status === "approved", follow: true } };

export default function PrivacyPage() {
  return <main id="conteudo" className="privacy-page"><div className="privacy-top content-width"><Link href="/" aria-label="Voltar ao site da Ely"><Image src={siteConfig.assets.negativeLogo} width={150} height={133} alt="Ely Oliveira" /></Link><Link className="text-link" href="/">Voltar ao início<SiteIcon name="arrow-up-right" size={16} /></Link></div><article className="privacy-article"><span className="section-label">Respeito às suas escolhas</span><h1>Política de Privacidade</h1><p className="privacy-date">Versão de {privacyContent.updated}</p>{canDisplay(privacyContent.status) ? <>{privacyContent.sections.map(section=><section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</section>)}<PreferencesButton className="plain-button dark-button" /><p className="policy-sources">Mais informações: <a href="https://policies.google.com/privacy?hl=pt-BR" target="_blank" rel="noopener noreferrer">privacidade do Google</a> e <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">privacidade do Vercel Analytics</a>.</p></> : <p>Para informações sobre privacidade e tratamento de dados, <a href={siteConfig.whatsapp}>converse diretamente com Ely pelo WhatsApp oficial</a>.</p>}</article></main>;
}
