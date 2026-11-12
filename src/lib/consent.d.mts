export type ConsentState = "unknown" | "granted" | "denied";
export const CONSENT_KEY: string;
export const CONSENT_TTL: number;
export function parseConsent(raw: string | null, now?: number): ConsentState;
export function getConsentState(): ConsentState;
export function saveConsent(analytics: boolean): void;
export function subscribeConsent(callback: () => void): () => void;
export function clearAnalyticsCookies(): void;
