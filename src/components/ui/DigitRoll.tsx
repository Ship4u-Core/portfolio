"use client";

import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE_OUT, isReducedMotion, STAGGER } from "@/lib/motion";

interface DigitRollProps {
  value: string;
  className?: string;
  /** Roll when scrolled into view (default) or under parent control. */
  trigger?: "scroll" | "manual";
  /** For manual mode: 0..1 progress, or true to play. */
  play?: boolean;
  duration?: number;
}

const DIGITS = "0123456789";

/**
 * Numbers change by translating a vertical strip of digits. Non-digit
 * characters are static. Server output shows the final value; with motion
 * the strips start at zero and roll to their digit.
 */
export function DigitRoll({
  value,
  className,
  trigger = "scroll",
  play = false,
  duration = 0.9,
}: DigitRollProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || isReducedMotion()) return;
    const strips = Array.from(root.querySelectorAll<HTMLElement>("[data-strip]"));
    if (strips.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(strips, { yPercent: 0 });
      const roll = () => {
        if (played.current) return;
        played.current = true;
        gsap.to(strips, {
          yPercent: (_, el: HTMLElement) => -Number(el.dataset.digit) * 10,
          duration,
          ease: EASE_OUT,
          stagger: STAGGER,
        });
      };
      if (trigger === "scroll") {
        ScrollTrigger.create({ trigger: root, start: "top 85%", once: true, onEnter: roll });
      } else if (play) {
        roll();
      }
    }, root);
    return () => ctx.revert();
  }, [value, trigger, play, duration]);

  return (
    <span ref={ref} className={clsx("inline-flex tabular", className)}>
      <span className="sr-only">{value}</span>
      {Array.from(value).map((ch, i) => {
        if (!DIGITS.includes(ch)) {
          return (
            <span key={i} aria-hidden="true" className="inline-block">
              {ch}
            </span>
          );
        }
        const d = Number(ch);
        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block overflow-hidden align-baseline"
            style={{ height: "1em", lineHeight: 1 }}
          >
            <span
              data-strip
              data-digit={d}
              className="block"
              style={{ transform: `translateY(-${d * 10}%)` }}
            >
              {Array.from(DIGITS).map((n) => (
                <span key={n} className="block" style={{ height: "1em", lineHeight: 1 }}>
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
