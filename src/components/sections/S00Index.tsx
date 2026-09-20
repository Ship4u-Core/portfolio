import { hero } from "@/content/sections";
import { isPlaceholder, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/ui/Placeholder";
import { ArrowDown } from "@/components/ui/Icons";
import { HeroScene } from "@/components/sections/HeroScene";

/**
 * 00 INDEX. The hero. 100svh exactly; on desktop the headline sits on a
 * full-bleed hairline at 62% viewport height. Below 768px the same parts
 * flow as a column so nothing collides on short screens. No SectionHeader
 * here by design.
 */
export function S00Index() {
  return (
    <HeroScene>
    <section
      id="index"
      aria-labelledby="index-title"
      className="relative h-[100svh] min-h-[600px] overflow-hidden"
      data-section="00"
    >
      {/* Full-bleed hairline the headline sits on (desktop) */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-[62%] hidden h-px origin-left bg-rule md:block"
        data-hero-rule
        data-reveal="rule"
      />

      <div className="container-doc relative flex h-full flex-col pb-6 pt-[calc(var(--rail-height)+28px)] md:block md:pb-0 md:pt-0">
        {/* Top-left annotation */}
        <p
          className="mono md:absolute md:left-(--gutter) md:top-[calc(var(--rail-height)+28px)] md:max-w-[60%]"
          data-hero-eyebrow
        >
          <span data-rewrite-target>
            {hero.eyebrowPrefix}
            <Placeholder off={!isPlaceholder(site.location)}>
              {site.location}
            </Placeholder>
          </span>
        </p>

        {/* Top-right counter, desktop. Decorative annotation: it settles at 60%
            graphite by design (spec 6.1), so it is hidden from assistive tech
            rather than held to body-copy contrast. */}
        <div
          className="absolute right-(--gutter) top-[calc(var(--rail-height)+28px)] hidden text-right md:block"
          data-hero-counter
          aria-hidden="true"
        >
          <p className="mono tabular">
            <span data-counter-value>100</span>
            <span aria-hidden="true"> / </span>
            <span>{hero.counterLabel}</span>
          </p>
          <div
            aria-hidden="true"
            className="ml-auto mt-2 h-px w-16 origin-left bg-graphite/60"
            data-counter-bar
            data-reveal="rule"
          />
        </div>

        {/* Technical annotation block, columns 10 to 12, desktop */}
        <dl
          className="mono absolute right-(--gutter) top-[calc(var(--rail-height)+96px)] hidden w-[22%] max-w-[260px] gap-y-2 lg:grid lg:grid-cols-[auto_1fr]"
          data-hero-annotation
        >
          <dt>DOC</dt>
          <dd className="text-right text-ink">SHIP4U / {site.year}</dd>
          <dt>REV</dt>
          <dd className="text-right text-ink">1.0</dd>
          <dt>FORMAT</dt>
          <dd className="text-right text-ink">SINGLE PAGE</dd>
          <dt>SCALE</dt>
          <dd className="text-right text-ink">1 : 1</dd>
        </dl>

        <div className="flex-1 md:hidden" aria-hidden="true" />

        {/* Headline sits on the rule */}
        <h1
          id="index-title"
          className="hero-display display-xl pb-[0.08em] md:absolute md:bottom-[38%] md:left-(--gutter) md:w-3/4"
        >
          <span className="block" data-hero-line>
            <span className="inline-block" data-reveal-line data-reveal="mask-up">
              FROM{" "}
              <span data-rewrite-word data-from={hero.rewriteFrom} data-to={hero.rewriteTo}>
                {hero.rewriteFrom}
              </span>
            </span>
          </span>
          <span className="block" data-hero-line>
            <span className="inline-block" data-reveal-line data-reveal="mask-up">
              {hero.lines[1]}
            </span>
          </span>
          <span className="block" data-hero-line>
            <span className="inline-block" data-reveal-line data-reveal="mask-up">
              {hero.lines[2]}
              <span className="text-signal">.</span>
            </span>
          </span>
        </h1>

        {/* Mobile rule, full bleed, in flow */}
        <div aria-hidden="true" className="bleed h-px bg-rule md:hidden" />

        {/* Below the rule */}
        <div
          className="grid gap-6 pt-6 md:absolute md:left-(--gutter) md:right-(--gutter) md:top-[62%] md:grid-cols-12 md:gap-8 md:pt-10"
          data-hero-below
        >
          <p
            className="body text-ink-soft md:body-l md:col-span-7"
            style={{ maxWidth: "56ch" }}
            data-hero-body
            data-reveal="clip"
          >
            {hero.body}
          </p>
          <div
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 md:col-span-5 md:col-start-8 md:justify-end"
            data-hero-actions
            data-reveal="clip"
          >
            <Button href="#ship" cursor="START" className="w-full sm:w-auto">
              {hero.primary}
            </Button>
            <Button href="#work" variant="secondary" cursor="VIEW">
              {hero.secondary}
            </Button>
          </div>
        </div>

        <div className="flex-1 md:hidden" aria-hidden="true" />

        {/* Bottom-left hint */}
        <p
          className="mono flex items-center gap-3 md:absolute md:bottom-6 md:left-(--gutter)"
          data-hero-hint
        >
          {hero.scrollHint}
          <ArrowDown className="text-graphite" />
        </p>
      </div>
    </section>
    </HeroScene>
  );
}
