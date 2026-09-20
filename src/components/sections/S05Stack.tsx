import { stack, stackIntro, stackIntroMobile } from "@/content/stack";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StackSchematic } from "@/components/scenes/StackSchematic";
import { Plus } from "@/components/ui/Icons";
import { StackScene } from "./StackScene";

/**
 * 05 STACK. A technical schematic, not a logo wall. Below 768px the diagram
 * is replaced with five grouped mono lists; tapping a row expands its
 * rationale (native details, no JavaScript required).
 */
export function S05Stack() {
  return (
    <StackScene>
      <section
        id="stack"
        aria-labelledby="stack-title"
        className="doc-section"
        data-section="05"
      >
        <div className="section-pad">
          <SectionHeader code="05" title="STACK" id="stack" />

          <div className="container-doc mt-16 md:mt-24">
            {/* Desktop: schematic */}
            <div className="hidden md:block">
              <p className="body text-ink-soft">{stackIntro}</p>
              <div className="relative mt-14" data-stack-wrap>
                <StackSchematic className="mx-auto h-auto w-full max-w-[1100px]" />
                <div
                  className="mono pointer-events-none absolute left-0 top-0 z-10 max-w-[38ch] border border-rule bg-paper-raised px-3 py-2 normal-case leading-relaxed tracking-normal text-ink"
                  style={{ fontSize: 12, letterSpacing: 0 }}
                  aria-hidden="true"
                  hidden
                  data-stack-tooltip
                />
              </div>
            </div>

            {/* Mobile: grouped lists */}
            <div className="md:hidden">
              <p className="body text-ink-soft">{stackIntroMobile}</p>
              {stack.map((band) => (
                <div key={band.id} className="hairline-t mt-10 pt-4">
                  <h3 className="mono">{band.label}</h3>
                  <ul className="mt-2">
                    {band.nodes.map((node) => (
                      <li key={node.id} className="hairline-b">
                        <details className="group">
                          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-3 [&::-webkit-details-marker]:hidden">
                            <span className="font-mono text-[15px] tracking-wide">
                              {node.name}
                            </span>
                            <Plus className="text-graphite transition-transform duration-200 group-open:rotate-45" />
                          </summary>
                          <p className="body pb-4 text-[15px] text-ink-soft">
                            {node.rationale}
                          </p>
                        </details>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </StackScene>
  );
}
