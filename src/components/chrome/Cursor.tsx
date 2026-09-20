"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, summary, [role='button'], [data-cursor]";
const NATIVE = "input, textarea, select, option, [contenteditable='true']";

/**
 * The instrument. A 16px crosshair with no lag, no trail, no blend. Over
 * anything interactive it expands to a 56px labelled circle. Only mounted
 * for fine pointers without a reduced-motion preference; otherwise the
 * native cursor is used and this renders nothing.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("custom-cursor");
      return;
    }
    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label) return;

    document.documentElement.classList.add("custom-cursor");
    let visible = false;

    const setState = (state: "cross" | "label" | "hidden", text = "") => {
      root.dataset.state = state;
      if (state === "label") label.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      root.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest(NATIVE)) {
        setState("hidden");
        return;
      }
      const el = target.closest<HTMLElement>(INTERACTIVE);
      if (!el) {
        setState("cross");
        return;
      }
      setState("label", el.dataset.cursor ?? "OPEN");
    };

    const onLeave = () => {
      visible = false;
      root.style.opacity = "0";
    };
    const onEnter = () => {
      visible = true;
      root.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="cursor-root"
      data-state="cross"
      style={{ opacity: 0 }}
    >
      <span className="cursor-cross" />
      <span className="cursor-ring">
        <span ref={labelRef} className="cursor-label mono" />
      </span>
    </div>
  );
}
