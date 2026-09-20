"use client";

import { useEffect, useState } from "react";

const isDev = process.env.NODE_ENV === "development";

/**
 * Twelve-column construction grid. Development only, toggled with the G key.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isDev) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key?.toLowerCase() !== "g") return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      setVisible((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!isDev || !visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] container-doc"
    >
      <div className="grid-12 h-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-full"
            style={{
              background: "rgba(226, 64, 28, 0.06)",
              borderLeft: "1px solid rgba(226, 64, 28, 0.25)",
              borderRight: "1px solid rgba(226, 64, 28, 0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
