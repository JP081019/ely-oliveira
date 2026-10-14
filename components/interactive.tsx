"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export const whatsapp = "https://wa.me/553197779876?text=" + encodeURIComponent("Olá, Ely! Vim pelo site e gostaria de saber mais sobre a terapia.");
export function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <i className={`bi bi-${name} ${className}`} aria-hidden="true" />;
}
export function ContactLink({ children, className = "", label }: { children: React.ReactNode; className?: string; label?: string }) {
  return <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>{children}</a>;
}
export function Logo({ src, brand }: { src: string | null; brand: "Ely" | "JP Creative" }) {
  return src ? <Image src={src} width={brand === "Ely" ? 1536 : 1774} height={brand === "Ely" ? 1024 : 887} sizes={brand === "Ely" ? "(max-width: 600px) 150px, 190px" : "160px"} alt={brand === "Ely" ? "Ely Oliveira" : "JP Creative"} className={`brand-image ${brand === "Ely" ? "ely-image" : "jp-image"}`} /> : <span className="logo-placeholder">Logo {brand} — inserir arquivo</span>;
}
const nav = [["Início", "inicio"], ["Sobre", "sobre"], ["TRG", "trg"], ["Atendimento", "atendimento"], ["Dúvidas", "duvidas"], ["Contato", "contato"]];

export function Header({ logo }: { logo: string | null }) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const scroll = () => setCompact(window.scrollY > 60);
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    const resize = () => { if (window.innerWidth > 900) dialog.current?.close(); };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  function close() { dialog.current?.close(); }
  return <>
    <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <header className={`header ${compact ? "compact" : ""}`}>
      <a href="#inicio" className="brand" aria-label="Ely Oliveira — início"><Logo src={logo} brand="Ely" /></a>
      <nav className="desktop-nav" aria-label="Navegação principal">{nav.slice(0, 5).map(([text, id]) => <a key={id} href={`#${id}`}>{text}</a>)}</nav>
      <ContactLink className="header-contact">Vamos conversar <Icon name="arrow-up-right" /></ContactLink>
      <button ref={trigger} className="menu-toggle" aria-label="Abrir menu" aria-expanded={open} aria-controls="menu-mobile" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Icon name="list" /></button>
    </header>
    <dialog ref={dialog} id="menu-mobile" className="mobile-menu" aria-label="Menu de navegação" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={(e) => { if (e.target === dialog.current) close(); }}>
      <div className="mobile-menu-inner"><div className="menu-top"><span>Ely Oliveira</span><button aria-label="Fechar menu" onClick={close}><Icon name="x-lg" /></button></div>
        <nav aria-label="Navegação mobile">{nav.map(([text, id]) => <a key={id} href={`#${id}`} onClick={close}>{text}<Icon name="arrow-up-right" /></a>)}</nav>
        <p>Um espaço para se reconectar.</p>
      </div>
    </dialog>
  </>;
}

export function Motion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const pending = new Set<Element>();
    const root = document.documentElement;
    function reset() {
      observer?.disconnect();
      observer = undefined;
      cancelAnimationFrame(frame);
      frame = 0;
      root.classList.remove("motion-ready");
      document.querySelectorAll(".reveal-clip-play").forEach(el => el.classList.remove("reveal-clip-play"));
      pending.forEach(el => el.classList.remove("reveal-pending"));
      pending.clear();
    }
    function reveal(el: Element) {
      if (pending.has(el) && root.classList.contains("motion-ready") && el.getAttribute("data-reveal") === "clip") el.classList.add("reveal-clip-play");
      el.classList.add("is-visible");
      el.classList.remove("reveal-pending");
      pending.delete(el);
      observer?.unobserve(el);
    }
    function checkViewport() {
      frame = 0;
      try {
        // Read geometry before writing classes; also catches fast skipped scrolls.
        const visible = [...pending].filter(el => el.getBoundingClientRect().top < window.innerHeight);
        visible.forEach(reveal);
      } catch { reset(); }
    }
    function scheduleCheck() {
      if (pending.size && !frame) frame = requestAnimationFrame(checkViewport);
    }
    function setup() {
      reset();
      if (preference.matches || !("IntersectionObserver" in window)) return;
      try {
        observer = new IntersectionObserver(entries => {
          try {
            entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
            checkViewport();
            // Only hide registered, offscreen elements after a real observer callback.
            pending.forEach(el => el.classList.add("reveal-pending"));
            root.classList.add("motion-ready");
          } catch { reset(); }
        }, { threshold: 0 });
        document.querySelectorAll("[data-reveal]").forEach(el => {
          if (el.classList.contains("is-visible") || el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
          else { pending.add(el); observer?.observe(el); }
        });
      } catch { reset(); }
    }
    setup(); preference.addEventListener("change", setup);
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);
    return () => {
      reset(); preference.removeEventListener("change", setup);
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
    };
  }, []);
  return null;
}

