import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /** Label shown by the crosshair cursor when hovering. */
  cursor?: string;
}

interface AnchorProps extends BaseProps {
  href: string;
  type?: never;
  onClick?: never;
}

interface NativeProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: never;
}

type ButtonProps = AnchorProps | NativeProps;

const base =
  "mono inline-flex items-center justify-center gap-3 select-none transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary:
    "h-12 px-6 radius-doc bg-ink text-paper hover:bg-ink-soft focus-visible:outline-offset-4",
  secondary: "h-12 px-0 text-ink rule-link self-start sm:self-center",
};

/**
 * Two variants only. Primary is a solid ink fill; secondary is text with a
 * bottom rule that draws left to right on hover.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, cursor } = props;
  const classes = clsx(base, variants[variant], className);

  if ("href" in props && props.href) {
    return (
      <a href={props.href} className={classes} data-cursor={cursor}>
        {children}
      </a>
    );
  }

  const { variant: _v, className: _c, children: _ch, cursor: _cu, ...rest } =
    props as NativeProps;
  void _v;
  void _c;
  void _ch;
  void _cu;
  return (
    <button className={classes} data-cursor={cursor} {...rest}>
      {children}
    </button>
  );
}
