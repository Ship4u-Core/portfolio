import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { site } from "@/content/site";

export const alt = "Ship4u. From idea to shipped product.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Tokens mirrored from globals.css; satori cannot read CSS custom properties. */
const PAPER = "#f5f3ee";
const INK = "#111110";
const GRAPHITE = "#6e6b64";
const RULE = "#dcd8cf";
const SIGNAL = "#e2401c";

async function loadFont(rel: string) {
  try {
    const file = path.join(process.cwd(), "node_modules", "geist", "dist", "fonts", rel);
    return await readFile(file);
  } catch {
    return null; // System fallback: satori's bundled sans.
  }
}

/**
 * 1200 x 630. Paper, the wordmark with the accent 4 at large size, the
 * positioning line beneath in Geist Mono, a hairline border inset 32px.
 * No photography, no gradient.
 */
export default async function OpenGraphImage() {
  const [sans, mono] = await Promise.all([
    loadFont("geist-sans/Geist-Bold.ttf"),
    loadFont("geist-mono/GeistMono-Regular.ttf"),
  ]);

  const fonts = [
    sans ? { name: "Geist", data: sans, weight: 700 as const, style: "normal" as const } : null,
    mono ? { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          padding: 32,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `1px solid ${RULE}`,
            padding: 72,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: mono ? "Geist Mono" : "monospace",
              fontSize: 20,
              letterSpacing: "0.14em",
              color: GRAPHITE,
            }}
          >
            <span>00 / INDEX</span>
            <span>WEB · MOBILE · AI</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: sans ? "Geist" : "sans-serif",
                fontWeight: 700,
                fontSize: 208,
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
                color: INK,
              }}
            >
              <span>SHIP</span>
              <span style={{ color: SIGNAL }}>4</span>
              <span>U</span>
            </div>
            <div
              style={{
                marginTop: 44,
                fontFamily: mono ? "Geist Mono" : "monospace",
                fontSize: 26,
                letterSpacing: "0.14em",
                color: INK,
              }}
            >
              {site.positioning.toUpperCase()}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: mono ? "Geist Mono" : "monospace",
              fontSize: 20,
              letterSpacing: "0.14em",
              color: GRAPHITE,
            }}
          >
            <span>ARCHITECTURE THROUGH DEPLOYMENT</span>
            <span>{site.url.replace(/^https?:\/\//, "").toUpperCase()}</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
