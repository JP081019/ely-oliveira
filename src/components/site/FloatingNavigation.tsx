"use client";

import { useEffect, useRef, useState } from "react";
import { SiteIcon, type IconName } from "@/components/ui/SiteIcon";
import { siteConfig } from "@/lib/site-config";

export type NavigationItem = { id: string; label: string; icon: IconName };

export function FloatingNavigation({ items }: { items: NavigationItem[] }) {
  const [active, setActive] = useState("inicio");
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    items.forEach(item => { const section = document.getElementById(item.id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setExpanded(false); trigger.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setExpanded(false); };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
  }, [expanded]);

  return <>
    <nav className="desktop-dock" aria-label="Navegação principal">
      <span className="dock-line" aria-hidden="true" />
      {items.map(item => <a key={item.id} href={item.id === "contato" ? siteConfig.whatsapp : `#${item.id}`} target={item.id === "contato" ? "_blank" : undefined} rel={item.id === "contato" ? "noopener noreferrer" : undefined} data-track={item.id === "contato" ? "whatsapp_click" : undefined} data-location={item.id === "contato" ? "dock" : undefined} className="dock-item" aria-label={item.id === "contato" ? "Conversar com Ely pelo WhatsApp (outra aba)" : item.label} aria-current={active === item.id ? "location" : undefined}><span className="dock-label">{item.label}</span><SiteIcon name={item.icon} size={21} /></a>)}
    </nav>
    <div className="mobile-navigation" ref={root}>
      {expanded ? <nav id="mobile-sections" className="mobile-sections" aria-label="Todas as seções">{items.map(item => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined} onClick={() => setExpanded(false)}><SiteIcon name={item.icon} /><span>{item.label}</span><SiteIcon name="arrow-up-right" size={14} /></a>)}</nav> : null}
      <nav className="mobile-dock" aria-label="Navegação principal no celular">
        <a href="#inicio" aria-current={active === "inicio" ? "location" : undefined}><SiteIcon name="house-door" /><span>Início</span></a>
        <a href="#contato"><SiteIcon name="chat-heart" /><span>Contato</span></a>
        <a className="mobile-talk" href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-location="mobile-dock"><SiteIcon name="whatsapp" /><span>Conversar<span className="sr-only"> pelo WhatsApp (outra aba)</span></span></a>
        <button ref={trigger} type="button" aria-expanded={expanded} aria-controls="mobile-sections" onClick={() => setExpanded(value => !value)}><SiteIcon name={expanded ? "x-lg" : "list"} /><span>{expanded ? "Fechar" : "Seções"}</span></button>
      </nav>
    </div>
  </>;
}
