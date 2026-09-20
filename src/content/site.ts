import type { SiteContent } from "@/types/content";

const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site: SiteContent = {
  __placeholder: true,
  name: "SHIP4U",
  legalName: "[[LEGAL_NAME]]",
  location: "[[LOCATION]]",
  email: "[[EMAIL]]",
  url,
  positioning: "From idea to shipped product.",
  title: "Ship4u — Web, Mobile and AI Product Development",
  description:
    "Ship4u is a two-person development studio building production-ready web, mobile and AI products. Architecture through deployment, fixed quotes, no handoffs.",
  profiles: [
    { label: "GITHUB", href: "[[GITHUB_URL]]" },
    { label: "LINKEDIN", href: "[[LINKEDIN_URL]]" },
  ],
  year: 2026,
  colophon:
    "THIS SITE WAS BUILT BY SHIP4U. NEXT.JS · TYPESCRIPT · GSAP · THREE.JS · WEBGL.",
};

/** True when a string still carries an unreplaced placeholder token. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return typeof value === "string" && value.includes("[[");
}
