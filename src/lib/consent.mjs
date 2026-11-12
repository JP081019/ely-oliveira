export const CONSENT_KEY = "ely-consent-v1";
export const CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;

export function parseConsent(raw, now = Date.now()) {
  try {
    const record = JSON.parse(raw);
    if (record?.version !== 1 || typeof record.analytics !== "boolean" || typeof record.savedAt !== "number" || record.savedAt > now || now - record.savedAt >= CONSENT_TTL) return "unknown";
    return record.analytics ? "granted" : "denied";
  } catch { return "unknown"; }
}

let memory = "unknown";
let memoryOnly = false;
export function getConsentState() {
  if (typeof window === "undefined") return "unknown";
  if (memoryOnly) return memory;
  try { return parseConsent(window.localStorage.getItem(CONSENT_KEY)); } catch { return memory; }
}

export function saveConsent(analytics) {
  memory = analytics ? "granted" : "denied";
  try { window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ version: 1, analytics, savedAt: Date.now() })); memoryOnly = false; } catch { memoryOnly = true; }
  window.dispatchEvent(new Event("ely-consent-change"));
}

export function subscribeConsent(callback) {
  const onStorage = event => { if (!event.key || event.key === CONSENT_KEY) callback(); };
  window.addEventListener("ely-consent-change", callback);
  window.addEventListener("storage", onStorage);
  const expiration = window.setInterval(callback, 60000);
  return () => { window.removeEventListener("ely-consent-change", callback); window.removeEventListener("storage", onStorage); window.clearInterval(expiration); };
}

export function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const pieces = host.split(".");
  const domains = ["", host, ...pieces.map((_, i) => `.${pieces.slice(i).join(".")}`)];
  document.cookie.split(";").map(value => value.trim().split("=")[0]).filter(name => /^_ga(?:_|$)|^_gid$|^_gat/.test(name)).forEach(name => {
    domains.forEach(domain => { document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}; SameSite=Lax`; });
  });
}
