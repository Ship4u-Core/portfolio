"use client";

import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import { sections } from "@/content/sections";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSectionState } from "@/lib/sectionStore";
import { MonoRewrite } from "@/components/ui/MonoRewrite";

/**
 * The pipeline. Fixed to the top of the viewport, 44px, never hides.
 * Wordmark left, current section centre (desktop), status chip right, and a
 * 1px accent fill on the bottom hairline bound to document scroll progress.
 */
export function ProgressRail() {
  const state = useSectionState();
  const fillRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const current = sections.find((s) => s.code === state.active) ?? sections[0];
  const chip = state.shipped ? "SHIPPED" : "BUILDING";
  const shippedRef = useRef(false);
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;
    gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });
    const follow = (self: ScrollTrigger) => {
      progressRef.current = self.progress;
      // During the closing collapse the fill is held at 100 percent.
      if (!shippedRef.current) gsap.set(fill, { scaleX: self.progress });
    };
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: follow,
      onRefresh: follow,
    });
    return () => trigger.kill();
  }, []);

  // Closing collapse: fill runs to 100 percent, then the chip underline draws.
  useLayoutEffect(() => {
    const underline = underlineRef.current;
    const fill = fillRef.current;
    if (!underline || !fill) return;
    const reduced = document.documentElement.classList.contains("reduce");
    shippedRef.current = state.shipped;
    gsap.killTweensOf([underline, fill]);
    if (state.shipped) {
      gsap.to(fill, { scaleX: 1, duration: reduced ? 0 : 0.6, ease: "expo.out" });
      gsap.fromTo(
        underline,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.6, ease: "expo.out" },
      );
    } else {
      gsap.set(underline, { scaleX: 0 });
      gsap.set(fill, { scaleX: progressRef.current });
    }
  }, [state.shipped]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 h-(--rail-height)",
        "border-b border-rule backdrop-blur-[12px]",
        "transition-[background-color,color,border-color] duration-700",
      )}
      style={{
        background: state.inverted
          ? "color-mix(in srgb, var(--ink-flood) 88%, transparent)"
          : "color-mix(in srgb, var(--paper) 88%, transparent)",
        color: state.inverted ? "var(--paper-on-ink)" : "var(--ink)",
        borderColor: state.inverted ? "var(--rule-on-ink)" : "var(--rule)",
        transitionTimingFunction: "var(--ease-in-out)",
      }}
      data-rail
      data-inverted={state.inverted ? "true" : "false"}
    >
      <div className="container-doc flex h-full items-center justify-between">
        {/* Wordmark */}
        <a
          href="#index"
          className="text-[13px] font-extrabold leading-none"
          style={{ letterSpacing: "-0.03em" }}
          aria-label="Ship4u, back to top"
          data-cursor="TOP"
        >
          SHIP
          <span data-wordmark-four className="text-signal">
            4
          </span>
          U
        </a>

        {/* Current section, desktop only */}
        <p
          className="mono hidden md:block"
          style={{ color: state.inverted ? "var(--paper-on-ink)" : undefined }}
          aria-live="polite"
          aria-atomic="true"
        >
          <MonoRewrite text={`${current.code} / ${current.title}`} duration={0.5} />
        </p>

        {/* Status chip */}
        <p
          className={clsx(
            "mono relative transition-colors duration-200",
            state.shipped && "text-signal-deep",
          )}
          style={
            state.inverted && !state.shipped ? { color: "var(--paper-on-ink)" } : undefined
          }
          data-rail-status
        >
          <MonoRewrite text={chip} duration={0.55} />
          <span
            ref={underlineRef}
            aria-hidden="true"
            className="absolute -bottom-1.5 left-0 right-0 h-px bg-signal-deep"
            style={{ transform: "scaleX(0)" }}
          />
        </p>
      </div>

      {/* Pipeline fill on the bottom hairline */}
      <div
        ref={fillRef}
        aria-hidden="true"
        className="absolute -bottom-px left-0 h-px w-full bg-signal"
        style={{ transform: "scaleX(0)" }}
        data-rail-fill
      />
    </header>
  );
}
