"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Icon } from "./interactive";

const certificates = [
  { image: "/images/certificado-trg-ely.jpeg", width: 670, height: 465, title: "Certificação Internacional em TRG", description: "Terapeuta Especializado em Terapia de Reprocessamento Generativo (TRG).", issuer: "Instituto Brasileiro de Formação de Terapeutas (IBFT) e Instituto Europeu de Terapia de Reprocessamento Generativo (IETRG)", hours: "360 horas", date: "09/10/2026", isoDate: "2026-10-09", note: "O documento informa validade provisória de 12 meses a partir da emissão." },
  { image: "/images/certificado-2.jpeg", width: 1600, height: 1130, title: "Aperfeiçoamento em Psicologia Clínica", description: "Curso de aperfeiçoamento em Psicologia Clínica.", issuer: "Instituto de Ensino e Mentorias do Brasil", hours: "180 horas", date: "21/10/2026", isoDate: "2026-10-21", note: null },
  { image: "/images/certificado-3.jpeg", width: 1600, height: 1130, title: "Aperfeiçoamento em Psicologia Forense", description: "Curso de aperfeiçoamento em Psicologia Forense.", issuer: "Instituto de Ensino e Mentorias do Brasil", hours: "180 horas", date: "24/10/2026", isoDate: "2026-10-24", note: null },
];

export function Certification() {
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const lock = useRef<{ body: string; html: string } | null>(null);
  const active = certificates[selected];
  function restore() {
    if (!lock.current) return;
    document.body.style.overflow = lock.current.body;
    document.documentElement.style.overflow = lock.current.html;
    lock.current = null;
  }
  useEffect(() => () => restore(), []);
  function open(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (!dialog.current?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    trigger.current = event.currentTarget;
    setSelected(index);
    dialog.current.showModal();
    event.preventDefault();
    lock.current = { body: document.body.style.overflow, html: document.documentElement.style.overflow };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
  return <section className="certification section-pad" id="certificacao" aria-labelledby="certification-title">
    <div className="certification-copy" data-reveal>
      <div className="section-label"><span className="small-line" /> Formação e certificações</div>
      <h2 id="certification-title">O conhecimento também<br />faz parte do <em>cuidado.</em></h2>
      <p>A formação profissional é parte essencial de uma atuação responsável. Conheça as certificações que integram a trajetória de Ely Oliveira e seu compromisso com o aprimoramento profissional.</p>
      <p className="certification-context">Documentos de Ely Maria Barbosa de Oliveira. Os cursos de aperfeiçoamento apresentados não equivalem a uma graduação em Psicologia ou a registro no CRP.</p>
    </div>
    <div className="certificates-grid">{certificates.map((certificate, index) => <article key={certificate.image} className={`certificate-card ${index === 0 ? "certificate-featured" : ""}`} data-reveal>
      <a className="certificate-frame" href={certificate.image} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar: ${certificate.title}`} onClick={event => open(event, index)}>
        <Image src={certificate.image} alt={`Certificado de Ely Maria Barbosa de Oliveira: ${certificate.description}`} width={certificate.width} height={certificate.height} sizes={index === 0 ? "(max-width: 900px) 85vw, 50vw" : "(max-width: 600px) 85vw, 42vw"} />
        <span><Icon name="zoom-in" /> Visualizar certificado</span>
      </a>
      <div className="certificate-details"><span className="certificate-number">0{index + 1} / {index === 0 ? "Formação TRG" : "Aperfeiçoamento"}</span><h3>{certificate.title}</h3><p>{certificate.issuer}</p>
        <dl className="certificate-meta"><div><dt>Carga horária</dt><dd>{certificate.hours}</dd></div><div><dt>Emissão</dt><dd><time dateTime={certificate.isoDate}>{certificate.date}</time></dd></div></dl>
        {certificate.note && <p className="certification-validity">{certificate.note}</p>}
        <a href={certificate.image} target="_blank" rel="noopener noreferrer" className="certificate-text-link" onClick={event => open(event, index)}>Ver certificado<span className="sr-only">: {certificate.title}</span> <Icon name="arrow-up-right" /></a>
      </div>
    </article>)}</div>
    <dialog ref={dialog} className="certificate-dialog" aria-labelledby="certificate-dialog-title" onClose={() => { restore(); trigger.current?.focus(); }} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }} onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      <div className="certificate-viewer"><div className="certificate-viewer-header"><h3 id="certificate-dialog-title">{active.title} · Ely Oliveira</h3><button type="button" aria-label="Fechar certificado" onClick={() => dialog.current?.close()} autoFocus><Icon name="x-lg" /></button></div>
        <Image src={active.image} alt={`Certificado de Ely Maria Barbosa de Oliveira: ${active.description}`} width={active.width} height={active.height} sizes="(max-width: 600px) calc(100vw - 56px), 1000px" />
        <a className="certificate-original" href={active.image} target="_blank" rel="noopener noreferrer">Abrir documento original em outra aba <Icon name="box-arrow-up-right" /></a>
      </div>
    </dialog>
  </section>;
}
