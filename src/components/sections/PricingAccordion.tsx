"use client";

import { useId, useState } from "react";
import { currency, pricingLabels } from "@/content/pricing";
import type { PriceRow } from "@/types/content";

interface PricingAccordionProps {
  rows: PriceRow[];
}

/**
 * Rows, not cards. Full width, hairline separated, 96px tall, one open at a
 * time. Proper accordion semantics. Without JavaScript every panel is open.
 */
export function PricingAccordion({ rows }: PricingAccordionProps) {
  const [open, setOpen] = useState<string | null>(null);
  const uid = useId();

  return (
    <ul className="hairline-t mt-16 md:mt-20" data-pricing-rows>
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
                  <span data-digit-roll>{row.amount}</span>
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
              style={{ height: isOpen ? "auto" : 0 }}
              data-price-panel
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
