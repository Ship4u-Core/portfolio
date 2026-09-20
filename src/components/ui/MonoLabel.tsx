import clsx from "clsx";
import type { ElementType, ReactNode } from "react";

interface MonoLabelProps {
  as?: ElementType;
  size?: "s" | "l";
  tone?: "graphite" | "ink" | "signal" | "paper";
  className?: string;
  children: ReactNode;
  id?: string;
}

/**
 * Monospace annotation. Always uppercase, always tracked out, graphite unless
 * it is an active state.
 */
export function MonoLabel({
  as: Tag = "span",
  size = "s",
  tone = "graphite",
  className,
  children,
  id,
}: MonoLabelProps) {
  return (
    <Tag
      id={id}
      className={clsx(
        size === "s" ? "mono" : "mono-l",
        tone === "ink" && "text-ink",
        tone === "signal" && "text-signal-deep",
        tone === "paper" && "text-paper-on-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
