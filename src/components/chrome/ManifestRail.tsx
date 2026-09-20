"use client";

import clsx from "clsx";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { manifest } from "@/content/sections";
import { scrollToSection } from "@/lib/gsap";
import { drawIn, isReducedMotion, prepareDraw } from "@/lib/motion";
import { useSectionState } from "@/lib/sectionStore";
import { Cross, Tick } from "@/components/ui/Icons";

/**
 * Navigation. No menu: a vertical manifest fixed to the right edge on
 * desktop from section 01 onward, and a single circular button on mobile
 * that opens a full-screen manifest list on paper.
 */
export function ManifestRail() {
  const state = useSectionState();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const visible = state.manifestVisible || state.active !== "00";

  const go = useCallback((id: string) => {
    setOpen(false);
    // Let the sheet close before the scroll begins.
    requestAnimationFrame(() => scrollToSection(id));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const opener = openerRef.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      opener?.focus();
    };
  }, [open]);

  const rows = manifest.map((s) => {
    const isActive = state.active === s.code;
    const done = state.passed.has(s.code) || state.shipped;
    return { ...s, isActive, done };
  });

  // Newly mounted ticks draw themselves: 0.2s each, 0.05s stagger top to
  // bottom. On the closing collapse every remaining row ticks in sequence.
  const navRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || isReducedMotion()) return;
    const fresh = Array.from(
      nav.querySelectorAll<SVGSVGElement>("[data-manifest-tick]:not([data-drawn])"),
    );
    if (fresh.length === 0) return;
    fresh.forEach((svg) => svg.setAttribute("data-drawn", ""));
    const paths = fresh.flatMap((svg) => prepareDraw(svg));
    drawIn(paths, { duration: 0.2, stagger: 0.05, ease: "power4.inOut" });
  });

  return (
    <>
      {/* Desktop rail */}
      <nav
        ref={navRef}
        aria-label="Sections"
        className={clsx(
          "fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 border-l py-3 pl-5 pr-(--gutter) lg:block",
          "transition-[opacity,background-color,border-color,color] duration-500",
          visible ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{
          transitionTimingFunction: "var(--ease-out)",
          background: state.inverted
            ? "color-mix(in srgb, var(--ink-flood) 92%, transparent)"
            : "color-mix(in srgb, var(--paper) 92%, transparent)",
          borderColor: state.inverted ? "var(--rule-on-ink)" : "var(--rule)",
          ["--mono-color" as string]: state.inverted
            ? "color-mix(in srgb, var(--paper-on-ink) 55%, var(--ink-flood))"
            : undefined,
          ["--ink" as string]: state.inverted ? "var(--paper-on-ink)" : undefined,
          ["--color-ink" as string]: state.inverted ? "var(--paper-on-ink)" : undefined,
        }}
        data-manifest
        data-visible={visible ? "true" : "false"}
      >
        <ol className="flex flex-col gap-1">
          {rows.map((row) => (
            <li key={row.code}>
              <button
                type="button"
                onClick={() => go(row.id)}
                aria-current={row.isActive ? "true" : undefined}
                className={clsx(
                  "mono flex h-8 w-full items-center gap-3 whitespace-nowrap text-left transition-colors duration-200",
                  row.isActive ? "text-ink" : "hover:text-ink",
                )}
                style={{ letterSpacing: "0.12em" }}
                data-cursor="VIEW"
                data-manifest-row={row.code}
                data-done={row.done ? "true" : undefined}
              >
                <span className="w-5 tabular">{row.code}</span>
                <span className="w-24">{row.short}</span>
                <span className="flex w-4 items-center justify-center" aria-hidden="true">
                  {row.done ? (
                    <Tick className={clsx(row.isActive ? "text-signal" : "text-ink")} data-manifest-tick />
                  ) : (
                    <span
                      className={clsx(
                        "block h-1 w-1 rounded-full transition-colors duration-200",
                        row.isActive ? "bg-signal" : "bg-rule",
                      )}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile opener */}
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Sections. Currently ${state.active}`}
        className={clsx(
          "mono fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-ink bg-paper text-ink tabular lg:hidden",
          "transition-opacity duration-300",
          visible && !open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        data-manifest-opener
      >
        {state.active}
      </button>

      {/* Mobile sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sections"
        className={clsx(
          "fixed inset-0 z-[60] bg-paper lg:hidden",
          open ? "block" : "hidden",
        )}
        data-manifest-sheet
      >
        <div className="container-doc flex h-full flex-col pb-8 pt-[calc(var(--rail-height)+16px)]">
          <div className="flex items-center justify-between">
            <span className="mono text-ink">MANIFEST</span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="mono flex h-11 w-11 items-center justify-center border border-rule text-ink"
              aria-label="Close sections"
            >
              <Cross />
            </button>
          </div>
          <ol className="hairline-t mt-6 flex flex-col">
            {rows.map((row) => (
              <li key={row.code} className="hairline-b">
                <button
                  type="button"
                  onClick={() => go(row.id)}
                  aria-current={row.isActive ? "true" : undefined}
                  className={clsx(
                    "mono flex min-h-14 w-full items-center gap-5 text-left",
                    row.isActive ? "text-ink" : undefined,
                  )}
                  style={{ fontSize: "0.8125rem" }}
                >
                  <span className="w-8 tabular">{row.code}</span>
                  <span className="flex-1">{row.short}</span>
                  <span className="flex w-4 items-center justify-center" aria-hidden="true">
                    {row.done ? (
                      <Tick className="text-ink" />
                    ) : (
                      <span
                        className={clsx(
                          "block h-1.5 w-1.5 rounded-full",
                          row.isActive ? "bg-signal" : "bg-rule",
                        )}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
