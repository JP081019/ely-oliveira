"use client";

import { useEffect } from "react";

export function MotionOrchestrator() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let scrollObserver: IntersectionObserver | undefined;
    let cleanupScroll = () => {};
    const initialize = () => {
      observer?.disconnect(); scrollObserver?.disconnect(); cleanupScroll();
      if (reduced.matches) { document.documentElement.classList.remove("has-motion"); return; }
      document.documentElement.classList.add("has-motion");
      observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("chapter-arrived"); observer?.unobserve(entry.target); } }); }, { threshold: 0.12 });
      document.querySelectorAll("[data-chapter]").forEach(element => observer?.observe(element));
      const trg = document.getElementById("trg");
      if (!trg) return;
      const paths = trg.querySelectorAll<SVGPathElement>("[data-progress-path]");
      let frame = 0;
      let visible = false;
      const update = () => {
        frame = 0;
        if (!visible) return;
        const box = trg.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight * .88 - box.top) / (box.height * .75)));
        paths.forEach(path => { path.style.strokeDashoffset = String(1 - progress); });
        trg.dataset.phase = String(Math.min(2, Math.floor(progress * 3)));
      };
      const schedule = () => { if (visible && !frame) frame = requestAnimationFrame(update); };
      scrollObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { rootMargin: "50px" });
      scrollObserver.observe(trg);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      cleanupScroll = () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
    };
    initialize(); reduced.addEventListener("change", initialize);
    return () => { observer?.disconnect(); scrollObserver?.disconnect(); cleanupScroll(); reduced.removeEventListener("change", initialize); document.documentElement.classList.remove("has-motion"); };
  }, []);
  return null;
}
