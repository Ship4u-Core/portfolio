import { pricing, pricingFootnote, pricingHeadline } from "@/content/pricing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GrainOnInk } from "@/components/chrome/Grain";
import { PricingAccordion } from "@/components/sections/PricingAccordion";

/**
 * 06 PRICING. The inverted band: the only dark surface on the site. Not a
 * dark mode; a page turn to a different stock.
 */
export function S06Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="doc-section relative overflow-hidden"
      data-tone="ink"
      data-section="06"
    >
      {/* Flood layer: wipes up from the bottom edge on entry (Phase 3) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-flood"
        data-pricing-flood
      />
      <GrainOnInk />

      <div className="section-pad relative z-[1]">
        <SectionHeader code="06" title="PRICING" id="pricing" tone="ink" />

        <div className="container-doc mt-16 md:mt-24">
          <p className="display-l" data-pricing-headline>
            {pricingHeadline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <PricingAccordion rows={pricing} />

          <p
            className="mono mt-12 leading-relaxed"
            style={{ color: "color-mix(in srgb, var(--paper-on-ink) 45%, var(--ink-flood))" }}
          >
            {pricingFootnote.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
