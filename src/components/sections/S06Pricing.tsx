import { pricing, pricingFootnote, pricingHeadline } from "@/content/pricing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GrainOnInk } from "@/components/chrome/Grain";
import { RuleRevealText } from "@/components/ui/RuleRevealText";
import { PricingAccordion } from "@/components/sections/PricingAccordion";
import { PricingScene } from "@/components/sections/PricingScene";

/**
 * 06 PRICING. The inverted band: the only dark surface on the site. Not a
 * dark mode; a page turn to a different stock.
 */
export function S06Pricing() {
  return (
    <PricingScene>
      <section
        id="pricing"
        aria-labelledby="pricing-title"
        className="doc-section relative overflow-hidden"
        data-tone="ink"
        data-section="06"
      >
        {/* Flood layer: wipes up from the bottom edge on entry */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-ink-flood"
          data-pricing-flood
          data-reveal="clip-up"
        />
        <GrainOnInk />

        <div className="section-pad relative z-[1]">
          <SectionHeader code="06" title="PRICING" id="pricing" tone="ink" />

          <div className="container-doc mt-16 md:mt-24">
            <p className="display-l" data-pricing-headline>
              {pricingHeadline.map((line, i) => (
                <RuleRevealText
                  key={line}
                  as="span"
                  className="block"
                  delay={i * 0.08}
                  ruleClassName="bg-paper-on-ink"
                >
                  {line}
                </RuleRevealText>
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
    </PricingScene>
  );
}
