import { process } from "@/content/process";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProcessGlyphIcon } from "@/components/scenes/ProcessGlyphs";

/**
 * 04 PROCESS. Seven stages on one hairline. Vertical list by default;
 * a horizontal track driven by vertical scroll on desktop with motion.
 */
export function S04Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="doc-section"
      data-section="04"
    >
      <div className="section-pad" data-process-pin>
        <SectionHeader code="04" title="PROCESS" id="process" />

        <div className="container-doc mt-16 md:mt-24">
          <div className="process-track" data-process-track>
            <div className="process-line" aria-hidden="true" data-process-line />
            <div className="process-dot" aria-hidden="true" data-process-dot />

            <ol className="process-stages" data-process-stages>
              {process.map((stage) => (
                <li
                  key={stage.index}
                  className="process-stage"
                  data-process-stage={stage.index}
                >
                  <ProcessGlyphIcon
                    glyph={stage.glyph}
                    className="process-glyph text-ink"
                  />
                  <p className="mono process-index mt-6 tabular">{stage.index}</p>
                  <h3 className="type-h3 mt-2">{stage.name}</h3>
                  <p className="body mt-3 max-w-[34ch] text-ink-soft">{stage.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
