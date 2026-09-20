"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { drawIn, drawOut, prepareDraw } from "@/lib/motion";

/**
 * 04 PROCESS track. Desktop with motion only: the pin block holds for 300vh
 * while the seven stages translate horizontally, a signal dot travels the
 * hairline, stage numbers turn from graphite to ink and each glyph draws as
 * the dot passes it. Everywhere else the base vertical list is used.
 */
export function ProcessScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root?.firstElementChild as HTMLElement | null;
    if (!root || !section) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const pin = section.querySelector<HTMLElement>("[data-process-pin]");
        const track = section.querySelector<HTMLElement>(
          "[data-process-track]",
        );
        const stagesEl = section.querySelector<HTMLElement>(
          "[data-process-stages]",
        );
        const dot = section.querySelector<HTMLElement>("[data-process-dot]");
        const stages = gsap.utils.toArray<HTMLElement>(
          "[data-process-stage]",
          section,
        );
        if (!pin || !track || !stagesEl || !dot) return;

        pin.setAttribute("data-horizontal", "");
        track.setAttribute("data-horizontal", "");

        const glyphPaths = stages.map((s) =>
          prepareDraw(s.querySelector("svg")!),
        );
        const passed = new Array<boolean>(stages.length).fill(false);

        // The final stage lands at 40% of the track so it never sits under the
        // manifest rail; the dot travels to that same point.
        const last = stages[stages.length - 1];
        const dotEnd = () => track.clientWidth * 0.4;
        const distance = () => Math.max(0, last.offsetLeft - dotEnd());

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: "+=300%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // A stage is passed once the travelling dot has crossed its marker.
              const threshold = dot.getBoundingClientRect().left + 6;
              stages.forEach((stage, i) => {
                const left = stage.getBoundingClientRect().left;
                const isPassed =
                  left <= threshold || (i === 0 && self.progress > 0.02);
                if (isPassed !== passed[i]) {
                  passed[i] = isPassed;
                  stage.toggleAttribute("data-passed", isPassed);
                  if (isPassed)
                    drawIn(glyphPaths[i], { duration: 0.6, stagger: 0.05 });
                  else drawOut(glyphPaths[i], { duration: 0.3 });
                }
              });
            },
          },
        });

        tl.to(stagesEl, { x: () => -distance(), ease: "none", duration: 1 }, 0);
        tl.to(dot, { x: () => dotEnd() - 5, ease: "none", duration: 1 }, 0);

        // First glyph is drawn immediately on entry so the track never reads empty.
        ScrollTrigger.create({
          trigger: pin,
          start: "top 60%",
          once: true,
          onEnter: () => {
            if (!passed[0]) {
              passed[0] = true;
              stages[0].toggleAttribute("data-passed", true);
              drawIn(glyphPaths[0], { duration: 0.6, stagger: 0.05 });
            }
          },
        });

        return () => {
          pin.removeAttribute("data-horizontal");
          track.removeAttribute("data-horizontal");
          stages.forEach((s) => s.removeAttribute("data-passed"));
          glyphPaths.flat().forEach((p) => {
            p.style.strokeDasharray = "";
            p.style.strokeDashoffset = "";
          });
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="contents" data-process-scene>
      {children}
    </div>
  );
}
