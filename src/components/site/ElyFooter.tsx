"use client";

import Image from "next/image";
import MeadowRiseFooter from "@/components/ui/meadow-rise-footer";
import { footerContent } from "@/content/ely";
import { siteConfig } from "@/lib/site-config";
import type { NavigationItem } from "./FloatingNavigation";

export function ElyFooter({ items, children, showEditorialCopy }: { items: NavigationItem[]; children: React.ReactNode; showEditorialCopy: boolean }) {
  return <MeadowRiseFooter name={siteConfig.name} phone={siteConfig.phone} brandHref="#inicio" logo={<Image src={siteConfig.assets.negativeLogo} width={190} height={168} alt="Ely Oliveira — Terapeuta Emocional" />} heading={showEditorialCopy ? footerContent.heading : "Converse com Ely Oliveira."} subheading={showEditorialCopy ? footerContent.subheading : "Atendimento 100% online. Entre em contato pelo WhatsApp oficial."} cta={{ label: "Conversar com Ely", href: siteConfig.whatsapp }} tagline={showEditorialCopy ? footerContent.tagline : "Terapeuta Emocional. Atendimento online."} newsletter={false} botanicals={false} columns={[{ title: "Conheça", links: items.filter(item => item.id !== "contato").map(item => ({ label: item.label, href: `#${item.id}` })) }]} socials={[{ icon: "instagram", href: siteConfig.instagram, label: "Instagram da Ely" }, { icon: "facebook", href: siteConfig.facebook, label: "Facebook da Ely" }, { icon: "whatsapp", href: siteConfig.whatsapp, label: "WhatsApp da Ely" }]} legal={[{ label: "Política de Privacidade", href: "/politica-de-privacidade" }, { label: "Preferências de Cookies", onClick: () => document.dispatchEvent(new Event("ely-open-preferences")) }]} copyright={`© ${new Date().getFullYear()} Ely Oliveira. Todos os direitos reservados.`} mist={.28} drift={.35} interactive scrollParallax>{children}</MeadowRiseFooter>;
}
