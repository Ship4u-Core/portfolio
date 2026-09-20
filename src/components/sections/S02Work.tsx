import Image from "next/image";
import clsx from "clsx";
import { heroProject, supportingProjects, workLabels } from "@/content/work";
import { isPlaceholder } from "@/content/site";
import type { Project } from "@/types/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Placeholder } from "@/components/ui/Placeholder";
import { DigitRoll } from "@/components/ui/DigitRoll";
import { RegistrationCross } from "@/components/ui/Icons";
import { WorkScene } from "./WorkScene";

function P({ children, className }: { children: string; className?: string }) {
  return (
    <Placeholder off={!isPlaceholder(children)} className={className}>
      {children}
    </Placeholder>
  );
}

/**
 * 02 SELECTED WORK. One hero case study with the zoom treatment, then two
 * supporting projects as editorial rows. All content provisional.
 */
export function S02Work() {
  return (
    <WorkScene>
      <section
        id="work"
        aria-labelledby="work-title"
        className="doc-section"
        data-section="02"
      >
        <div className="section-pad">
          <SectionHeader code="02" title="SELECTED WORK" id="work" />

          <div className="container-doc mt-16 md:mt-24">
            <HeroCaseStudy project={heroProject} />

            <ul className="hairline-t mt-24 md:mt-32" data-work-rows>
              {supportingProjects.map((project) => (
                <li key={project.code} className="hairline-b">
                  <WorkRow project={project} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </WorkScene>
  );
}

function HeroCaseStudy({ project }: { project: Project }) {
  return (
    <article aria-labelledby="work-hero-name" data-work-hero>
      <div data-work-stage>
        {/* Figure with registration frame */}
        <figure className="relative" data-work-figure>
          <div className="relative" data-work-frame>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border border-rule"
              data-work-frame-rule
            />
            <RegistrationCross
              className="absolute -left-1.5 -top-1.5 text-ink"
              data-work-cross
            />
            <RegistrationCross
              className="absolute -right-1.5 -top-1.5 text-ink"
              data-work-cross
            />
            <RegistrationCross
              className="absolute -bottom-1.5 -left-1.5 text-ink"
              data-work-cross
            />
            <RegistrationCross
              className="absolute -bottom-1.5 -right-1.5 text-ink"
              data-work-cross
            />
            <Image
              src={project.image.src}
              width={project.image.width}
              height={project.image.height}
              alt={project.image.alt}
              priority
              unoptimized={project.image.src.endsWith(".svg")}
              sizes="(min-width: 1440px) 1296px, 100vw"
              className="h-auto w-full"
              data-work-image
            />
            {/* Browser chrome frame drawn over the image at full-bleed */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0"
              data-work-chrome
            >
              <div className="absolute left-0 right-0 top-0 h-8 border-b border-ink" />
              <div className="absolute left-3 top-2.5 h-3 w-3 border border-ink" />
              <div className="absolute left-8 top-2.5 h-3 w-3 border border-ink" />
              <div className="absolute left-13 top-2.5 h-3 w-3 border border-ink" />
              <div className="absolute left-20 right-3 top-2.5 h-3 border border-ink" />
            </div>
          </div>

          {/* Corner annotations */}
          <figcaption
            className="mono mt-3 flex flex-wrap justify-between gap-x-6 gap-y-2"
            data-work-annotations
          >
            <span>{project.code}</span>
            <span>
              <P>{project.year}</P>
            </span>
            <span>
              <P>{project.duration ?? ""}</P>
            </span>
          </figcaption>
        </figure>

        {/* Name over the image at 30-55%; stacked beneath it otherwise */}
        <h3 id="work-hero-name" className="display-l mt-10" data-work-name>
          <P>{project.name}</P>
        </h3>

        {/* Breakdown */}
        <div className="mt-6 grid gap-10 md:grid-cols-3" data-work-breakdown>
          <p className="body text-ink-soft md:col-span-3" data-work-desc>
            <P>{project.description}</P>
          </p>
          <div>
            <p className="mono">{workLabels.problem}</p>
            <ul className="body mt-4 text-[15px] text-ink-soft">
              {project.problem?.map((line) => (
                <li key={line}>
                  <P>{line}</P>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono">{workLabels.built}</p>
            <ul className="body mt-4 text-[15px] text-ink-soft">
              {project.built?.map((line) => (
                <li key={line}>
                  <P>{line}</P>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono">{workLabels.stack}</p>
            <p className="mono-l mt-4 leading-relaxed text-ink">
              <P>{project.stack}</P>
            </p>
          </div>
        </div>

        {/* Metrics: provisional values, never plausible-looking specifics */}
        <dl
          className="hairline-t mt-14 grid gap-10 pt-10 sm:grid-cols-3"
          data-work-metrics
        >
          {project.metrics?.map((metric) => (
            <div key={metric.label}>
              <dd className="price text-ink">
                <DigitRoll value={metric.display} trigger="event" />
              </dd>
              <dt className="mono mt-3">
                <P>{metric.label}</P>
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function WorkRow({ project }: { project: Project }) {
  const interactive = Boolean(project.href);
  const Wrapper = interactive ? "a" : "div";

  return (
    <Wrapper
      href={project.href ?? undefined}
      className={clsx(
        "relative grid grid-cols-[72px_1fr] items-center gap-x-5 gap-y-3 py-6 md:h-40 md:grid-cols-12 md:gap-6 md:py-0",
        interactive && "group",
      )}
      data-cursor={interactive ? "OPEN" : undefined}
      data-work-row
      data-interactive={interactive ? "" : undefined}
    >
      {/* Permanent thumbnail below 768px */}
      <Image
        src={project.image.src}
        width={project.image.width}
        height={project.image.height}
        alt=""
        unoptimized={project.image.src.endsWith(".svg")}
        sizes="72px"
        className="row-span-2 h-auto w-[72px] border border-rule md:hidden"
      />
      <span className="mono md:col-span-1">{project.code}</span>
      <div className="col-start-2 md:col-span-6 md:col-start-2">
        <h3 className="type-h2">
          <P>{project.name}</P>
        </h3>
        <p className="body mt-2 text-[15px] text-ink-soft">
          <P>{project.description}</P>
        </p>
      </div>
      <p className="mono col-start-2 leading-relaxed md:col-span-3 md:col-start-8">
        <P>{project.stack}</P>
      </p>
      <p className="mono col-start-2 md:col-span-2 md:col-start-11 md:text-right">
        <P>{project.year}</P>
      </p>
      {interactive ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-1/2 hidden w-[320px] -translate-y-1/2 md:block"
          data-work-preview
        >
          <Image
            src={project.image.src}
            width={project.image.width}
            height={project.image.height}
            alt=""
            unoptimized={project.image.src.endsWith(".svg")}
            sizes="320px"
            className="h-auto w-full border border-rule"
          />
        </span>
      ) : null}
    </Wrapper>
  );
}
