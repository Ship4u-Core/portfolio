"use client";

import gsap from "gsap";

/* Two curves, site-wide. */
export const EASE_OUT = "expo.out"; // entrances, reveals, anything appearing
export const EASE_IN_OUT = "power4.inOut"; // transforms, morphs, state changes

/* Durations in seconds. */
export const DUR = {
  entrance: 0.9, // 0.7 to 1.1
  entranceLong: 1.1,
  entranceShort: 0.7,
  state: 0.45, // 0.35 to 0.5
  micro: 0.2, // 0.15 to 0.25
} as const;

/* Stagger, 0.04 to 0.06. Never more than 0.08. */
export const STAGGER = 0.05;

export const CLIP_HIDDEN_LEFT = "inset(0 100% 0 0)";
export const CLIP_HIDDEN_BOTTOM = "inset(100% 0 0 0)";
export const CLIP_HIDDEN_TOP = "inset(0 0 100% 0)";
export const CLIP_FULL = "inset(0 0 0 0)";

type Targets = gsap.TweenTarget;

/** Primary reveal for headlines and images. */
export function clipWipe(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { clipPath: CLIP_HIDDEN_LEFT },
    { clipPath: CLIP_FULL, duration: DUR.entrance, ease: EASE_OUT, ...vars },
  );
}

/** Wipe out to the top edge (used when a scene releases). */
export function clipWipeOutUp(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.to(targets, {
    clipPath: CLIP_HIDDEN_TOP,
    duration: DUR.state,
    ease: EASE_IN_OUT,
    ...vars,
  });
}

/** Text mask-reveals upward, as if printed onto a rule beneath it. */
export function maskUp(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 18 },
    {
      clipPath: CLIP_FULL,
      yPercent: 0,
      duration: DUR.entrance,
      ease: EASE_OUT,
      ...vars,
    },
  );
}

/** A hairline draws left to right. */
export function drawRule(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.fromTo(
    targets,
    { scaleX: 0, transformOrigin: "left center" },
    { scaleX: 1, duration: 0.55, ease: EASE_OUT, ...vars },
  );
}

type Drawable = SVGGeometryElement;

/**
 * Prepare SVG geometry for stroke drawing. Sets dasharray and dashoffset to
 * the path length so the stroke is fully hidden. Returns the elements.
 */
export function prepareDraw(root: Element): Drawable[] {
  const nodes = Array.from(
    root.querySelectorAll<Drawable>("path, line, polyline, polygon, rect, circle, ellipse"),
  ).filter((el) => typeof el.getTotalLength === "function" && !el.closest("text"));
  for (const el of nodes) {
    let length = 0;
    try {
      length = el.getTotalLength();
    } catch {
      length = 0;
    }
    if (!Number.isFinite(length) || length <= 0) continue;
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    el.dataset.length = `${length}`;
  }
  return nodes;
}

/** Draw prepared geometry in. */
export function drawIn(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.to(targets, {
    strokeDashoffset: 0,
    duration: DUR.entrance,
    ease: EASE_OUT,
    ...vars,
  });
}

/** Undraw prepared geometry (from its end, so the line retreats). */
export function drawOut(targets: Targets, vars: gsap.TweenVars = {}) {
  return gsap.to(targets, {
    strokeDashoffset: (_, el: Drawable) => -Number(el.dataset.length ?? 0),
    duration: DUR.state,
    ease: EASE_IN_OUT,
    ...vars,
  });
}

/** Apply will-change only while animating. */
export function willChange(targets: Element | Element[] | NodeListOf<Element>, props: string) {
  const list = targets instanceof Element ? [targets] : Array.from(targets);
  list.forEach((el) => ((el as HTMLElement).style.willChange = props));
  return () => list.forEach((el) => ((el as HTMLElement).style.willChange = ""));
}

/** Characters used by the monospace rewrite. */
export const REWRITE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-·";

/**
 * Compute the visible string of a monospace rewrite at `progress` 0..1.
 * Characters resolve left to right; unresolved characters cycle randomly.
 * Spaces stay spaces so the string keeps its rhythm.
 */
export function rewriteFrame(target: string, progress: number, seed = Math.random()) {
  const p = Math.min(1, Math.max(0, progress));
  const resolved = Math.floor(p * target.length);
  let out = "";
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (i < resolved || ch === " ") {
      out += ch;
      continue;
    }
    // Fractional hash: the golden-ratio step keeps neighbouring characters distinct.
    const h = (seed * 9973.13 + i * 0.6180339887 + p * 997.7) % 1;
    const idx = Math.floor(Math.abs(h) * REWRITE_CHARSET.length);
    out += REWRITE_CHARSET[idx % REWRITE_CHARSET.length];
  }
  return out;
}

export function isReducedMotion() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("reduce");
}

export function isDesktop() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 768px)").matches;
}

export { gsap };
