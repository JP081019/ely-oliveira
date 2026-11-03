"use client";

import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { consentEvent, consentKey, measurementId, reviewConsent, safePagePath, type Consent } from "@/lib/analytics";

export function CookiePreferences() {
  return <button type="button" className="privacy-settings" onClick={reviewConsent}>Preferências de cookies</button>;
}

export function SiteAnalytics() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  const initialized = useRef(false);
  const acceptButton = useRef<HTMLButtonElement>(null);
  const reviewTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(consentKey);
      if (saved === "accepted" || saved === "rejected") setConsent(saved);
      else setVisible(true);
    } catch { setVisible(true); }
    const review = () => {
      reviewTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setVisible(true);
      requestAnimationFrame(() => acceptButton.current?.focus());
    };
    window.addEventListener(consentEvent, review);
    return () => window.removeEventListener(consentEvent, review);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    window.elyAnalyticsAllowed = true;
    if (initialized.current) return () => { window.elyAnalyticsAllowed = false; };
    initialized.current = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
    window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // Also disable Enhanced Measurement in the GA4 stream before publication.
      page_location: `https://www.terapiaely.com.br${safePagePath(window.location.pathname)}`,
      page_referrer: "",
      page_title: "Ely Oliveira — Atendimento online",
      ignore_referrer: true,
    });
    setReady(true);
    return () => { window.elyAnalyticsAllowed = false; };
  }, [consent]);

  useEffect(() => {
    if (!ready || consent !== "accepted") return;
    const path = safePagePath(pathname);
    if (lastPage.current === path) return;
    lastPage.current = path;
    window.gtag?.("set", { page_location: `https://www.terapiaely.com.br${path}`, page_referrer: "" });
    window.gtag?.("event", "page_view", {
      page_location: `https://www.terapiaely.com.br${path}`,
      page_referrer: "",
      page_title: path === "/" ? "Ely Oliveira — Atendimento online" : "Privacidade — Ely Oliveira",
    });
  }, [ready, consent, pathname]);

  function choose(value: Consent) {
    try { localStorage.setItem(consentKey, value); } catch { /* Current-visit choice still works. */ }
    window.elyAnalyticsAllowed = value === "accepted";
    if (value === "rejected") {
      (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
      window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      // Remove first-party GA cookies from both host and parent-domain scopes.
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (!/^_ga(?:_|$)|^_gid$|^_gat/.test(name)) continue;
        for (const domain of ["", location.hostname, ".terapiaely.com.br"]) {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
        }
      }
    }
    setConsent(value);
    setVisible(false);
    reviewTrigger.current?.focus();
    // Unload previously authorized Google code and its automatic timers.
    if (value === "rejected" && ready) window.location.reload();
  }

  return <>
    <Analytics beforeSend={event => ({ ...event, url: `https://www.terapiaely.com.br${safePagePath(new URL(event.url).pathname)}` })} />
    {consent === "accepted" && ready && <Script id="ely-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />}
    {visible && <section className="cookie-banner" aria-labelledby="cookie-title">
      <div><h2 id="cookie-title">Sua privacidade importa.</h2><p>Com sua autorização, usamos cookies do Google Analytics para entender visitas e cliques de contato. Você pode recusar e revisar sua escolha a qualquer momento. Também usamos estatísticas da Vercel, sem cookies. <a href="/privacidade">Política de privacidade</a>.</p></div>
      <div className="cookie-actions"><button ref={acceptButton} type="button" onClick={() => choose("accepted")}>Aceitar</button><button type="button" onClick={() => choose("rejected")}>Recusar</button></div>
    </section>}
  </>;
}
