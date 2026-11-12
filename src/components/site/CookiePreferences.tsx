"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getConsentState, saveConsent, subscribeConsent } from "@/lib/consent.mjs";
import { SiteIcon } from "@/components/ui/SiteIcon";

const emptySubscribe = () => () => {};

export function CookiePreferences() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentState, () => "unknown");
  const hydrated = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const open = () => { setAnalytics(getConsentState() === "granted"); dialog.current?.showModal(); };
    document.addEventListener("ely-open-preferences", open);
    return () => document.removeEventListener("ely-open-preferences", open);
  }, []);

  const choose = (accepted: boolean) => { saveConsent(accepted); dialog.current?.close(); };
  return <>
    {hydrated && consent === "unknown" ? <aside className="cookie-banner" aria-label="Escolha de privacidade"><div className="cookie-heading"><SiteIcon name="shield-lock" size={20} /><h2>Sua privacidade importa.</h2></div><p>Usamos recursos essenciais para o site funcionar e, com sua autorização, análise de visitas para melhorar sua experiência. <a href="/politica-de-privacidade">Saiba mais.</a></p><div className="cookie-actions"><button type="button" onClick={() => choose(true)}>Aceitar opcionais</button><button type="button" onClick={() => choose(false)}>Rejeitar opcionais</button></div><button className="cookie-customize" type="button" onClick={() => { setAnalytics(false); dialog.current?.showModal(); }}>Personalizar preferências<SiteIcon name="gear" size={14} /></button></aside> : null}
    <dialog className="cookie-dialog" ref={dialog} aria-labelledby="privacy-title"><div className="dialog-top"><SiteIcon name="shield-lock" size={24} /><form method="dialog"><button className="icon-button" aria-label="Fechar preferências"><SiteIcon name="x-lg" /></button></form></div><h2 id="privacy-title">Suas escolhas de privacidade</h2><p>Você decide se permite recursos de análise. Pode mudar sua escolha a qualquer momento no rodapé.</p><div className="preference-row"><div><h3>Necessários</h3><p>Guardam sua escolha de privacidade por até 180 dias. Permanecem ativos para respeitar sua decisão.</p></div><span className="essential-tag">Sempre ativos</span></div><label className="preference-row"><span><strong>Análise</strong><span className="preference-description">Permite o Google Analytics e o Vercel Analytics, quando configurados. Não enviamos mensagens ou informações de atendimento.</span></span><input type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} /><span className="switch" aria-hidden="true" /></label><div className="dialog-actions"><button className="plain-button" type="button" onClick={() => choose(false)}>Rejeitar opcionais</button><button className="plain-button dark-button" type="button" onClick={() => choose(analytics)}>Salvar preferências</button></div><a href="/politica-de-privacidade" className="privacy-policy-link">Ler a política de privacidade</a></dialog>
  </>;
}

export function PreferencesButton({ className = "" }: { className?: string }) {
  return <button className={className} type="button" onClick={() => document.dispatchEvent(new Event("ely-open-preferences"))}>Preferências de Cookies</button>;
}
