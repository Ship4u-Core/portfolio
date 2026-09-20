import clsx from "clsx";
import type { SectionCode, SectionStatus } from "@/types/content";

interface StatusChipProps {
  code: SectionCode;
  fallback: SectionStatus;
  tone?: "paper" | "ink";
  className?: string;
}

/**
 * Section status in mono brackets. Server renders the fallback; the section
 * store (Phase 2) updates `data-status` and the text as the visitor scrolls.
 */
export function StatusChip({
  code,
  fallback,
  tone = "paper",
  className,
}: StatusChipProps) {
  return (
    <span
      className={clsx(
        "mono whitespace-nowrap",
        tone === "ink" && "text-paper-on-ink",
        className,
      )}
      data-status-for={code}
      data-status={fallback}
    >
      <span aria-hidden="true">[ </span>
      <span data-status-text>{fallback}</span>
      <span aria-hidden="true"> ]</span>
    </span>
  );
}
