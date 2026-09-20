import type { ProcessGlyph } from "@/types/content";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

const paths: Record<ProcessGlyph, string[]> = {
  // Magnifier with a square field
  magnifier: ["M4 4H20V20H4Z", "M20 20L28 28", "M8 8H16V16H8Z"],
  // Orthographic cube
  cube: [
    "M6 11L16 5L26 11V21L16 27L6 21Z",
    "M6 11L16 17L26 11",
    "M16 17V27",
  ],
  // Grid with one highlighted cell
  grid: [
    "M4 4H28V28H4Z",
    "M12 4V28M20 4V28M4 12H28M4 20H28",
    "M12 12H20V20H12Z",
  ],
  // Bracket pair
  brackets: ["M12 4H6V28H12", "M20 4H26V28H20", "M13 16H19"],
  // Check inside a frame
  check: ["M4 4H28V28H4Z", "M9 16L14 21L23 11"],
  // Upward chevron over a plane
  chevron: ["M6 26H26", "M8 16L16 8L24 16", "M16 8V22"],
  // Stepped bar
  steps: ["M4 28V22H10V16H16V10H22V4H28", "M4 28H28"],
};

interface GlyphProps {
  glyph: ProcessGlyph;
  size?: number;
  className?: string;
}

/** Seven single-stroke glyphs, one per process stage. 32-unit grid. */
export function ProcessGlyphIcon({ glyph, size = 32, className }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[glyph].map((d, i) => (
        <path key={i} d={d} {...stroke} data-glyph-path />
      ))}
    </svg>
  );
}
