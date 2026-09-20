import clsx from "clsx";
import type { SectionCode, SectionStatus } from "@/types/content";
import { StatusChip } from "@/components/ui/StatusChip";

interface SectionHeaderProps {
  code: SectionCode;
  title: string;
  /** Section element id; the heading gets `${id}-title`. */
  id: string;
  /** Static fallback status; live status is driven by the section store. */
  status?: SectionStatus;
  tone?: "paper" | "ink";
  className?: string;
}

/**
 * Every numbered section opens with this: mono code, title and status on one
 * line above a full-width hairline.
 */
export function SectionHeader({
  code,
  title,
  id,
  status = "READY",
  tone = "paper",
  className,
}: SectionHeaderProps) {
  return (
    <div className={clsx("container-doc", className)}>
      <div className="flex items-baseline justify-between gap-6 pb-3">
        <h2
          id={`${id}-title`}
          className={clsx(
            "mono flex items-baseline gap-2",
            tone === "ink" ? "text-paper-on-ink" : "text-ink",
          )}
        >
          <span className={tone === "ink" ? "text-paper-on-ink" : "text-graphite"}>
            {code}
          </span>
          <span aria-hidden="true" className="text-graphite">
            /
          </span>
          <span>{title}</span>
        </h2>
        <StatusChip code={code} fallback={status} tone={tone} />
      </div>
      <hr
        className={clsx(tone === "ink" && "border-rule-on-ink")}
        aria-hidden="true"
      />
    </div>
  );
}
