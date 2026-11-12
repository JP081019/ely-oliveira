// Scene mathematics and buffered ridge painting retained from the supplied
// Meadow Rise component. Kept separate from React so the visible component
// can suspend painting offscreen and use a lower resolution on mobile.
export function mrfRng(seed: number) {
  let a = (seed | 0) ^ 0x9e3779b9;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const mrfClamp = (x: number) => Math.max(0, Math.min(1, x));
export function mrfSmooth(e0: number, e1: number, x: number) { const t = mrfClamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); }
export function mrfEase(t: number) { return 1 - Math.pow(1 - mrfClamp(t), 4); }
export function mrfHex(c: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c.trim());
  if (!m) return [23, 23, 23];
  const h = m[1].length === 3 ? m[1].split("").map(v => v + v).join("") : m[1];
  const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function mrfNoiseTable(seed: number) {
  const rnd = mrfRng(seed * 7919 + 17), G = 32;
  const lat = new Float32Array(G * G);
  for (let i = 0; i < lat.length; i++) lat[i] = rnd();
  const out = new Float32Array(65536);
  for (let y = 0; y < 256; y++) {
    const gy = y / 8, y0 = Math.floor(gy), fy = gy - y0, sy = fy * fy * (3 - 2 * fy), r0 = (y0 % G) * G, r1 = ((y0 + 1) % G) * G;
    for (let x = 0; x < 256; x++) {
      const gx = x / 8, x0 = Math.floor(gx), fx = gx - x0, sx = fx * fx * (3 - 2 * fx), c0 = x0 % G, c1 = (x0 + 1) % G;
      const a = lat[r0 + c0] + (lat[r0 + c1] - lat[r0 + c0]) * sx, b = lat[r1 + c0] + (lat[r1 + c1] - lat[r1 + c0]) * sx;
      out[(y << 8) | x] = a + (b - a) * sy;
    }
  }
  return out;
}
export function mrfSample(t: Float32Array, x: number, y: number) {
  const x0 = x | 0, y0 = y | 0, fx = x - x0, fy = y - y0, xa = x0 & 255, xb = (x0 + 1) & 255, ya = (y0 & 255) << 8, yb = ((y0 + 1) & 255) << 8;
  const a = t[ya | xa] + (t[ya | xb] - t[ya | xa]) * fx, b = t[yb | xa] + (t[yb | xb] - t[yb | xa]) * fx;
  return a + (b - a) * fy;
}
export interface MrfLayerSpec { q: number; base: number; amp: number; domes: { c: number; w: number; h: number }[]; waves: { f: number; p: number; a: number }[]; depth: number; haze: number }
export function mrfLayerSpec(i: number, n: number, seed: number): MrfLayerSpec {
  const q = n > 1 ? i / (n - 1) : 1, rnd = mrfRng(seed * 977 + i * 131 + 7), count = q > .9 ? 2 : 3 + Math.floor(rnd() * 1.6), domes = [], span = 2.8 / count, lean = i % 2 ? 1 : -1;
  for (let k = 0; k < count; k++) { const c = -1.4 + (k + .15 + rnd() * .7) * span; domes.push({ c, w: (.3 + rnd() * .32) * (1 + q * .7), h: .42 + rnd() * .42 + .16 * mrfClamp(.5 + c * lean * .6) }); }
  return { q, base: .68 + q * .29, amp: .27 - q * .17, domes, waves: [{ f: 1.6 + rnd() * 1.4, p: rnd() * 6.2832, a: .07 }, { f: 4.5 + rnd() * 3, p: rnd() * 6.2832, a: .025 }], depth: .16 + q * .3, haze: .03 + .5 * Math.pow(1 - q, 1.7) };
}
export function mrfCrestAt(spec: MrfLayerSpec, x: number, W: number, H: number) {
  const u = (x - W / 2) / 1000; let sum = 0;
  for (const d of spec.domes) { const z = (u - d.c) / d.w; sum += Math.exp(14 * d.h * Math.exp(-z * z)); }
  const top = Math.log(sum) / 14; let wave = 0;
  for (const o of spec.waves) wave += o.a * Math.sin(u * o.f * 6.2832 + o.p);
  return H * (spec.base - spec.amp * (top + wave));
}
export function mrfSeamAt(spec: MrfLayerSpec, x: number, W: number) {
  const u = (x - W / 2) / 1000; let a = 0, b = 0;
  for (const d of spec.domes) { const z = (u - d.c) / d.w, v = d.h * Math.exp(-z * z); if (v > a) { b = a; a = v; } else if (v > b) b = v; }
  const g = (a - b) / .07; return b > .12 ? Math.exp(-g * g) : 0;
}
const MRF_L = (() => { const v = [.42, .78, .46], l = Math.hypot(...v); return v.map(x => x / l); })();
export function mrfShade(m: number, t: number) {
  const f = Math.pow(mrfClamp(t), .6), nx = m * 2.4 * (1 - f), ny = 1 - f + .18, nz = .22 + f * 1.15, l = Math.hypot(nx, ny, nz);
  return mrfClamp(.12 + .88 * ((nx * MRF_L[0] + ny * MRF_L[1] + nz * MRF_L[2]) / l));
}
export interface MrfPaintOptions { s: number; mx: number; top: number; detailTo: number; W: number; H: number; spec: MrfLayerSpec; lit: number[]; shadow: number[]; haze: number[]; noise: Float32Array }
export function mrfPaintLayer(px: Uint8ClampedArray, w: number, h: number, o: MrfPaintOptions, c0 = 0, c1 = w) {
  const { s, mx, top, W, H, spec, lit, shadow, haze, noise } = o, out = new Uint32Array(px.buffer, px.byteOffset, w * h), q = spec.q, depthPx = Math.max(1, spec.depth * H);
  const A1 = .32 + .2 * q, A2 = .08 + .2 * q, A3 = .05 + .13 * q, lane = q * 97 + 4096, detailRows = Math.max(0, Math.min(h, Math.ceil((o.detailTo - top) * s)));
  const dn = Math.ceil(depthPx * s) + 2, hzL = new Float32Array(dn), tL = new Uint8Array(dn), darkL = new Float32Array(dn), creaseL = new Float32Array(dn);
  for (let j = 0; j < dn; j++) { const d = j / s, t = mrfClamp(d / depthPx); hzL[j] = mrfClamp(spec.haze + .16 * (1 - q) * Math.exp(-d / 9) + .2 * (1 - q) * t * t); tL[j] = Math.round(t * 63); darkL[j] = 1 - .3 * t * t; creaseL[j] = .38 * (1 - t * .7); }
  const shadeT = new Float32Array(128 * 64);
  for (let mi = 0; mi < 128; mi++) for (let k = 0; k < 64; k++) shadeT[mi * 64 + k] = mrfShade((mi / 127) * 4 - 2, k / 63);
  const [sR, sG, sB] = shadow, dR = lit[0] - sR, dG = lit[1] - sG, dB = lit[2] - sB, [hR, hG, hB] = haze;
  for (let c = Math.max(0, c0); c < Math.min(w, c1); c++) {
    const X = (c + .5) / s - mx, cy = mrfCrestAt(spec, X, W, H), m = ((mrfCrestAt(spec, X + 1 / s, W, H) - mrfCrestAt(spec, X - 1 / s, W, H)) * s) / 2, seam = mrfSeamAt(spec, X, W);
    const row = Math.round((Math.max(-2, Math.min(2, m)) + 2) * 31.75) * 64, cyRow = (cy - top) * s, start = Math.max(0, Math.floor(cyRow) - 1), pX = X * .045 + lane, cX = X * .3 + 4096, yBase = (start + .5) / s + top;
    for (let r = start; r < h; r++) {
      const dd = r + .5 - cyRow, cov = dd + .5; if (cov <= 0) continue;
      const j = dd < 0 ? 0 : dd >= dn ? dn - 1 : dd | 0, sh = shadeT[row + tL[j]] * darkL[j] * (1 - seam * creaseL[j]);
      let R = sR + dR * sh, G = sG + dG * sh, B = sB + dB * sh;
      if (r < detailRows) {
        const d = dd / s, Y = yBase + (r - start) / s, patch = mrfSample(noise, pX, d * .09 + Y * .02 + lane) - .5, clump = mrfSample(noise, cX, d * 1.25 + lane) - .5;
        let g = Math.imul(c + 7919, 374761393) ^ Math.imul(r + 104729, 668265263); g = Math.imul(g ^ (g >>> 13), 1274126177);
        const grain = ((g ^ (g >>> 16)) >>> 0) / 4294967296 - .5, tex = 1 + patch * A1 + clump * A2 + grain * A3; R *= tex; G *= tex; B *= tex;
      }
      const hz = hzL[j]; R += (hR - R) * hz; G += (hG - G) * hz; B += (hB - B) * hz;
      const A = cov >= 1 ? 255 : (cov * 255) | 0;
      out[r * w + c] = ((A << 24) | ((Math.max(0, Math.min(255, B)) | 0) << 16) | ((Math.max(0, Math.min(255, G)) | 0) << 8) | (Math.max(0, Math.min(255, R)) | 0)) >>> 0;
    }
  }
}
export function mrfMistBand(noise: Float32Array, w: number, h: number) {
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) { const v = (y + .5) / h, bell = Math.exp(-Math.pow((v - .55) / .22, 2)); for (let x = 0; x < w; x++) { const nx = x * 256 / w, a = noise[((((y * 96) / h) | 0) << 8) | (nx | 0)], b = noise[((((((y * 40) / h) | 0) + 128) & 255) << 8) | (((nx * 2) | 0) & 255)]; out[y * w + x] = mrfClamp((a * .65 + b * .35 - .36) * 2.6) * bell; } }
  return out;
}
export function mrfArrival(top: number, height: number, vh: number) { const end = Math.max(0, vh - height); return mrfClamp((vh - top) / Math.max(1, vh - end)); }
