import type { SVGProps } from "react";

/**
 * Hand-authored single-stroke icons. 1.25px, currentColor, square caps.
 * Square caps read as technical drawing; round caps read as consumer app.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function ArrowDown({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M8 1.5V14M3 9.5L8 14.5L13 9.5" {...stroke} />
    </svg>
  );
}

export function ArrowRight({ size = 16, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M1.5 8H14M9.5 3L14.5 8L9.5 13" {...stroke} />
    </svg>
  );
}

export function Tick({ size = 12, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M1.5 6.5L4.5 9.5L10.5 2.5" {...stroke} data-tick-path />
    </svg>
  );
}

export function RegistrationCross({ size = 12, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M6 0V12M0 6H12" {...stroke} />
      <circle cx="6" cy="6" r="3.5" {...stroke} />
    </svg>
  );
}

/** The wordmark's 4, usable standalone as an ornament or affordance. */
export function FourMark({ size = 14, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 16"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M10 15.5V0.5L1 10.5H13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function Cross({ size = 12, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5" {...stroke} />
    </svg>
  );
}

export function Plus({ size = 12, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M6 1V11M1 6H11" {...stroke} />
    </svg>
  );
}
