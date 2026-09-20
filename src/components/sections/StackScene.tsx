"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { prepareDraw } from "@/lib/motion";

/**
 * 05 STACK schematic behaviour, desktop only.
 *
 * Draw-in, scrubbed to scroll: bands top to bottom; within a band the node
 * boxes draw left to right, then the connectors that join it to the bands
 * above. Reduced motion shows the finished drawing.
 *
 * Hover or focus on a node: its box and every directly connected path stroke
 * in the signal, every unconnected node drops to 0.35 opacity, and a mono
 * tooltip with the one-line rationale appears beneath the node.
 */
export function StackScene({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const section = root?.firstElementChild as HTMLElement | null;
    if (!root || !section) return;

    const svg = section.querySelector<SVGSVGElement>("[data-stack-schematic]");
    const wrap = section.querySelector<HTMLElement>("[data-stack-wrap]");
    const tooltip = section.querySelector<HTMLElement>("[data-stack-tooltip]");
    if (!svg || !wrap || !tooltip) return;

    const nodes = gsap.utils.toArray<SVGGElement>("g[data-stack-node]", svg);

    // Rationale copy and band order are read from the server-rendered SVG so
    // the stack content module stays out of the client bundle.
    const rationale = new Map<string, string>();
    nodes.forEach((n) =>
      rationale.set(n.dataset.stackNode!, n.getAttribute("aria-label") ?? ""),
    );
    const edges = gsap.utils.toArray<SVGPathElement>("path[data-edge]", svg);

    /* ---------------- Hover / focus ---------------- */
    let active: string | null = null;
    const highlight = (id: string | null) => {
      if (id === active) return;
      active = id;
      svg.classList.toggle("is-hover", id !== null);
      const linked = new Set<string>();
      edges.forEach((e) => {
        const on =
          id !== null && (e.dataset.from === id || e.dataset.to === id);
        e.classList.toggle("is-active", on);
        if (on) {
          linked.add(e.dataset.from!);
          linked.add(e.dataset.to!);
        }
      });
      nodes.forEach((n) => {
        const nid = n.dataset.stackNode!;
        n.classList.toggle("is-active", nid === id);
        n.classList.toggle("is-linked", nid !== id && linked.has(nid));
      });

      if (id === null) {
        tooltip.hidden = true;
        tooltip.textContent = "";
        return;
      }
      const node = nodes.find((n) => n.dataset.stackNode === id);
      const box = node?.querySelector<SVGRectElement>("[data-node-box]");
      if (!node || !box) return;
      const wr = wrap.getBoundingClientRect();
      const br = box.getBoundingClientRect();
      tooltip.textContent = rationale.get(id) ?? "";
      tooltip.hidden = false;
      // Below the node, left-aligned with it, kept inside the wrapper.
      const maxLeft = wr.width - tooltip.offsetWidth - 8;
      const left = Math.max(0, Math.min(br.left - wr.left, maxLeft));
      tooltip.style.transform = `translate(${Math.round(left)}px, ${Math.round(br.bottom - wr.top + 8)}px)`;
    };

    const listeners: Array<() => void> = [];
    nodes.forEach((n) => {
      const id = n.dataset.stackNode!;
      const enter = () => highlight(id);
      const leave = () => highlight(null);
      n.addEventListener("pointerenter", enter);
      n.addEventListener("pointerleave", leave);
      n.addEventListener("focus", enter);
      n.addEventListener("blur", leave);
      listeners.push(() => {
        n.removeEventListener("pointerenter", enter);
        n.removeEventListener("pointerleave", leave);
        n.removeEventListener("focus", enter);
        n.removeEventListener("blur", leave);
      });
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") highlight(null);
    };
    svg.addEventListener("keydown", onKey);
    listeners.push(() => svg.removeEventListener("keydown", onKey));

    /* ---------------- Draw-in (desktop, motion) ---------------- */
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const bandIds = gsap.utils
          .toArray<SVGTextElement>("text[data-band-label]", svg)
          .map((t) => t.dataset.bandLabel!);
        const nodeBand = new Map(
          nodes.map((n) => [n.dataset.stackNode!, n.dataset.band!]),
        );
        const labels = gsap.utils.toArray<SVGTextElement>(
          "text[data-band-label]",
          svg,
        );
        const texts = nodes.map((n) => n.querySelector("text")!);

        // Prepares node boxes and connector paths alike.
        const boxes = prepareDraw(svg).filter((el) =>
          el.hasAttribute("data-node-box"),
        );
        gsap.set([...labels, ...texts], { opacity: 0 });
        svg.setAttribute("data-ready", "");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrap,
            start: "top 78%",
            end: "bottom 55%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        const bandSpan = 1 / bandIds.length;
        bandIds.forEach((band, row) => {
          const t0 = row * bandSpan;
          const bandNodes = nodes.filter((n) => n.dataset.band === band);
          tl.to(labels[row], { opacity: 1, duration: bandSpan * 0.15 }, t0);
          bandNodes.forEach((n, col) => {
            const box = boxes.find((b) => b.closest("g") === n)!;
            const t = t0 + bandSpan * (0.05 + col * 0.14);
            tl.to(box, { strokeDashoffset: 0, duration: bandSpan * 0.3 }, t);
            tl.to(
              n.querySelector("text"),
              { opacity: 1, duration: bandSpan * 0.15 },
              t + bandSpan * 0.18,
            );
          });
          // Connectors whose lower endpoint sits in this band draw once the band is in.
          const bandEdges = edges.filter((e) => {
            const rows = [
              nodeBand.get(e.dataset.from!),
              nodeBand.get(e.dataset.to!),
            ].map((b) => bandIds.indexOf(b!));
            return Math.max(...rows) === row;
          });
          if (bandEdges.length) {
            tl.to(
              bandEdges,
              {
                strokeDashoffset: 0,
                duration: bandSpan * 0.35,
                stagger: bandSpan * 0.03,
              },
              t0 + bandSpan * 0.55,
            );
          }
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          svg.removeAttribute("data-ready");
          svg.querySelectorAll<SVGElement>("[data-length]").forEach((el) => {
            el.style.strokeDasharray = "";
            el.style.strokeDashoffset = "";
          });
          gsap.set([...labels, ...texts], { clearProps: "all" });
        };
      },
    );

    return () => {
      mm.revert();
      listeners.forEach((off) => off());
      highlight(null);
    };
  }, []);

  return (
    <div ref={ref} className="contents" data-stack-scene>
      {children}
    </div>
  );
}
