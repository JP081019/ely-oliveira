"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getConsentState, subscribeConsent, clearAnalyticsCookies } from "@/lib/consent.mjs";

const VercelAnalytics = dynamic(() => import("@vercel/analytics/react").then(module => module.Analytics), { ssr: false });
const id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const gaId = id && /^G-[A-Z0-9]+$/.test(id) ? id : undefined;
const enableVercel = process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };

export function AnalyticsGate() {
  const consent = useSyncExternalStore(subscribeConsent, getConsentState, () => "unknown");
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const target = window as unknown as AnalyticsWindow;
    const allowed = consent === "granted";
    if (!allowed) {
      if (gaId) target[`ga-disable-${gaId}`] = true;
      target.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      document.getElementById("ely-ga4")?.remove();
      clearAnalyticsCookies();
      return;
    }
    if (gaId) {
      target[`ga-disable-${gaId}`] = false;
      target.dataLayer ||= [];
      target.gtag ||= (...args: unknown[]) => { target.dataLayer!.push(args); };
      target.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      target.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      target.gtag("js", new Date());
      target.gtag("config", gaId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
      const script = document.createElement("script");
      script.id = "ely-ga4"; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);
    }
    const trackClick = async (event: MouseEvent) => {
      if (getConsentState() !== "granted") return;
      const link = (event.target as Element).closest<HTMLElement>("[data-track]");
      if (!link) return;
      const name = link.dataset.track;
      if (!name || !["whatsapp_click", "social_link_click", "contact_cta_click"].includes(name)) return;
      const properties = { placement: link.dataset.location || "site" };
      if (gaId) target.gtag?.("event", name, properties);
      if (enableVercel) { const { track } = await import("@vercel/analytics"); if (getConsentState() === "granted") track(name, properties); }
    };
    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, [consent]);

  useEffect(() => {
    if (consent !== "granted") { lastPage.current = null; return; }
    if (!gaId || !pathname || lastPage.current === pathname) return;
    lastPage.current = pathname;
    (window as unknown as AnalyticsWindow).gtag?.("event", "page_view", { page_location: window.location.origin + pathname, page_path: pathname, page_referrer: document.referrer.split(/[?#]/)[0] });
  }, [consent, pathname]);

  return consent === "granted" && enableVercel ? <VercelAnalytics beforeSend={event => getConsentState() === "granted" ? { ...event, url: event.url.split(/[?#]/)[0] } : null} /> : null;
}
