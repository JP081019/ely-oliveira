"use client";

import * as React from "react";
import { SiteIcon, type IconName } from "./SiteIcon";
import { mrfArrival, mrfClamp, mrfCrestAt, mrfEase, mrfHex, mrfLayerSpec, mrfMistBand, mrfNoiseTable, mrfPaintLayer, mrfSmooth, type MrfPaintOptions } from "./meadow-scene";

export interface MeadowPalette {
  sky: [string, string]; haze: string; glow: string; hills: [string, string][];
  ground: string; ink: string; sub: string; pill: string; pillInk: string;
  text: string; muted: string; line: string;
}
export interface MeadowLink { label: string; href?: string; onClick?: () => void }
export interface MeadowColumn { title: string; links: MeadowLink[] }
export interface MeadowSocial { icon: "instagram" | "facebook" | "whatsapp"; href: string; label: string }
export interface MeadowRiseFooterProps {
  name: string; brandHref?: string; logo?: React.ReactNode; heading: string; subheading?: string; phone?: string;
  cta?: { label: string; href: string } | null; tagline?: string; newsletter?: false;
  columns?: MeadowColumn[]; socialTitle?: string; socials?: MeadowSocial[];
  copyright?: string; legal?: MeadowLink[]; palette?: Partial<MeadowPalette>; seed?: number;
  mist?: number; drift?: number; interactive?: boolean; scrollParallax?: boolean; botanicals?: false;
  height?: string; heroHeight?: string; maxWidth?: string; fontFamily?: string; serifFamily?: string;
  className?: string; children?: React.ReactNode;
}

const ELY_PALETTE: MeadowPalette = {
  sky: ["#171717", "#28221B"], haze: "#403425", glow: "#4B3D27",
  hills: [["#393128", "#24211C"], ["#605038", "#3E3325"], ["#9B7C42", "#5A482B"], ["#6A5633", "#31291F"], ["#3B3225", "#221E19"], ["#27221B", "#171717"]],
  ground: "#171717", ink: "#C6A15B", sub: "#D8C9AE", pill: "#C6A15B", pillInk: "#171717",
  text: "#FFFFFF", muted: "#D8C9AE", line: "rgba(216,201,174,.22)",
};

