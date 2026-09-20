import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { Grain } from "@/components/chrome/Grain";
import { GridOverlay } from "@/components/chrome/GridOverlay";
import { ScrollProvider } from "@/components/chrome/ScrollProvider";
import { ProgressRail } from "@/components/chrome/ProgressRail";
import { ManifestRail } from "@/components/chrome/ManifestRail";
import { Cursor } from "@/components/chrome/Cursor";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Ship4u",
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F3EE",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Marks the document as JS-capable so that CSS may
 * apply pre-animation states, and mirrors the reduced-motion preference onto
 * <html> so both CSS and GSAP read the same flag. Without this script, the
 * document renders in its final, complete state.
 */
const gateScript = `(function(d){var c=d.documentElement.classList;c.add("js");if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){c.add("reduce")}})(document);`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: gateScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link mono text-paper">
          Skip to content
        </a>
        <ScrollProvider>
          <ProgressRail />
          {children}
          <ManifestRail />
          <Cursor />
        </ScrollProvider>
        <Grain />
        <GridOverlay />
      </body>
    </html>
  );
}
