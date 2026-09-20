"use client";

import { useEffect, useRef } from "react";
import {
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
} from "three";

/** Fixed pose that WireStatic was projected from; the two must agree. */
export const WIRE_ROTATION = { x: 0.42, y: 0.62 };

interface WireObjectProps {
  /** Called after the first frame is on screen so the static SVG can step back. */
  onFirstFrame?: () => void;
  className?: string;
}

/**
 * The 03 INTERLUDE object: an icosahedron's edges, drawn as if by a pen
 * plotter. Orthographic camera, no lights, no material beyond a line colour.
 *
 *   rotation   y +0.0016 rad/frame, x +0.0006 rad/frame, constant
 *   cursor     offset lerps toward +-0.10 rad per axis from pointer position, 0.04
 *   entry      draw range 0 -> full over 1.4s on first intersection
 *   exit       RAF paused while the section is out of the viewport
 *
 * Loaded only through WireMount (dynamic import, desktop, motion allowed).
 */
export function WireObject({ onFirstFrame, className }: WireObjectProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const firstFrame = useRef(onFirstFrame);
  useEffect(() => {
    firstFrame.current = onFirstFrame;
  }, [onFirstFrame]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the static SVG stays.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    // Frustum matches the SVG's viewBox (-1.25 .. 1.25) so silhouettes align.
    const HALF = 1.25;
    const camera = new OrthographicCamera(-HALF, HALF, HALF, -HALF, 0.1, 10);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();
    const geometry = new EdgesGeometry(new IcosahedronGeometry(1, 2));
    const material = new LineBasicMaterial({ color: 0x111110, transparent: true, opacity: 0.85 });
    const object = new LineSegments(geometry, material);
    object.rotation.set(WIRE_ROTATION.x, WIRE_ROTATION.y, 0);
    scene.add(object);

    const total = geometry.getAttribute("position").count;
    geometry.setDrawRange(0, 0);

    const size = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(host);

    // Pointer: normalised -1..1 from the viewport centre, lerped each frame.
    const target = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientY / window.innerHeight) * 2 - 1;
      target.y = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let running = false;
    let started = 0;
    let drawn = false;
    let announced = false;
    const spin = { x: 0, y: 0 };

    const frame = (now: number) => {
      if (!running) return;
      if (!started) started = now;
      if (!drawn) {
        const t = Math.min(1, (now - started) / 1400);
        const eased = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
        geometry.setDrawRange(0, Math.floor(total * eased));
        if (t >= 1) drawn = true;
      }
      spin.y += 0.0016;
      spin.x += 0.0006;
      offset.x += (target.x * 0.1 - offset.x) * 0.04;
      offset.y += (target.y * 0.1 - offset.y) * 0.04;
      object.rotation.x = WIRE_ROTATION.x + spin.x + offset.x;
      object.rotation.y = WIRE_ROTATION.y + spin.y + offset.y;
      renderer.render(scene, camera);
      if (!announced) {
        announced = true;
        firstFrame.current?.();
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (host.getBoundingClientRect().bottom > 0) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className={className} data-wire-canvas />;
}

export default WireObject;
