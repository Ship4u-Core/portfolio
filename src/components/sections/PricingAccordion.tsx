"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { currency, pricingLabels } from "@/content/pricing";
import type { PriceRow } from "@/types/content";
import { gsap } from "@/lib/gsap";
import { CLIP_FULL, CLIP_HIDDEN_LEFT, EASE_IN_OUT, EASE_OUT, isReducedMotion } from "@/lib/motion";
import { DigitRoll } from "@/components/ui/DigitRoll";

interface PricingAccordionProps {
  rows: PriceRow[];
}

/**
 * Rows, not cards. Full width, hairline separated, 96px tall, one open at a
 * time. Proper accordion semantics. Without JavaScript every panel is open;
 * with it, CSS holds the resting states and GSAP handles the 0.45s
 * transition between them (one deliberate layout animation).
 */
export function PricingAccordion({ rows }: PricingAccordionProps) {
  const [open, setOpen] = useState<string | null>(null);
  const previous = useRef<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const uid = useId();

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const prev = previous.current;
    previous.current = open;
    if (prev === open) return;

    const reduced = isReducedMotion();
    const panelOf = (id: string | null) =>
      id ? list.querySelector<HTMLElement>(`[data-price-panel="${id}"]`) : null;

    const closing = panelOf(prev);
    const opening = panelOf(open);

    if (closing) {
      if (reduced) {
        closing.style.height = "";
      } else {
        const h = closing.scrollHeight;
        gsap.fromTo(
          closing,
          { height: h },
          {
            height: 0,
            duration: 0.45,
            ease: EASE_IN_OUT,
            overwrite: true,
            onComplete: () => (closing.style.height = ""),
          },
        );
      }
    }

    if (opening) {
      const inner = opening.querySelector<HTMLElement>("[data-price-panel-inner]");
      if (reduced) {
        opening.style.height = "";
      } else {
        const h = opening.scrollHeight;
        gsap.fromTo(
          opening,
          { height: 0 },
          {
            height: h,
            duration: 0.45,
            ease: EASE_IN_OUT,
            overwrite: true,
            onComplete: () => (opening.style.height = ""),
          },
        );
        if (inner) {
          gsap.fromTo(
            inner,
            { clipPath: CLIP_HIDDEN_LEFT },
            { clipPath: CLIP_FULL, duration: 0.7, ease: EASE_OUT, delay: 0.1, overwrite: true },
          );
        }
      }
    }
  }, [open]);

  return (
    <ul ref={listRef} className="hairline-t mt-16 md:mt-20" data-pricing-rows>
      {rows.map((row) => {
        const isOpen = open === row.id;
        const buttonId = `${uid}-btn-${row.id}`;
        const panelId = `${uid}-panel-${row.id}`;
        return (
          <li
            key={row.id}
            className="price-row hairline-b"
            data-open={isOpen ? "true" : "false"}
            data-price-row
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : row.id)}
                className="flex w-full flex-col items-start gap-3 py-6 text-left md:min-h-24 md:flex-row md:items-center md:justify-between md:gap-8 md:py-0"
                data-cursor={isOpen ? "CLOSE" : "OPEN"}
              >
                <span className="type-h3 font-medium text-paper-on-ink">
                  {row.service}
                </span>
                <span className="price self-end text-paper-on-ink md:self-auto">
                  <span className="text-signal">{currency}</span>
                  <DigitRoll value={row.amount} />
                  {row.suffix ? (
                    <span className="mono-l ml-2 text-paper-on-ink/60">{row.suffix}</span>
                  ) : null}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="price-panel"
              data-price-panel={row.id}
              data-open={isOpen ? "true" : "false"}
              aria-hidden={!isOpen}
            >
              <div className="grid gap-8 pb-8 pt-2 md:grid-cols-2 md:gap-12" data-price-panel-inner>
                <div>
                  <p className="mono">{pricingLabels.included}</p>
                  <ul className="mt-4 font-mono text-[13px] leading-relaxed text-paper-on-ink/85">
                    {row.included.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="text-graphite">
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mono">{pricingLabels.timeline}</p>
                  <p className="mt-4 font-mono text-[13px] leading-relaxed text-paper-on-ink/85">
                    {row.timeline}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
