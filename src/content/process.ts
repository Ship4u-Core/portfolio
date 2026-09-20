import type { ProcessStage } from "@/types/content";

/**
 * Seven stages. The client's original first stage was IDEA, which belongs to
 * the client, not to Ship4u. It is replaced with DESIGN, which is work Ship4u
 * actually performs and charges for.
 */
export const process: ProcessStage[] = [
  {
    index: "01",
    name: "DISCOVER",
    line: "We work out what you are actually building and what it has to do on day one.",
    glyph: "magnifier",
  },
  {
    index: "02",
    name: "ARCHITECT",
    line: "Data model, services, integrations, hosting. Decided before a line is written.",
    glyph: "cube",
  },
  {
    index: "03",
    name: "DESIGN",
    line: "Interface and flows, designed against the real data, not against a mood board.",
    glyph: "grid",
  },
  {
    index: "04",
    name: "BUILD",
    line: "Weekly deployed builds you can open. No three-week silences.",
    glyph: "brackets",
  },
  {
    index: "05",
    name: "TEST",
    line: "Real devices, real edge cases, real load. Fixes before launch, not after.",
    glyph: "check",
  },
  {
    index: "06",
    name: "DEPLOY",
    line: "Infrastructure, CI/CD, domains, SSL, monitoring. Handed over documented.",
    glyph: "chevron",
  },
  {
    index: "07",
    name: "SCALE",
    line: "Ongoing development as the product and the traffic grow.",
    glyph: "steps",
  },
];
