"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  CLIP_FULL,
  CLIP_HIDDEN_BOTTOM,
  CLIP_HIDDEN_LEFT,
  EASE_OUT,
  isReducedMotion,
  rewriteFrame,
} from "@/lib/motion";
import { sectionStore } from "@/lib/sectionStore";

/** Text of a node, ignoring aria-hidden decorations such as placeholder tags. */
function visibleText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  const el = node as HTMLElement;
  if (el.getAttribute?.("aria-hidden") === "true") return "";
  let out = "";
  el.childNodes.forEach((child) => (out += visibleText(child)));
  return out;
}

/**
 * 00 INDEX choreography.
 *
 * Load (under 1.2s, content readable throughout):
 *   0.00-0.55  hairline draws left to right
 *   0.10-0.70  top-left mono block rewrites into place
 *   0.35/0.41/0.47  headline lines mask up from the hairline
 *   0.55-0.95  counter 000 -> 100 with a bar, then settles to 100 / READY
 *   0.90       paragraph and actions clip-wipe in, 0.06 stagger
 *   1.05       the 4 in the rail wordmark turns to the accent
 *
 * Scroll (hero exit): lines shear upward at -14/-22/-30% vh, the hairline
 * holds until the headline has passed, IDEA rewrites to PRODUCT at 55%, and
 * the manifest rail is released at 85%.
 */
export function HeroScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root?.firstElementChild as HTMLElement | null;
    if (!root || !section) return;
    const four = document.querySelector<HTMLElement>("[data-wordmark-four]");

    if (isReducedMotion()) {
      four?.setAttribute("data-on", "true");
      return;
    }

    const ctx = gsap.context(() => {
      const rule = root.querySelector<HTMLElement>("[data-hero-rule]");
      const lines = gsap.utils.toArray<HTMLElement>("[data-hero-line]", root);
      const lineMasks = gsap.utils.toArray<HTMLElement>("[data-reveal-line]", root);
      const body = root.querySelector<HTMLElement>("[data-hero-body]");
      const actions = root.querySelector<HTMLElement>("[data-hero-actions]");
      const counter = root.querySelector<HTMLElement>("[data-counter-value]");
      const counterWrap = root.querySelector<HTMLElement>("[data-hero-counter]");
      const counterBar = root.querySelector<HTMLElement>("[data-counter-bar]");
      const eyebrowTarget = root.querySelector<HTMLElement>("[data-rewrite-target]");
      const word = root.querySelector<HTMLElement>("[data-rewrite-word]");

      /* ---------- Load ---------- */
      const load = gsap.timeline({ defaults: { ease: EASE_OUT } });

      if (rule) {
        gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
        load.to(rule, { scaleX: 1, duration: 0.55 }, 0);
      }

      if (eyebrowTarget) {
        const final = visibleText(eyebrowTarget);
        const ghost = document.createElement("span");
        ghost.setAttribute("aria-hidden", "true");
        ghost.className = "absolute left-0 top-0 whitespace-pre";
        ghost.textContent = rewriteFrame(final, 0, 0.3);
        const parent = eyebrowTarget.parentElement as HTMLElement;
        parent.style.position = parent.style.position || "relative";
        parent.appendChild(ghost);
        gsap.set(eyebrowTarget, { visibility: "hidden" });
        const state = { p: 0 };
        load.to(
          state,
          {
            p: 1,
            duration: 0.6,
            ease: "none",
            onUpdate: () => (ghost.textContent = rewriteFrame(final, state.p, 0.3 + state.p)),
            onComplete: () => {
              ghost.remove();
              gsap.set(eyebrowTarget, { visibility: "visible" });
            },
          },
          0.1,
        );
      }

      if (lineMasks.length) {
        gsap.set(lineMasks, { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 22 });
        lineMasks.forEach((mask, i) => {
          load.to(mask, { clipPath: CLIP_FULL, yPercent: 0, duration: 0.9 }, 0.35 + i * 0.06);
        });
      }

      if (counter && counterBar && counterWrap) {
        const value = { n: 0 };
        counter.textContent = "000";
        gsap.set(counterBar, { scaleX: 0, transformOrigin: "left center" });
        load
          .to(
            value,
            {
              n: 100,
              duration: 0.4,
              ease: "none",
              onUpdate: () => (counter.textContent = String(Math.round(value.n)).padStart(3, "0")),
            },
            0.55,
          )
          .to(counterBar, { scaleX: 1, duration: 0.4, ease: "none" }, 0.55)
          .to(counterWrap, { opacity: 0.6, duration: 0.3 }, 0.95);
      }

      const wipeTargets = [body, actions].filter(Boolean) as HTMLElement[];
      if (wipeTargets.length) {
        gsap.set(wipeTargets, { clipPath: CLIP_HIDDEN_LEFT });
        load.to(wipeTargets, { clipPath: CLIP_FULL, duration: 0.8, stagger: 0.06 }, 0.9);
      }

      if (four) {
        load.call(() => four.setAttribute("data-on", "true"), [], 1.05);
      }

      /* ---------- Scroll ---------- */
      const rewriteTo = word?.dataset.to ?? "";
      const rewriteFrom = word?.dataset.from ?? "";
      const seed = 0.42;

      const scroll = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (word) {
              if (p <= 0.45) word.textContent = rewriteFrom;
              else if (p >= 0.65) word.textContent = rewriteTo;
              else word.textContent = rewriteFrame(rewriteTo, (p - 0.45) / 0.2, seed + p);
            }
            sectionStore.set({ manifestVisible: p >= 0.85 });
          },
        },
      });

      const rates = [-0.14, -0.22, -0.3];
      lines.forEach((line, i) => {
        scroll.to(line, { y: () => window.innerHeight * rates[i], ease: "none", duration: 1 }, 0);
      });
      if (rule) {
        // Hold the hairline in place while the headline passes over it, then release.
        scroll.to(rule, { y: () => section.offsetHeight * 0.45, ease: "none", duration: 0.45 }, 0);
      }
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={ref} className="contents" data-hero-scene>
      {children}
    </div>
  );
}
