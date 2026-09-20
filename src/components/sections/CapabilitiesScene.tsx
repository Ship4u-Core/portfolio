"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import {
  CLIP_FULL,
  CLIP_HIDDEN_BOTTOM,
  EASE_IN_OUT,
  EASE_OUT,
  prepareDraw,
} from "@/lib/motion";

/**
 * 01 CAPABILITIES. Desktop with motion only.
 *
 * The scene pins for 340vh. The left drawing is one continuous SVG whose
 * elements each declare the stage range they exist in (data-from / data-to,
 * see scenes/BuildSystemSVG.tsx). Every stroke is scrubbed through
 * stroke-dashoffset against scroll progress:
 *
 *   0.00-0.25  WEBSITES          browser frame, blocks, dimension mark
 *   0.25-0.50  WEB APPLICATIONS  sidebar, table, modal, database, API
 *   0.50-0.75  MOBILE            frame compresses into a phone, cards, 2nd phone
 *   0.75-1.00  AI                seven-node graph emits from the phone
 *
 * Nothing clears between stages: elements leaving a stage undraw as the next
 * stage's elements draw, and the browser frame physically compresses into the
 * phone silhouette. Exactly one element per stage is stroked in the signal.
 * The right column copy swaps at stage boundaries: clip-wipe out, mask-up in.
 */
export function CapabilitiesScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root?.firstElementChild as HTMLElement | null;
    if (!root || !section) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const scene = section.querySelector<HTMLElement>("[data-cap-scene]");
        const svg = section.querySelector<SVGSVGElement>(
          "[data-build-system][data-animated]",
        );
        const stages = gsap.utils.toArray<HTMLElement>(
          "[data-cap-stage]",
          section,
        );
        if (!scene || !svg || stages.length !== 4) return;

        scene.setAttribute("data-pinned", "");

        const STAGE = 0.25;
        const groups = gsap.utils.toArray<SVGGElement>("g[data-el]", svg);

        /* --- Stage state: signal element and right-column copy --- */
        let current = 0;
        const signalGroups = groups.filter((g) => g.dataset.signalAt);
        stages.forEach((s) =>
          gsap.set(s, {
            clipPath: CLIP_HIDDEN_BOTTOM,
            yPercent: 12,
            opacity: 0,
          }),
        );

        const setStage = (next: number) => {
          if (next === current) return;
          const prev = current;
          current = next;

          signalGroups.forEach((g) =>
            g.classList.toggle(
              "signal-stroke",
              Number(g.dataset.signalAt) === next,
            ),
          );

          const incoming = stages[next - 1];
          const outgoing = prev ? stages[prev - 1] : null;
          if (outgoing) {
            gsap.to(outgoing, {
              clipPath: next > prev ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
              duration: 0.3,
              ease: EASE_IN_OUT,
              overwrite: true,
            });
          }
          gsap.fromTo(
            incoming,
            { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 12, opacity: 1 },
            {
              clipPath: CLIP_FULL,
              yPercent: 0,
              duration: 0.7,
              ease: EASE_OUT,
              delay: outgoing ? 0.12 : 0,
              overwrite: true,
            },
          );
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "+=340%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setStage(Math.min(4, Math.floor(self.progress * 4) + 1)),
          },
        });

        /* --- Strokes: draw in at their stage, undraw as the next stage begins --- */
        for (const g of groups) {
          const from = Number(g.dataset.from);
          const to = Number(g.dataset.to);
          const order = Number(g.dataset.order ?? 0);
          const isText = g.hasAttribute("data-text");
          const tIn = (from - 1) * STAGE + 0.02 + order * 0.17;
          const tOut = to * STAGE + 0.005 + order * 0.02;

          if (isText) {
            g.style.opacity = "0";
            tl.to(g, { opacity: 1, duration: 0.02 }, tIn);
            if (to < 4) tl.to(g, { opacity: 0, duration: 0.02 }, tOut);
            continue;
          }

          const fills = gsap.utils.toArray<SVGElement>("[data-fill]", g);
          const shapes = prepareDraw(g).filter(
            (el) => !el.hasAttribute("data-fill"),
          );
          // CSS hides every group until its dashes are prepared; reveal now.
          g.style.opacity = "1";
          if (shapes.length === 0) continue;
          tl.to(
            shapes,
            { strokeDashoffset: 0, duration: 0.04, stagger: 0.006 },
            tIn,
          );
          // Fills cannot be dashed: they appear as their outline completes.
          if (fills.length) {
            gsap.set(fills, { opacity: 0 });
            tl.to(
              fills,
              { opacity: 1, duration: 0.02, stagger: 0.006 },
              tIn + 0.03,
            );
          }
          if (to < 4) {
            tl.to(
              shapes,
              {
                strokeDashoffset: (_, el: SVGGeometryElement) =>
                  -Number(el.dataset.length ?? 0),
                duration: 0.035,
              },
              tOut,
            );
            if (fills.length)
              tl.to(fills, { opacity: 0, duration: 0.02 }, tOut);
          }
        }

        /* --- Transformations that carry one stage into the next --- */
        // Stage 2: the sidebar slides in from the frame's left edge.
        const sidebar = svg.querySelector<SVGGElement>('g[data-el="sidebar"]');
        if (sidebar) {
          tl.fromTo(
            sidebar,
            { x: -60 },
            { x: 0, duration: 0.06 },
            STAGE + 0.02,
          );
        }
        // Stage 3: the browser frame compresses into the phone silhouette
        // while its strokes retreat and the phone draws in the same place.
        const frameParts = groups.filter((g) =>
          ["frame", "titlebar", "url"].includes(g.dataset.el ?? ""),
        );
        if (frameParts.length) {
          tl.to(
            frameParts,
            {
              scaleX: 240 / 560,
              scaleY: 480 / 420,
              svgOrigin: "400 330",
              duration: 0.07,
            },
            2 * STAGE,
          );
        }
        // Stage 4: nodes emit from the phone in an arc, settling into the graph.
        const nodes = gsap.utils.toArray<SVGGElement>(
          "g[data-el^='node-']",
          svg,
        );
        nodes.forEach((n, i) => {
          // Pure translation: each node travels out from the phone's right edge.
          tl.fromTo(
            n,
            { x: -(120 + i * 12), y: 40 - i * 14 },
            { x: 0, y: 0, duration: 0.08 },
            3 * STAGE + 0.03 + i * 0.012,
          );
        });

        // Hold to exactly 1 so the stage windows above map to scroll progress.
        tl.to({}, { duration: 0.001 }, 1);

        if (!current) setStage(1);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          scene.removeAttribute("data-pinned");
          groups.forEach((g) => {
            g.classList.remove("signal-stroke");
            g.style.opacity = "";
            g.querySelectorAll<SVGElement>("[data-length]").forEach((el) => {
              el.style.strokeDasharray = "";
              el.style.strokeDashoffset = "";
            });
          });
          gsap.set(
            [...groups, ...stages, ...svg.querySelectorAll("[data-fill]")],
            { clearProps: "all" },
          );
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="contents" data-capabilities-scene>
      {children}
    </div>
  );
}
