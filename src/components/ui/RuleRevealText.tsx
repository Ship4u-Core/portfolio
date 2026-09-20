"use client";

import clsx from "clsx";
import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CLIP_FULL, CLIP_HIDDEN_BOTTOM, EASE_OUT, isReducedMotion } from "@/lib/motion";

interface RuleRevealTextProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "scroll": reveal once when 80% into view. "manual": parent drives it. */
  trigger?: "scroll" | "manual";
  delay?: number;
  /** Rule colour; defaults to the current text colour. */
  ruleClassName?: string;
  id?: string;
}

/**
 * The signature move: a hairline draws in, then the text mask-reveals upward
 * from that line as if printed onto it. Server output is the final state.
 */
export function RuleRevealText({
  as: Tag = "span",
  children,
  className,
  trigger = "scroll",
  delay = 0,
  ruleClassName,
  id,
}: RuleRevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || trigger !== "scroll" || isReducedMotion()) return;
    const rule = root.querySelector<HTMLElement>("[data-rr-rule]");
    const mask = root.querySelector<HTMLElement>("[data-rr-mask]");
    if (!rule || !mask) return;

    const ctx = gsap.context(() => {
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(mask, { clipPath: CLIP_HIDDEN_BOTTOM, yPercent: 16 });
      const tl = gsap.timeline({
        paused: true,
        delay,
        onStart: () => {
          mask.style.willChange = "clip-path, transform";
        },
        onComplete: () => {
          mask.style.willChange = "";
          rule.style.opacity = "0";
        },
      });
      tl.to(rule, { scaleX: 1, duration: 0.55, ease: EASE_OUT }, 0).to(
        mask,
        { clipPath: CLIP_FULL, yPercent: 0, duration: 0.9, ease: EASE_OUT },
        0.25,
      );
      ScrollTrigger.create({
        trigger: root,
        start: "top 82%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, root);
    return () => ctx.revert();
  }, [trigger, delay]);

  return (
    <Tag ref={ref} id={id} className={clsx("relative block", className)} data-rule-reveal>
      <span data-rr-mask className="block">
        {children}
      </span>
      <span
        aria-hidden="true"
        data-rr-rule
        className={clsx("pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-current", ruleClassName)}
        style={{ opacity: trigger === "scroll" ? undefined : 0 }}
      />
    </Tag>
  );
}
