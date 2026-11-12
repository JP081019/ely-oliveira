import type { Metadata } from "next";
import { aboutContent, attendanceContent, faqContent, footerContent, qualificationsContent, trgContent } from "@/content/ely";
import { canDisplay, siteConfig } from "@/lib/site-config";
import { Hero } from "@/components/site/Hero";
import { AboutEly } from "@/components/site/AboutEly";
import { TRGExperience } from "@/components/site/TRGExperience";
import { AttendanceSection } from "@/components/site/AttendanceSection";
import { QualificationsSection } from "@/components/site/QualificationsSection";
import { FAQSection } from "@/components/site/FAQSection";
import { FloatingNavigation, type NavigationItem } from "@/components/site/FloatingNavigation";
import { ElyFooter } from "@/components/site/ElyFooter";
import { JPCreativeSignature } from "@/components/site/JPCreativeSignature";
import { MotionOrchestrator } from "@/components/site/MotionOrchestrator";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const story = canDisplay(aboutContent.status), trg = canDisplay(trgContent.status), attendance = canDisplay(attendanceContent.status), qualifications = canDisplay(qualificationsContent.status), faq = canDisplay(faqContent.status);
  const items: NavigationItem[] = [
    { id: "inicio", label: "Início", icon: "house-door" },
    ...(story ? [{ id: "sobre", label: "Sobre Ely", icon: "person-heart" } as const] : []),
    ...(trg ? [{ id: "trg", label: "TRG", icon: "diagram-3" } as const] : []),
    ...(attendance ? [{ id: "atendimento", label: "Atendimento", icon: "chat-heart" } as const] : []),
    ...(qualifications ? [{ id: "qualificacoes", label: "Qualificações", icon: "mortarboard" } as const] : []),
    ...(faq ? [{ id: "perguntas", label: "Dúvidas", icon: "patch-question" } as const] : []),
    { id: "contato", label: "Contato", icon: "whatsapp" },
  ];
  const schema = { "@context": "https://schema.org", "@type": "Person", name: siteConfig.name, jobTitle: siteConfig.profession, url: siteConfig.url, sameAs: [siteConfig.instagram, siteConfig.facebook] };
  return <><FloatingNavigation items={items} /><main id="conteudo"><Hero hasStory={story} />{story ? <AboutEly /> : null}{trg ? <TRGExperience hasAttendance={attendance} /> : null}{attendance ? <AttendanceSection /> : null}{qualifications ? <QualificationsSection /> : null}{faq ? <FAQSection /> : null}</main><ElyFooter items={items} showEditorialCopy={canDisplay(footerContent.status)}><div className="signature-row"><span>Com acolhimento, Ely Oliveira.</span><JPCreativeSignature /></div></ElyFooter><MotionOrchestrator /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></>;
}
