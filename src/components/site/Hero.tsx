import Image from "next/image";
import { heroContent } from "@/content/ely";
import { canDisplay, siteConfig } from "@/lib/site-config";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { ContactLink } from "./ContactLink";

export function Hero({ hasStory }: { hasStory: boolean }) {
  const showDraft = canDisplay(heroContent.status);
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="content-width hero-inner">
        <a className="hero-brand" href="#inicio" aria-label="Ely Oliveira — início">
          <Image src={siteConfig.assets.negativeLogo} width={150} height={133} alt="Ely Oliveira — Terapeuta Emocional" priority />
        </a>
        <div className="hero-composition">
          <div className="hero-copy">
            <p className="hero-kicker"><span className="gold-rule" />Um espaço de acolhimento</p>
            <h1 id="hero-title">{showDraft ? <><span>{heroContent.heading[0]}</span><span className="hero-title-outline">{heroContent.heading[1]}</span></> : <>Ely Oliveira.<br />Terapeuta emocional.</>}</h1>
            <p className="hero-description">{showDraft ? heroContent.description : "Atendimento 100% online. Converse diretamente com Ely e conheça a proposta do atendimento."}</p>
            <ContactLink location="hero" />
            <div className="hero-note"><SiteIcon name="camera-video" size={17} /><span>Atendimento 100% online</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <span className="hero-outline" aria-hidden="true" />
              <div className="hero-photo"><Image src={siteConfig.assets.hero} alt="Ely Oliveira, sorrindo em um ambiente acolhedor" fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 75vw, 44vw" preload quality={85} /></div>
            </div>
            <p className="hero-photo-caption"><span className="caption-line" aria-hidden="true" />Cada história merece<br />um olhar cuidadoso.</p>
            <span className="hero-side-note">Escuta. Presença. Cuidado.</span>
          </div>
        </div>
        <a href={hasStory ? "#sobre" : "#qualificacoes"} className="hero-discover"><span>Permita-se conhecer</span><span className="discover-circle"><SiteIcon name="arrow-down" size={18} /></span></a>
      </div>
    </section>
  );
}
