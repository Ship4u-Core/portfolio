"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Loads three.js only when it will be seen: the section is within 300px of
 * the viewport, the viewport is 768px or wider, motion is allowed and WebGL
 * exists. Everywhere else, and until the first frame renders, the static
 * SVG children remain the only thing in the layout.
 */
const WireObject = dynamic(() => import("./WireObject"), { ssr: false });

export function WireMount({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [wanted, setWanted] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !desktop || wanted) return;
    if (document.documentElement.classList.contains("reduce")) return;
    if (!hasWebGL()) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setWanted(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [desktop, wanted]);

  const show = wanted && desktop;

  return (
    <div
      ref={ref}
      className={className}
      data-wire-mount
      data-live={live ? "true" : "false"}
    >
      {/* Square stage: the SVG and the canvas share it, so the frustum
          (-1.25 .. 1.25) maps onto the same box as the SVG viewBox. */}
      <div className="relative h-[min(64svh,64vw)] w-[min(64svh,64vw)]">
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: show && live ? 0 : 1 }}
          data-wire-static
        >
          {children}
        </div>
        {show ? (
          <WireObject className="absolute inset-0" onFirstFrame={() => setLive(true)} />
        ) : null}
      </div>
    </div>
  );
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
