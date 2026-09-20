"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/**
 * 02 SELECTED WORK. Supporting rows: paper-sunk fill on hover and a 320px
 * preview that follows the cursor's Y. Rows without an href are not
 * interactive. The featured case is static document layout.
 */
export function WorkScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root?.firstElementChild as HTMLElement | null;
    if (!root || !section) return;

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
      cleanups.forEach((c) => c());
    };
  }, []);

  return (
    <div ref={ref} className="contents" data-work-scene>
      {children}
    </div>
  );
}
