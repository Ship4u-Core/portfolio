import { availability, founderLabels, founders, studioIntro } from "@/content/studio";
import { isPlaceholder } from "@/content/site";
import type { Founder } from "@/types/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Placeholder } from "@/components/ui/Placeholder";

function P({ children, className }: { children: string; className?: string }) {
  return (
    <Placeholder off={!isPlaceholder(children)} className={className}>
      {children}
    </Placeholder>
  );
}

/** Renders a real link only when the href is real; never a dead link. */
function SafeLink({ href, label, mailto = false }: { href: string; label: string; mailto?: boolean }) {
  if (isPlaceholder(href) || isPlaceholder(label)) {
    return (
      <Placeholder>
        <span className="text-ink">{label}</span>
      </Placeholder>
    );
  }
  return (
    <a
      href={mailto ? `mailto:${href}` : href}
      className="rule-link text-ink"
      data-cursor="OPEN"
      rel={mailto ? undefined : "noopener"}
      target={mailto ? undefined : "_blank"}
    >
      {label}
    </a>
  );
}

/**
 * 07 STUDIO. Two named founders, no photographs. Each gets a spec block that
 * reads like a component in the same drawn document.
 */
export function S07Studio() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-title"
      className="doc-section"
      data-section="07"
    >
      <div className="section-pad">
        <SectionHeader code="07" title="STUDIO" id="studio" />

        <div className="container-doc mt-16 md:mt-24">
          <p className="body-l text-ink-soft md:max-w-[62ch]">{studioIntro}</p>

          <div className="mt-20 grid gap-16 md:mt-28 md:grid-cols-2 md:gap-0" data-founders>
            {founders.map((founder, i) => (
              <FounderBlock
                key={founder.id}
                founder={founder}
                divided={i === 1}
              />
            ))}
          </div>

          <p className="mono hairline-t mt-20 pt-6 md:mt-28">
            {availability.label}{" "}
            <P className="text-ink">{availability.value}</P>
          </p>
        </div>
      </div>
    </section>
  );
}

function FounderBlock({ founder, divided }: { founder: Founder; divided: boolean }) {
  return (
    <article
      aria-labelledby={`${founder.id}-name`}
      className={
        divided
          ? "relative overflow-hidden pt-4 md:border-l md:border-rule md:pl-12"
          : "relative overflow-hidden pt-4 md:pr-12"
      }
      data-founder
    >
      <span aria-hidden="true" className="founder-initial">
        {founder.initial}
      </span>

      <div className="relative">
        <h3 id={`${founder.id}-name`} className="type-h2">
          <P>{founder.name}</P>
        </h3>
        <p className="mono mt-4">
          <P>{founder.role}</P>
        </p>

        {/* Instrument Serif italic: uses two and three of four */}
        <p className="serif-body-l mt-10 max-w-[38ch] text-ink">
          <P>{founder.line}</P>
        </p>

        <dl className="hairline-t mt-10">
          {(
            [
              [founderLabels.owns, founder.owns],
              [founderLabels.background, founder.background],
              [founderLabels.writes, founder.writes],
            ] as const
          ).map(([label, value]) => (
            <div
              key={label}
              className="hairline-b grid grid-cols-[112px_1fr] gap-6 py-4"
            >
              <dt className="mono pt-1">{label}</dt>
              <dd className="body text-[15px] text-ink-soft">
                <P>{value}</P>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mono mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <SafeLink href={founder.email} label={founder.email} mailto />
          <SafeLink href={founder.link.href} label={founder.link.label} />
        </p>
      </div>
    </article>
  );
}
