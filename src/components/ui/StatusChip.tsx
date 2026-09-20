"use client";

import clsx from "clsx";
import type { SectionCode, SectionStatus } from "@/types/content";
import { statusFor, useSectionState } from "@/lib/sectionStore";

interface StatusChipProps {
  code: SectionCode;
  fallback: SectionStatus;
  tone?: "paper" | "ink";
  className?: string;
}

/**
 * Section status in mono brackets, driven by the section store: READY until
 * the section is reached, BUILDING while it owns the viewport, COMPLETE once
 * passed. Section 08 reads SHIPPED. Colour changes only; no motion.
 */
export function StatusChip({
  code,
  fallback,
  tone = "paper",
  className,
}: StatusChipProps) {
  const state = useSectionState();
  const status = statusFor(code, state, fallback);
  const active = status === "BUILDING" || status === "SHIPPED";

  return (
    <span
      className={clsx(
        "mono whitespace-nowrap transition-colors duration-200",
        tone === "ink" && "text-paper-on-ink",
        active && (tone === "ink" ? "text-signal" : "text-signal-deep"),
        className,
      )}
      data-status-for={code}
      data-status={status}
    >
      <span aria-hidden="true">[ </span>
      <span data-status-text>{status}</span>
      <span aria-hidden="true"> ]</span>
    </span>
  );
}
