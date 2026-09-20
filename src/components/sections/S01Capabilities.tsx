import { capabilities, support } from "@/content/services";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BuildSystemSVG, type Stage } from "@/components/scenes/BuildSystemSVG";

/**
 * 01 CAPABILITIES. The build system. On desktop with motion, the left
 * drawing assembles through four stages while the right copy swaps. In every
 * other case the four stages are stacked, each illustration above its copy.
 */
export function S01Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="doc-section"
      data-section="01"
    >
      <div className="section-pad">
        <SectionHeader code="01" title="CAPABILITIES" id="capabilities" />

        <div className="container-doc mt-16 md:mt-24">
          <div className="md:grid-12" data-cap-scene>
            {/* Continuous drawing, desktop */}
            <div className="hidden md:col-span-6 md:block" data-cap-figure>
              <BuildSystemSVG
                stage={4}
                animated
                title="Drawing of a browser becoming a web application, a phone and an AI pipeline"
              />
            </div>

            {/* Stage copy */}
            <div className="md:col-span-5 md:col-start-8" data-cap-copy>
              {capabilities.map((stage) => (
                <article
                  key={stage.id}
                  className="mb-20 last:mb-0 md:mb-24"
                  data-cap-stage={stage.index}
                  aria-labelledby={`cap-${stage.id}-title`}
                >
                  <BuildSystemSVG
                    stage={stage.index as Stage}
                    className="mb-8 md:hidden"
                  />
                  <p className="mono tabular">
                    0{stage.index} / 0{capabilities.length}
                  </p>
                  <h3 id={`cap-${stage.id}-title`} className="type-h3 mt-4">
                    {stage.title}
                  </h3>
                  <p className="body mt-4 text-ink-soft">{stage.body}</p>
                  <p className="mono mt-6 leading-relaxed">
                    {stage.tags.join(" · ")}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Support band: subordinate to the four headline services */}
          <ul className="hairline-t mt-24 md:mt-32" aria-label="Supporting services">
            {support.map((row) => (
              <li
                key={row.title}
                className="hairline-b grid gap-3 py-7 md:grid-cols-12 md:gap-6"
              >
                <h3 className="mono text-ink md:col-span-4">{row.title}</h3>
                <p className="body text-ink-soft md:col-span-7 md:col-start-6">
                  {row.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
