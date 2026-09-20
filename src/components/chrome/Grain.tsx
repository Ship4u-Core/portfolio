/**
 * Fixed paper grain. A single inline feTurbulence rendered over the whole
 * document at very low opacity. Not animated, ever.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ opacity: 0.035, mixBlendMode: "multiply" }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="ship4u-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ship4u-grain)" />
      </svg>
    </div>
  );
}

/**
 * Local grain for the inverted pricing band. Uses screen blending so the
 * texture survives the dark stock. Positioned absolutely inside the section.
 */
export function GrainOnInk() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={{ opacity: 0.05, mixBlendMode: "screen" }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="ship4u-grain-ink">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ship4u-grain-ink)" />
      </svg>
    </div>
  );
}
