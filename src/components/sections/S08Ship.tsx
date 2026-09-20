import { ship } from "@/content/sections";
import { isPlaceholder, site } from "@/content/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Placeholder } from "@/components/ui/Placeholder";
import { EnquiryForm } from "@/components/sections/EnquiryForm";

function P({ children }: { children: string }) {
  return <Placeholder off={!isPlaceholder(children)}>{children}</Placeholder>;
}

/**
 * 08 SHIP. Closing headline, the only lead capture on the site, and the
 * commercial point of the whole build.
 */
export function S08Ship() {
  return (
    <section
      id="ship"
      aria-labelledby="ship-title"
      className="doc-section"
      data-section="08"
    >
      <div className="section-pad">
        <SectionHeader code="08" title="SHIP" id="ship" />

        <div className="container-doc mt-16 md:mt-24">
          {/* The one deliberate exception to the no-centred-type rule */}
          <p className="ship-display display-xl text-center" data-ship-headline>
            <span className="inline-block" data-reveal-line>
              {ship.headline}
              <span className="text-signal">.</span>
            </span>
          </p>

          <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-12 md:gap-6">
            {/* Instrument Serif italic: use four of four */}
            <p className="serif-h3 text-ink md:col-span-5" data-ship-line>
              {ship.line}
            </p>
            <div className="md:col-span-6 md:col-start-7">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Footer. Mono throughout, hairline top border. Rendered after <main>. */
export function SiteFooter() {
  const profiles = site.profiles.slice(0, 2);
  return (
    <footer className="hairline-t" data-footer>
      <div className="container-doc mono grid gap-4 py-8 md:grid-cols-3 md:items-baseline">
        <p className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="text-ink">{site.name}</span>
          <span aria-hidden="true">·</span>
          <P>{site.legalName}</P>
          <span aria-hidden="true">·</span>
          <P>{site.location}</P>
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-1 md:justify-center">
          {isPlaceholder(site.email) ? (
            <P>{site.email}</P>
          ) : (
            <a href={`mailto:${site.email}`} className="rule-link text-ink" data-cursor="SEND">
              {site.email}
            </a>
          )}
          {profiles.map((profile) =>
            isPlaceholder(profile.href) ? (
              <Placeholder key={profile.label}>{profile.label}</Placeholder>
            ) : (
              <a
                key={profile.label}
                href={profile.href}
                className="rule-link text-ink"
                target="_blank"
                rel="noopener"
                data-cursor="OPEN"
              >
                {profile.label}
              </a>
            ),
          )}
        </p>
        <p className="md:text-right">
          <span aria-hidden="true">© </span>
          <span className="sr-only">Copyright </span>
          {site.year}
        </p>
      </div>
      <div className="container-doc pb-8">
        {/* The whole strategy in one sentence. Do not omit. */}
        <p className="mono leading-relaxed">{site.colophon}</p>
      </div>
    </footer>
  );
}
