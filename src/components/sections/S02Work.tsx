import Image from "next/image";
import clsx from "clsx";
import { heroProject, supportingProjects, workLabels } from "@/content/work";
import { isPlaceholder } from "@/content/site";
import type { Project } from "@/types/content";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Placeholder } from "@/components/ui/Placeholder";
import { ArrowRight, RegistrationCross } from "@/components/ui/Icons";
import { WorkScene } from "./WorkScene";

function P({ children, className }: { children: string; className?: string }) {
  return (
    <Placeholder off={!isPlaceholder(children)} className={className}>
      {children}
    </Placeholder>
  );
}

/**
 * 02 SELECTED WORK. One featured case study in static document layout, then
 * two supporting projects as editorial rows.
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
  const openHref =
    project.href && !isPlaceholder(project.href) ? project.href : null;

  return (
    <article aria-labelledby="work-hero-name">
      <header className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
        <div className="min-w-0">
          <h3 id="work-hero-name" className="display-l">
            <P>{project.name}</P>
          </h3>
        </div>
        <div className="flex shrink-0 flex-col gap-5 md:max-w-[36ch] md:items-end md:text-right">
          <p className="mono flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
            <span>{project.code}</span>
            <span>
              <P>{project.year}</P>
            </span>
            {project.duration ? (
              <span>
                <P>{project.duration}</P>
              </span>
            ) : null}
          </p>
          <p className="body text-[15px] text-ink-soft">
            <P>{project.description}</P>
          </p>
          {openHref ? (
            <a
              href={openHref}
              className="rule-link mono inline-flex items-center gap-3 self-start text-ink md:self-end"
              data-cursor="OPEN"
              rel="noopener noreferrer"
              target="_blank"
            >
              OPEN
              <ArrowRight />
            </a>
          ) : null}
        </div>
      </header>

      <figure className="relative mt-10 md:mt-14">
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border border-rule"
          />
          <RegistrationCross className="absolute -left-1.5 -top-1.5 text-ink" />
          <RegistrationCross className="absolute -right-1.5 -top-1.5 text-ink" />
          <RegistrationCross className="absolute -bottom-1.5 -left-1.5 text-ink" />
          <RegistrationCross className="absolute -bottom-1.5 -right-1.5 text-ink" />
          <Image
            src={project.image.src}
            width={project.image.width}
            height={project.image.height}
            alt={project.image.alt}
            priority
            unoptimized={project.image.src.endsWith(".svg")}
            sizes="(min-width: 1440px) 1296px, 100vw"
            className="h-auto w-full"
          />
        </div>
      </figure>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3">
        {project.problem?.length ? (
          <div>
            <p className="mono">{workLabels.problem}</p>
            <ul className="body mt-4 space-y-3 text-[15px] text-ink-soft">
              {project.problem.map((line) => (
                <li key={line}>
                  <P>{line}</P>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {project.built?.length ? (
          <div>
            <p className="mono">{workLabels.built}</p>
            <ul className="body mt-4 space-y-3 text-[15px] text-ink-soft">
              {project.built.map((line) => (
                <li key={line}>
                  <P>{line}</P>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div>
          <p className="mono">{workLabels.stack}</p>
          <p className="mono-l mt-4 leading-relaxed text-ink">
            <P>{project.stack}</P>
          </p>
        </div>
      </div>

      {project.metrics?.length ? (
        <dl className="hairline-t mt-14 grid gap-10 pt-10 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <dd className="price text-ink">
                <P>{metric.display}</P>
              </dd>
              <dt className="mono mt-3">
                <P>{metric.label}</P>
              </dt>
            </div>
          ))}
        </dl>
      ) : null}
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