export const audience = [
  { title: "Traumas", text: "Um espaço de acolhimento para olhar para experiências difíceis e os sentimentos associados a elas." },
  { title: "Ansiedade", text: "Quando a ansiedade ocupa espaço demais, você pode buscar apoio para compreender o que sente." },
  { title: "Síndrome do pânico", text: "Acolhimento para conversar sobre os episódios de pânico e como eles atravessam seu cotidiano." },
  { title: "Depressão", text: "Escuta e apoio emocional para falar sobre o que você está vivendo, respeitando sua história." },
  { title: "Fobia social", text: "Um espaço para falar sobre os sentimentos e dificuldades que surgem nas interações sociais." },
  { title: "Medos", text: "Atenção aos medos e aos padrões emocionais que podem limitar seus movimentos." },
  { title: "Dor emocional", text: "Você não precisa encontrar as palavras certas antes de buscar acolhimento para o que dói." },
  { title: "Relacionamentos", text: "No acompanhamento relacionado à terapia de casal, cada parceiro é atendido individualmente." },
];

export function Audience() {
  const [selected, setSelected] = useState(0);
  return <div className="audience-interactive">
    <div className="audience-list" role="tablist" aria-label="Demandas do acompanhamento">{audience.map((item, i) => <button key={item.title} id={`tema-${i}`} role="tab" aria-selected={selected === i} aria-controls={`tema-painel-${i}`} tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => {
      let next = i;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % audience.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + audience.length) % audience.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = audience.length - 1;
      else return;
      e.preventDefault(); setSelected(next); document.getElementById(`tema-${next}`)?.focus();
    }}>{item.title}<Icon name="arrow-up-right" /></button>)}</div>
    <div className="audience-panels">{audience.map((item, i) => <div key={item.title} role="tabpanel" id={`tema-painel-${i}`} aria-labelledby={`tema-${i}`} hidden={selected !== i} tabIndex={0} className="audience-note"><Icon name="chat-heart" /><h3>{item.title}</h3><p>{item.text}</p><span>Cada história merece ser ouvida.</span></div>)}</div>
  </div>;
}

const questions = [
  ["Como funciona o atendimento online?", "O atendimento é 100% online, para pessoas em todo o Brasil. Escolha um lugar confortável e reservado, com acesso à internet. Os detalhes para participar das sessões são combinados com a Ely."],
  ["Quem pode fazer o acompanhamento?", "Crianças, jovens e adultos. Para menores de 18 anos, é necessária autorização dos responsáveis."],
  ["Como funciona a primeira conversa?", "O primeiro contato acontece pelo WhatsApp, para esclarecer dúvidas e combinar os próximos passos. A triagem/anamnese é uma etapa do processo e tem o valor de R$ 100."],
  ["Como funciona a terapia de casal?", "O acompanhamento informado pela Ely acontece individualmente com cada parceiro. Na primeira conversa, ela explica como esse processo é organizado."],
  ["Como funciona o pagamento?", "A sessão individual custa R$ 300 e a triagem/anamnese, R$ 100. Há pacote com 10% de desconto e possibilidade de 5 + 5 sessões. O cartão pode ser parcelado em até 3x sem juros; acima disso, há juros da operadora/maquininha. Os detalhes do pacote são combinados com a Ely."],
  ["Preciso conhecer TRG antes de começar?", "Não é necessário conhecer a abordagem previamente. Você pode conversar com a Ely, tirar suas dúvidas e entender a proposta do acompanhamento antes de decidir."],
];
export function FAQ() {
  const [active, setActive] = useState<number | null>(null);
  return <div className="faq-list">{questions.map(([question, answer], i) => <div key={question} className={`faq-item ${active === i ? "expanded" : ""}`}><h3><button id={`pergunta-${i}`} aria-expanded={active === i} aria-controls={`resposta-${i}`} onClick={() => setActive(active === i ? null : i)}>{question}<Icon name="plus-lg" /></button></h3><div id={`resposta-${i}`} role="region" aria-labelledby={`pergunta-${i}`} aria-hidden={active !== i} inert={active !== i} className="faq-answer"><div><p>{answer}</p></div></div></div>)}</div>;
}
