"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  CLIP_FULL,
  CLIP_HIDDEN_BOTTOM,
  CLIP_HIDDEN_LEFT,
  CLIP_HIDDEN_TOP,
} from "@/lib/motion";

/**
 * 02 SELECTED WORK.
 *
 * Desktop with motion: the hero case study pins for 280vh.
 *   0-30%   180px thumbnail with registration crosses scales to full-bleed
 *   30-55%  browser chrome frame draws over it, project name masks up
 *   55-80%  image locks to 60% width, left; THE PROBLEM / WHAT WE BUILT / STACK
 *   80-100% copy wipes out, three provisional metrics roll in
 * As the supporting rows rise into view the composition clip-wipes upward.
 *
 * Supporting rows: paper-sunk fill on hover and a 320px preview following
 * the cursor's Y. Rows without an href are not interactive at all.
 */
export function WorkScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root?.firstElementChild as HTMLElement | null;
    if (!root || !section) return;

    const mm = gsap.matchMedia();
    const metricsEl = section.querySelector<HTMLElement>("[data-work-metrics]");
    const playMetrics = () => {
      metricsEl
        ?.querySelectorAll("[data-digit-roll]")
        .forEach((el) => el.dispatchEvent(new Event("digitroll:play")));
    };

    /* ---------------- Pinned zoom (desktop, motion) ---------------- */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const stage = section.querySelector<HTMLElement>("[data-work-stage]");
        const frame = section.querySelector<HTMLElement>("[data-work-frame]");
        const crosses = gsap.utils.toArray<HTMLElement>(
          "[data-work-cross]",
          section,
        );
        const chrome = section.querySelector<HTMLElement>("[data-work-chrome]");
        const name = section.querySelector<HTMLElement>("[data-work-name]");
        const breakdown = section.querySelector<HTMLElement>(
          "[data-work-breakdown]",
        );
        const metrics = section.querySelector<HTMLElement>(
          "[data-work-metrics]",
        );
        const annotations = section.querySelector<HTMLElement>(
          "[data-work-annotations]",
        );
        const rows = section.querySelector<HTMLElement>("[data-work-rows]");
        if (
          !stage ||
          !frame ||
          !chrome ||
          !name ||
          !breakdown ||
          !metrics ||
          !annotations
        )
          return;

        stage.setAttribute("data-pinned", "");

        const COL_GAP = 48;
        const geometry = () => {
          const wv = window.innerWidth;
          const wc = frame.offsetWidth;
          const rect = stage.getBoundingClientRect();
          const gutter =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--gutter",
              ),
            ) || 24;
          return {
            thumb: 180 / wc,
            full: wv / wc,
            lock: (0.6 * wv) / wc,
            // frame centre moves from the stage centre to 30% of the viewport
            lockX: 0.3 * wv - (rect.left + wc / 2),
            // right-hand column: from 60vw + gap to the right gutter, in stage coords
            colLeft: 0.6 * wv + COL_GAP - rect.left,
            colWidth: Math.max(240, 0.4 * wv - COL_GAP - gutter),
          };
        };

        const placeColumns = () => {
          const g = geometry();
          gsap.set([breakdown, metrics], {
            left: g.colLeft,
            width: g.colWidth,
          });
          // Annotations sit just above the top-left corner of the locked image.
          gsap.set(annotations, {
            top: `calc(50% - ${(frame.offsetHeight * g.lock) / 2 + 36}px)`,
          });
        };

        gsap.set(frame, {
          scale: () => geometry().thumb,
          x: 0,
          transformOrigin: "center center",
        });
        gsap.set(chrome, { opacity: 0 });
        gsap.set(name, { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 20 });
        gsap.set(breakdown, { clipPath: CLIP_HIDDEN_LEFT });
        gsap.set(metrics, { clipPath: CLIP_HIDDEN_LEFT });
        gsap.set(annotations, { opacity: 0 });
        placeColumns();

        let metricsPlayed = false;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=280%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: placeColumns,
            onUpdate: (self) => {
              if (!metricsPlayed && self.progress >= 0.82) {
                metricsPlayed = true;
                playMetrics();
              }
            },
          },
        });

        tl.to(frame, { scale: () => geometry().full, duration: 0.3 }, 0)
          .to(crosses, { opacity: 0, duration: 0.06 }, 0.24)
          .to(chrome, { opacity: 1, duration: 0.06 }, 0.3)
          .to(name, { clipPath: CLIP_FULL, yPercent: 0, duration: 0.12 }, 0.3)
          .to(
            frame,
            {
              scale: () => geometry().lock,
              x: () => geometry().lockX,
              duration: 0.1,
            },
            0.55,
          )
          .to(annotations, { opacity: 1, duration: 0.06 }, 0.62)
          .to(breakdown, { clipPath: CLIP_FULL, duration: 0.12 }, 0.58)
          .to(breakdown, { clipPath: CLIP_HIDDEN_TOP, duration: 0.08 }, 0.8)
          .to(metrics, { clipPath: CLIP_FULL, duration: 0.1 }, 0.84)
          // Hold to 1 so the labels above map directly onto scroll progress.
          .to({}, { duration: 0.06 }, 0.94);

        // Release: as the supporting rows rise, the composition wipes upward.
        const release = rows
          ? gsap.to([frame, name, metrics, annotations, chrome], {
              clipPath: CLIP_HIDDEN_TOP,
              ease: "none",
              scrollTrigger: {
                trigger: rows,
                start: "top bottom",
                end: "top 40%",
                scrub: true,
              },
            })
          : null;

        return () => {
          release?.scrollTrigger?.kill();
          release?.kill();
          tl.scrollTrigger?.kill();
          tl.kill();
          stage.removeAttribute("data-pinned");
          gsap.set(
            [frame, chrome, name, breakdown, metrics, annotations, ...crosses],
            { clearProps: "all" },
          );
        };
      },
    );

    /* ---------------- Unpinned: roll metrics on scroll ---------------- */
    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      if (!metricsEl) return;
      const st = ScrollTrigger.create({
        trigger: metricsEl,
        start: "top 85%",
        once: true,
        onEnter: playMetrics,
      });
      return () => st.kill();
    });

    /* ---------------- Supporting rows: hover preview ---------------- */
    const interactiveRows = gsap.utils.toArray<HTMLElement>(
      "[data-work-row][data-interactive]",
      section,
    );
    const cleanups = interactiveRows.map((row) => {
      const preview = row.querySelector<HTMLElement>("[data-work-preview]");
      if (!preview) return () => {};
      const onMove = (e: PointerEvent) => {
        const rect = row.getBoundingClientRect();
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.set(preview, {
          y: gsap.utils.clamp(-rect.height * 0.6, rect.height * 0.6, y),
        });
      };
      row.addEventListener("pointermove", onMove, { passive: true });
      return () => row.removeEventListener("pointermove", onMove);
    });

    return () => {
      mm.revert();
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div ref={ref} className="contents" data-work-scene>
      {children}
    </div>
  );
}