// Adapted from the original Meadow Rise supplied by João Pedro. The seeded
// crest, slope lighting, noise, buffered ridge painter, mist and arrival
// choreography are retained. No demo newsletter, petals or stock assets.
export default function MeadowRiseFooter({ name, brandHref = "#inicio", logo, heading, subheading, phone, cta, tagline, columns = [], socials = [], socialTitle = "Acompanhe", copyright, legal = [], palette, seed = 3, mist = .3, drift = .35, interactive = true, scrollParallax = true, height = "1000px", heroHeight = "clamp(540px, 70svh, 700px)", maxWidth = "1320px", fontFamily = "var(--font-body)", serifFamily = "var(--font-display)", className = "", children }: MeadowRiseFooterProps) {
  const rootRef = React.useRef<HTMLElement>(null), heroRef = React.useRef<HTMLDivElement>(null), canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = React.useState(false);
  const colors = React.useMemo(() => ({ ...ELY_PALETTE, ...palette }), [palette]);

  React.useEffect(() => {
    const root = rootRef.current, hero = heroRef.current, canvas = canvasRef.current;
    if (!root || !hero || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); if (!ctx) return;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 700px)");
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const css = (rgb: number[], alpha = 1) => `rgba(${rgb.join(",")},${alpha})`;
    const sky0 = mrfHex(colors.sky[0]), sky1 = mrfHex(colors.sky[1]), haze = mrfHex(colors.haze), glow = mrfHex(colors.glow), ground = mrfHex(colors.ground);
    const noise = mrfNoiseTable(seed), specs = colors.hills.map((_, i) => mrfLayerSpec(i, colors.hills.length, seed));
    const hillColors = colors.hills.map(pair => pair.map(mrfHex));
    let W = 1, H = 1, SH = 1, cs = 1, overlap = 220, frame = 0, visible = false, near = false, stopped = false, revealAt: number | null = null, seenAt: number | null = null, last = 0;
    let tx = 0, ty = 0, px = 0, py = 0, k = 1, building = 0, resizeTimer = 0;
    type Layer = { canvas: HTMLCanvasElement; top: number; width: number; height: number };
    type Job = { index: number; canvas: HTMLCanvasElement; context: CanvasRenderingContext2D; image: ImageData; options: MrfPaintOptions; col: number };
    let layers: (Layer | null)[] = specs.map(() => null), job: Job | null = null;
    const mistCanvas = document.createElement("canvas"); mistCanvas.width = 320; mistCanvas.height = 64;
    const mg = mistCanvas.getContext("2d");
    if (mg) { const band = mrfMistBand(noise, 320, 64), img = mg.createImageData(320, 64); for (let i = 0; i < band.length; i++) { img.data[i * 4] = haze[0]; img.data[i * 4 + 1] = haze[1]; img.data[i * 4 + 2] = haze[2]; img.data[i * 4 + 3] = band[i] * 255; } mg.putImageData(img, 0, 0); }

    function measure() {
      W = Math.max(1, hero!.clientWidth); H = Math.max(1, hero!.offsetHeight); overlap = Math.min(300, Math.max(160, (root!.offsetHeight - H) * .55)); SH = H + overlap;
      cs = Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1 : 1.25);
      canvas!.width = Math.round(W * cs); canvas!.height = Math.round(SH * cs); canvas!.style.height = `${SH}px`;
      building = 0; job = null; layers = specs.map(() => null);
      root!.removeAttribute("data-scene-ready");
    }
    function startJob(index: number): Job | null {
      const spec = specs[index]; let min = Infinity;
      for (let x = -40; x <= W + 40; x += 4) min = Math.min(min, mrfCrestAt(spec, x, W, H));
      const top = Math.floor(min - 4), s = mobileQuery.matches ? .7 : Math.min(cs, spec.q > .5 ? 1 : .85);
      const c = document.createElement("canvas"); c.width = Math.ceil((W + 80) * s); c.height = Math.max(1, Math.ceil((SH - top) * s));
      const g = c.getContext("2d"); if (!g) return null;
      let detailTo = H + overlap * .8;
      if (index + 1 < specs.length) { let max = -Infinity; for (let x = -40; x <= W + 40; x += 4) max = Math.max(max, mrfCrestAt(specs[index + 1], x, W, H)); detailTo = Math.min(detailTo, max + 70); }
      return { index, canvas: c, context: g, image: g.createImageData(c.width, c.height), col: 0, options: { s, mx: 40, top, W, H, spec, lit: hillColors[index][0], shadow: hillColors[index][1], haze, noise, detailTo } };
    }
    function work() {
      const started = performance.now();
      while (building < specs.length && performance.now() - started < 5) {
        if (!job) job = startJob(building);
        if (!job) { building++; continue; }
        const next = Math.min(job.canvas.width, job.col + 24);
        mrfPaintLayer(job.image.data, job.canvas.width, job.canvas.height, job.options, job.col, next); job.col = next;
        if (job.col >= job.canvas.width) { job.context.putImageData(job.image, 0, 0); layers[job.index] = { canvas: job.canvas, top: job.options.top, width: job.canvas.width / job.options.s, height: job.canvas.height / job.options.s }; job = null; building++; }
      }
    }
    function draw(now: number) {
      const reduced = reducedQuery.matches, dt = reduced && revealAt !== null ? 10000 : revealAt === null ? -1 : now - revealAt;
      ctx!.setTransform(cs, 0, 0, cs, 0, 0);
      const sky = ctx!.createLinearGradient(0, 0, 0, H * .8); sky.addColorStop(0, css(sky0)); sky.addColorStop(1, css(sky1)); ctx!.fillStyle = sky; ctx!.fillRect(0, 0, W, SH);
      const dawn = dt < 0 ? 0 : mrfSmooth(0, 1600, dt), ox = W * (.7 + px * .3), oy = H * (.14 + py * .08), R = Math.max(W, H) * .62;
      const light = ctx!.createRadialGradient(ox, oy, 0, ox, oy, R); light.addColorStop(0, css(glow, .65 * dawn)); light.addColorStop(1, css(glow, 0)); ctx!.fillStyle = light; ctx!.fillRect(0, 0, W, SH);
      if (dt < 1400 && seenAt !== null) {
        const p = dt >= 0 ? 1 : Math.min(building / specs.length, mrfEase((now - seenAt) / 650)), lw = mrfEase(p) * W * .78;
        ctx!.fillStyle = css(mrfHex(colors.ink), (1 - (dt < 0 ? 0 : mrfSmooth(150, 1100, dt))) * .25); ctx!.fillRect(W / 2 - lw / 2, H * specs[0].base, lw, 1);
      }
      const par = scrollParallax && !reduced && !mobileQuery.matches ? 1 - k : 0;
      for (let i = 0; i < (dt < 0 ? 0 : layers.length); i++) {
        const layer = layers[i]; if (!layer) continue;
        const rise = (1 - mrfEase((dt - 100 - i * 100) / 1300)) * H * (.2 + .07 * i), sy = par * (10 + i * 16), lx = -px * (2 + i * 4), ly = -py * (1 + i * 2);
        ctx!.drawImage(layer.canvas, -40 + lx, layer.top + rise + sy + ly, layer.width, layer.height);
        if (mist > 0 && mg && (i === 1 || i === 3)) {
          const bw = W * 1.7, bh = H * (i === 1 ? .26 : .2), off = reduced || mobileQuery.matches ? 0 : ((now * (i === 1 ? 7 : 11) * drift) / 1000) % bw;
          const y = H * specs[Math.min(i + 1, specs.length - 1)].base - bh * .62 + rise * .6 + sy;
          ctx!.globalAlpha = mist * mrfSmooth(900, 2400, dt); ctx!.drawImage(mistCanvas, -off + lx, y, bw, bh); ctx!.drawImage(mistCanvas, bw - off + lx, y, bw, bh); ctx!.globalAlpha = 1;
        }
      }
      const fog = dt < 0 ? 1 : 1 - mrfSmooth(100, 1900, dt);
      if (fog > 0) { const f = ctx!.createLinearGradient(0, 0, 0, SH); f.addColorStop(0, css(sky0, fog)); f.addColorStop(1, css(sky1, fog)); ctx!.fillStyle = f; ctx!.fillRect(0, 0, W, SH); }
      const g = ctx!.createLinearGradient(0, H - overlap * .05, 0, SH); g.addColorStop(0, css(ground, 0)); g.addColorStop(.6, css(ground, .8)); g.addColorStop(1, css(ground)); ctx!.fillStyle = g; ctx!.fillRect(0, H - overlap * .05, W, SH - H + overlap * .05 + 1);
    }
    function tick(now: number) {
      frame = 0;
      if (stopped || document.hidden || !near) return;
      if (building < specs.length) work();
      if (visible && seenAt === null) seenAt = now;
      if (revealAt === null && seenAt !== null && building >= specs.length) { revealAt = reducedQuery.matches ? now - 10000 : now; root!.dataset.sceneReady = "true"; setInView(true); }
      if (visible) {
        const pointer = interactive && fineQuery.matches && !reducedQuery.matches;
        px += ((pointer ? tx : 0) - px) * .06; py += ((pointer ? ty : 0) - py) * .06;
        const targetK = scrollParallax && !reducedQuery.matches ? mrfArrival(root!.getBoundingClientRect().top, root!.offsetHeight, innerHeight) : 1; k += (targetK - k) * .1;
        if (now - last >= 33 || reducedQuery.matches) { draw(now); last = now; }
        const intro = !reducedQuery.matches && (revealAt === null || now - revealAt < 2600), easing = Math.abs(tx - px) > .002 || Math.abs(ty - py) > .002 || Math.abs(targetK - k) > .002;
        const ambient = !reducedQuery.matches && !mobileQuery.matches && mist > 0 && drift > 0;
        if (building < specs.length || intro || ambient || (!reducedQuery.matches && easing)) frame = requestAnimationFrame(tick);
      } else if (building < specs.length) frame = requestAnimationFrame(tick);
    }
    function wake() { if (!frame && near && !stopped && !document.hidden) frame = requestAnimationFrame(tick); }
    const move = (e: PointerEvent) => { if (!interactive || !fineQuery.matches || reducedQuery.matches) return; const r = hero!.getBoundingClientRect(); tx = mrfClamp((e.clientX - r.left) / r.width) - .5; ty = mrfClamp((e.clientY - r.top) / r.height) - .5; wake(); };
    const leave = () => { tx = 0; ty = 0; wake(); };
    const resize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { measure(); wake(); }, 140); };
    measure();
    const proximity = new IntersectionObserver(entries => { near = entries[0].isIntersecting; if (near) wake(); else { cancelAnimationFrame(frame); frame = 0; } }, { rootMargin: "200px" });
    const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) wake(); else { tx = 0; ty = 0; } });
    proximity.observe(root); visibility.observe(root);
    const ro = new ResizeObserver(resize); ro.observe(hero);
    root.addEventListener("pointermove", move); root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", wake, { passive: true }); document.addEventListener("visibilitychange", wake); reducedQuery.addEventListener("change", wake);
    return () => { stopped = true; cancelAnimationFrame(frame); clearTimeout(resizeTimer); proximity.disconnect(); visibility.disconnect(); ro.disconnect(); root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); window.removeEventListener("scroll", wake); document.removeEventListener("visibilitychange", wake); reducedQuery.removeEventListener("change", wake); };
  }, [colors, seed, mist, drift, interactive, scrollParallax]);

  return <footer ref={rootRef} id="contato" aria-labelledby="contact-title" data-chapter className={`mrf-root ${inView ? "mrf-in" : ""} ${className}`} style={{ minHeight: height, "--mrf-hero": heroHeight, "--mrf-ground": colors.ground, "--mrf-ink": colors.ink, "--mrf-sub": colors.sub, "--mrf-pill": colors.pill, "--mrf-pill-ink": colors.pillInk, "--mrf-text": colors.text, "--mrf-muted": colors.muted, "--mrf-line": colors.line, "--mrf-max": maxWidth, "--mrf-sans": fontFamily, "--mrf-serif": serifFamily, "--mrf-sky-start": colors.sky[0], "--mrf-sky-end": colors.sky[1], "--mrf-ridge-far": colors.hills[0][0], "--mrf-ridge-mid": colors.hills[2][0], "--mrf-ridge-near": colors.hills[4][0] } as React.CSSProperties}>
    <div className="mrf-scene" aria-hidden="true"><svg className="mrf-fallback" viewBox="0 0 1440 850" preserveAspectRatio="none"><path fill="var(--mrf-ridge-far)" d="M0 410Q260 290 620 470T1440 430V850H0Z" /><path fill="var(--mrf-ridge-mid)" opacity=".6" d="M0 520Q440 350 820 520T1440 500V850H0Z" /><path fill="var(--mrf-ridge-near)" d="M0 610Q430 410 850 610T1440 560V850H0Z" /><path fill="var(--mrf-ground)" d="M0 760Q400 530 850 760T1440 690V850H0Z" /></svg><canvas ref={canvasRef} /></div>
    <div ref={heroRef} className="mrf-hero"><span className="section-label">Vamos conversar?</span><h2 id="contact-title" className="mrf-h">{heading.split(" ").map((word, i) => <React.Fragment key={i}>{i > 0 ? " " : null}<span className="mrf-word"><span style={{ "--delay": `${Math.min(i, 6) * 55}ms` } as React.CSSProperties}>{word}</span></span></React.Fragment>)}</h2>{subheading ? <p className="mrf-sub">{subheading}</p> : null}{cta ? <a className="mrf-cta contact-button" href={cta.href} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-location="footer"><SiteIcon name="whatsapp" size={19} /><span>{cta.label}</span><span className="button-arrow"><SiteIcon name="arrow-up-right" size={16} /></span><span className="sr-only"> (outra aba)</span></a> : null}</div>
    <div className="mrf-body"><div className="mrf-wrap"><div className="mrf-grid"><div className="mrf-brand"><a className="mrf-logo" href={brandHref}>{logo || name}</a>{tagline ? <p className="mrf-tag">{tagline}</p> : null}</div><nav className="mrf-columns" aria-label="Navegação do rodapé">{columns.map(col => <div className="mrf-col" key={col.title}><h3>{col.title}</h3><ul>{col.links.map(link => <li key={link.label}><a className="mrf-link" href={link.href}>{link.label}</a></li>)}</ul></div>)}<div className="mrf-col"><h3>{socialTitle}</h3><div className="mrf-social">{socials.map(social => <a key={social.icon} className="mrf-social-link" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.label} (outra aba)`} data-track={social.icon === "whatsapp" ? "whatsapp_click" : "social_link_click"} data-location={`footer-${social.icon}`}><SiteIcon name={social.icon as IconName} size={21} /></a>)}</div>{phone && cta ? <a className="mrf-link footer-phone" href={cta.href} target="_blank" rel="noopener noreferrer" aria-label={`${phone} — WhatsApp (outra aba)`} data-track="whatsapp_click" data-location="footer-phone">{phone}</a> : null}<p className="footer-online">Atendimento 100% online.</p></div></nav></div><div className="mrf-bottom"><p>{copyright}</p><div className="mrf-legal">{legal.map(link => link.onClick ? <button type="button" className="mrf-link" key={link.label} onClick={link.onClick}>{link.label}</button> : <a className="mrf-link" key={link.label} href={link.href}>{link.label}</a>)}</div></div>{children}</div></div>
  </footer>;
}
