"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import { initScroll, ScrollTrigger } from "@/lib/gsap";
import { sectionStore } from "@/lib/sectionStore";
import type { SectionCode } from "@/types/content";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Wires Lenis and ScrollTrigger once, refreshes after fonts load and on
 * debounced resize, and observes every numbered section to drive the
 * section store (rail, manifest, status chips).
 *
 * The reduced-motion preference is read from the document at effect time
 * (the head script has already mirrored it onto <html>), so the effect runs
 * exactly once per preference value rather than once per hydration pass.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const [generation, setGeneration] = useState(0);

  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => {
      document.documentElement.classList.toggle("reduce", mq.matches);
      setGeneration((g) => g + 1);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const reduced = document.documentElement.classList.contains("reduce");
    const cleanupScroll = initScroll(reduced);

    // Section observation. Works in both motion modes; it is state, not motion.
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    );
    const triggers = sections.map((el) => {
      const code = el.dataset.section as SectionCode;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) sectionStore.setActive(code);
        },
        onLeave: () => sectionStore.markPassed(code, true),
        onEnterBack: () => sectionStore.markPassed(code, false),
        onRefresh: (self) => {
          if (self.isActive) sectionStore.setActive(code);
          sectionStore.markPassed(code, self.progress >= 1);
        },
      });
    });

    // Section 08 entering the viewport flips the whole document to SHIPPED.
    const ship = document.getElementById("ship");
    const shipTrigger = ship
      ? ScrollTrigger.create({
          trigger: ship,
          start: "top 85%",
          onEnter: () => sectionStore.set({ shipped: true }),
          onLeaveBack: () => sectionStore.set({ shipped: false }),
        })
      : null;

    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener("resize", onResize);

    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (refreshTimer) clearTimeout(refreshTimer);
      shipTrigger?.kill();
      triggers.forEach((t) => t.kill());
      cleanupScroll();
    };
  }, [generation]);

  return <>{children}</>;
}
