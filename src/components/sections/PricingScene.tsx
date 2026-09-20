"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CLIP_FULL, CLIP_HIDDEN_BOTTOM, EASE_IN_OUT, isReducedMotion } from "@/lib/motion";
import { sectionStore } from "@/lib/sectionStore";

/**
 * 06 PRICING inversion. As the section top crosses the viewport bottom the
 * ink floods upward with a hard edge over 0.7s; the progress rail inverts in
 * the same window. Leaving the band in either direction reverts the rail.
 */
export function PricingScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root?.firstElementChild as HTMLElement | null;
    if (!root || !section) return;

    const flood = section.querySelector<HTMLElement>("[data-pricing-flood]");
    const reduced = isReducedMotion();

    const ctx = gsap.context(() => {
      if (flood && !reduced) {
        gsap.set(flood, { clipPath: CLIP_HIDDEN_BOTTOM });
      }

      // Flood + rail inversion, on entry from above.
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          sectionStore.set({ inverted: true });
          if (flood && !reduced) {
            gsap.to(flood, { clipPath: CLIP_FULL, duration: 0.7, ease: EASE_IN_OUT, overwrite: true });
          }
        },
        onLeaveBack: () => {
          sectionStore.set({ inverted: false });
          if (flood && !reduced) {
            gsap.to(flood, { clipPath: CLIP_HIDDEN_BOTTOM, duration: 0.7, ease: EASE_IN_OUT, overwrite: true });
          }
        },
        onLeave: () => sectionStore.set({ inverted: false }),
        onEnterBack: () => sectionStore.set({ inverted: true }),
        onRefresh: (self) => {
          const inside = self.isActive;
          sectionStore.set({ inverted: inside });
          if (flood && !reduced && (inside || self.progress >= 1)) {
            gsap.set(flood, { clipPath: CLIP_FULL });
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
      sectionStore.set({ inverted: false });
    };
  }, []);

  return (
    <div ref={ref} className="contents" data-pricing-scene>
      {children}
    </div>
  );
}
