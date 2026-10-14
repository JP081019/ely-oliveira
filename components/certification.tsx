"use client";

import Image from "next/image";
import { useEffect, useRef, type MouseEvent } from "react";
import { Icon } from "./interactive";

const certificate = "/images/certificado-trg-ely.jpeg";
const imageDescription = "Certificado de Ely Maria Barbosa de Oliveira em Terapia de Reprocessamento Generativo, emitido em 09/10/2026, com validade provisória de 12 meses";

export function Certification() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const lock = useRef<{ body: string; html: string } | null>(null);
  function restore() {
    if (lock.current) {
      document.body.style.overflow = lock.current.body;
      document.documentElement.style.overflow = lock.current.html;
      lock.current = null;
    }
  }
  useEffect(() => () => restore(), []);
  function open(event: MouseEvent<HTMLAnchorElement>) {
    // The original document remains available without JS or modal support.
    if (!dialog.current?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    trigger.current = event.currentTarget;
    dialog.current.showModal();
    event.preventDefault();
    lock.current = { body: document.body.style.overflow, html: document.documentElement.style.overflow };
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }
  return <section className="certification section-pad" id="certificacao" aria-labelledby="certification-title">
    <div className="certification-copy" data-reveal>
      <div className="section-label"><span className="small-line" /> FORMAÇÃO E CERTIFICAÇÃO</div>
      <h2 id="certification-title">O cuidado começa<br />com o <em>conhecimento.</em></h2>
      <p>A formação profissional é parte importante de um atendimento conduzido com responsabilidade e atenção. Ely Oliveira possui certificação em Terapia de Reprocessamento Generativo (TRG), com carga horária de 360 horas.</p>
      <dl className="certification-facts">
        <div><dt>Profissional</dt><dd>Ely Maria Barbosa de Oliveira.</dd></div>
        <div><dt>Certificação</dt><dd>Certificação Internacional de Terapeuta Especializado em Terapia de Reprocessamento Generativo (TRG).</dd></div>
        <div><dt>Instituições</dt><dd>Instituto Brasileiro de Formação de Terapeutas (IBFT) e Instituto Europeu de Terapia de Reprocessamento Generativo (IETRG).</dd></div>
        <div className="certification-dates"><div><dt>Carga horária</dt><dd>360 horas.</dd></div><div><dt>Emissão</dt><dd><time dateTime="2026-10-09">09/10/2026</time>.</dd></div></div>
      </dl>
      <p className="certification-validity">O certificado informa validade provisória de 12 meses a partir da emissão.</p>
      <a href={certificate} target="_blank" rel="noopener noreferrer" className="button certificate-button" onClick={open}><span>Ver certificado</span><Icon name="arrows-fullscreen" /></a>
    </div>
    <a className="certificate-frame" href={certificate} target="_blank" rel="noopener noreferrer" aria-label="Ampliar certificado de Ely Oliveira" onClick={open} data-reveal>
      <Image src={certificate} alt={imageDescription} width={670} height={465} sizes="(max-width: 600px) calc(100vw - 80px), (max-width: 900px) 80vw, 44vw" />
      <span><Icon name="zoom-in" /> Clique para ampliar</span>
    </a>
    <dialog ref={dialog} className="certificate-dialog" aria-labelledby="certificate-dialog-title" onClose={() => { restore(); trigger.current?.focus(); }} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }} onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      <div className="certificate-viewer">
        <div className="certificate-viewer-header"><h3 id="certificate-dialog-title">Certificado TRG · Ely Oliveira</h3><button type="button" aria-label="Fechar certificado" onClick={() => dialog.current?.close()} autoFocus><Icon name="x-lg" /></button></div>
        <Image src={certificate} alt={imageDescription} width={670} height={465} sizes="(max-width: 600px) calc(100vw - 56px), 1000px" />
        <a className="certificate-original" href={certificate} target="_blank" rel="noopener noreferrer">Abrir documento original em outra aba <Icon name="box-arrow-up-right" /></a>
      </div>
    </dialog>
  </section>;
}
