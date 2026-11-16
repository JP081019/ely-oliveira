import Image from "next/image";
import { aboutContent } from "@/content/ely";
import { siteConfig } from "@/lib/site-config";
import { StoryContinuation } from "./StoryContinuation";

export function AboutEly() {
  return (
    <section id="sobre" className="about-section section-space" data-chapter aria-labelledby="about-title">
      <div className="content-width about-layout">
        <div className="about-portrait-column">
          <span className="section-label">Conheça Ely</span>
          <figure className="about-portrait">
            <div className="about-photo"><Image src={siteConfig.assets.about} alt="Retrato de Ely Oliveira, terapeuta emocional" fill sizes="(max-width: 700px) 85vw, 36vw" quality={80} /></div>
            <figcaption><span>Ely Oliveira</span><span>Terapeuta Emocional</span></figcaption>
          </figure>
          <p className="portrait-note">Uma trajetória de amor,<br />fé e novos caminhos.</p>
          <span className="portrait-gold-line" aria-hidden="true" />
        </div>
        <div className="about-copy">
          <h2 id="about-title">{aboutContent.title}</h2>
          <p className="story-introduction"><strong>{aboutContent.introduction}</strong></p>
          {aboutContent.opening.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <StoryContinuation>
            {aboutContent.continuation.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <blockquote>{aboutContent.quote}</blockquote>
            {aboutContent.closing.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <p><strong>{aboutContent.finalEmphasis}</strong></p>
            <p>{aboutContent.blessing}</p>
            <p className="story-signature">Ely Oliveira</p>
          </StoryContinuation>
        </div>
      </div>
      <span className="chapter-thread" aria-hidden="true" />
    </section>
  );
}
