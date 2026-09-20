import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

const isDev = process.env.NODE_ENV === "development";

interface PlaceholderProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Set when the wrapped value is real content; renders plain in all envs. */
  off?: boolean;
}

/**
 * Wraps a provisional value. In development it is outlined with a dashed
 * accent rule and tagged PLACEHOLDER. In production it renders the child
 * plain, with no outline.
 */
export function Placeholder({
  as: Tag = "span",
  className,
  children,
  off = false,
}: PlaceholderProps) {
  if (!isDev || off) {
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <Tag
      className={clsx("relative", className)}
      style={{ outline: "1px dashed var(--signal)", outlineOffset: 3 }}
      data-placeholder=""
    >
      {children}
      <span
        aria-hidden="true"
        className="mono pointer-events-none absolute -top-4 right-0 text-[8px] text-signal-deep"
        style={{ letterSpacing: "0.12em" }}
      >
        PLACEHOLDER
      </span>
    </Tag>
  );
}
