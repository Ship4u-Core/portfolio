"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isReducedMotion, rewriteFrame } from "@/lib/motion";

interface MonoRewriteProps {
  text: string;
  /** Seconds for a full rewrite. */
  duration?: number;
  /** Rewrite on first mount as well as on change. */
  onMount?: boolean;
  delay?: number;
  className?: string;
  as?: "span" | "p" | "div";
}

/**
 * A mono string cycles random characters before resolving to its final value,
 * character by character, left to right. Runs on mount (optional) and whenever
 * `text` changes. Screen readers get the final text only. Reduced motion swaps
 * the text instantly.
 */
export function MonoRewrite({
  text,
  duration = 0.6,
  onMount = false,
  delay = 0,
  className,
  as: Tag = "span",
}: MonoRewriteProps) {
  const [visual, setVisual] = useState(text);
  const previous = useRef<string | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const first = previous.current === null;
    previous.current = text;

    if ((first && !onMount) || isReducedMotion()) {
      setVisual(text);
      return;
    }

    tweenRef.current?.kill();
    const state = { p: 0 };
    const seed = Math.random();
    tweenRef.current = gsap.to(state, {
      p: 1,
      duration,
      delay,
      ease: "none",
      onUpdate: () => setVisual(rewriteFrame(text, state.p, seed + state.p)),
      onComplete: () => setVisual(text),
    });
    return () => {
      tweenRef.current?.kill();
    };
  }, [text, duration, delay, onMount]);

  return (
    <Tag className={clsx("whitespace-pre", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-rewrite-visual>
        {visual}
      </span>
    </Tag>
  );
}
