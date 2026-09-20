"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafBound: ((time: number) => void) | null = null;

/**
 * The single registration point for GSAP and Lenis. Called once from the
 * ScrollProvider. When the visitor prefers reduced motion, Lenis is not
 * created and native scrolling is used.
 */
export function initScroll(reduced: boolean) {
  if (reduced) {
    ScrollTrigger.normalizeScroll(false);
    return () => {};
  }

  lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.4 });
  lenis.on("scroll", ScrollTrigger.update);
  rafBound = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(rafBound);
  gsap.ticker.lagSmoothing(0);

  // Section and scene triggers are owned by their components (gsap.context,
  // reverted on cleanup), so this teardown only removes the smooth scroller.
  return () => {
    if (rafBound) gsap.ticker.remove(rafBound);
    rafBound = null;
    lenis?.destroy();
    lenis = null;
    ScrollTrigger.refresh();
  };
}

export function getLenis() {
  return lenis;
}

/**
 * Scroll to a section by element id. Uses Lenis when it is running, native
 * scrolling otherwise. The progress rail is accounted for.
 */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
    return;
  }
  const reduced = document.documentElement.classList.contains("reduce");
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

export { gsap, ScrollTrigger };
