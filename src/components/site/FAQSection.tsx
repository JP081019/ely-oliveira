"use client";

import { useState } from "react";
import { faqContent } from "@/content/ely";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { ContactLink } from "./ContactLink";

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return <section id="perguntas" className="faq-section section-space" aria-labelledby="faq-title"><div className="content-width faq-layout"><div className="faq-heading"><span className="section-label">Podemos conversar</span><h2 id="faq-title">{faqContent.title}</h2><p>{faqContent.introduction}</p><div className="faq-symbol" aria-hidden="true"><SiteIcon name="chat-heart" size={40} /></div></div><div className="faq-list">{faqContent.items.map((item, index) => <div className="faq-item" key={item.question} data-open={open === index}><h3><button id={`question-${index}`} aria-expanded={open === index} aria-controls={`answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span><span className="faq-toggle"><SiteIcon name={open === index ? "dash-lg" : "plus-lg"} size={18} /></span></button></h3><div id={`answer-${index}`} role="region" aria-labelledby={`question-${index}`} hidden={open !== index} className="faq-answer">{item.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div>)}<div className="faq-invitation"><h3>{faqContent.ctaTitle}</h3><p>{faqContent.ctaText}</p><ContactLink location="faq" className="contact-button-light" /></div></div></div></section>;
}
