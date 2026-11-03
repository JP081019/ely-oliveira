export const consentKey = "ely-analytics-consent-v1";
export const consentEvent = "ely-consent-change";
export const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-J40CVBFQNY";
export type Consent = "accepted" | "rejected";
export type ContactLocation = "header" | "hero" | "about" | "services" | "footer" | "floating";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    elyAnalyticsAllowed?: boolean;
  }
}

// Only the two public routes are measured; queries and hashes never leave the site.
export function safePagePath(path: string) {
  return path === "/privacidade" ? "/privacidade" : "/";
}

export function trackWhatsApp(location: ContactLocation, ctaType: "contact" | "floating") {
  if (!window.elyAnalyticsAllowed) return;
  try { window.gtag?.("event", "whatsapp_click", { location, cta_type: ctaType }); }
  catch { /* Contact navigation must work even when analytics is blocked. */ }
}

export function reviewConsent() {
  window.dispatchEvent(new Event(consentEvent));
}
