import { test } from "node:test";
import assert from "node:assert/strict";
import { parseConsent, CONSENT_TTL } from "../src/lib/consent.mjs";

const now = 1794510000000;
test("a autorização precisa ser explícita e atual", () => {
  assert.equal(parseConsent(JSON.stringify({ version: 1, analytics: true, savedAt: now }), now), "granted");
  assert.equal(parseConsent(JSON.stringify({ version: 1, analytics: false, savedAt: now }), now), "denied");
  for (const raw of [null, "", "broken", "{}", '{"version":1,"analytics":"true"}', JSON.stringify({ version: 2, analytics: true, savedAt: now }), JSON.stringify({ version: 1, analytics: true, savedAt: now + 1000 })]) assert.equal(parseConsent(raw, now), "unknown");
});
test("preferências vencidas exigem uma nova escolha após 180 dias", () => {
  assert.equal(parseConsent(JSON.stringify({ version: 1, analytics: true, savedAt: now - CONSENT_TTL + 1 }), now), "granted");
  assert.equal(parseConsent(JSON.stringify({ version: 1, analytics: true, savedAt: now - CONSENT_TTL }), now), "unknown");
});
