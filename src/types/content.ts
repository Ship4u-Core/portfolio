/**
 * Content types. Every string rendered on the site comes from a typed object
 * in src/content. Entries that contain provisional values carry
 * `__placeholder: true` and use `[[TOKEN]]` strings; see PLACEHOLDERS.md.
 */

export interface Flagged {
  /** True while the entry still contains provisional content. */
  __placeholder?: boolean;
}

export interface Link {
  label: string;
  href: string;
}

export type SectionCode =
  | "00"
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08";

export type SectionStatus = "READY" | "BUILDING" | "COMPLETE" | "SHIPPED";

export interface SectionMeta {
  code: SectionCode;
  id: string;
  title: string;
  /** Short label used in the manifest rail. */
  short: string;
  /** Whether the section appears in the manifest rail. */
  inManifest: boolean;
}

export interface SiteContent extends Flagged {
  name: string;
  legalName: string;
  location: string;
  email: string;
  url: string;
  positioning: string;
  title: string;
  description: string;
  profiles: Link[];
  year: number;
  /** Final footer line naming the stack. */
  colophon: string;
}

export interface CapabilityStage {
  id: "websites" | "web-apps" | "mobile" | "ai";
  index: number;
  title: string;
  body: string;
  tags: string[];
}

export interface SupportRow {
  title: string;
  body: string;
}

export interface Metric {
  /** Provisional display value, e.g. "—%", "0.0s", "[metric]". */
  display: string;
  label: string;
}

export interface Project extends Flagged {
  code: string;
  name: string;
  year: string;
  duration?: string;
  description: string;
  problem?: string[];
  built?: string[];
  stack: string;
  metrics?: Metric[];
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  /** Null when there is no case study page yet. Rows without href are not links. */
  href: string | null;
}

export type ProcessGlyph =
  | "magnifier"
  | "cube"
  | "grid"
  | "brackets"
  | "check"
  | "chevron"
  | "steps";

export interface ProcessStage {
  index: string;
  name: string;
  line: string;
  glyph: ProcessGlyph;
}

export interface StackNode {
  id: string;
  name: string;
  rationale: string;
}

export interface StackBand {
  id: string;
  label: string;
  nodes: StackNode[];
}

export interface StackEdge {
  from: string;
  to: string;
}

export interface PriceRow {
  id: string;
  service: string;
  /** Formatted with Indian digit grouping, currency symbol excluded. */
  amount: string;
  /** Appended after the amount, e.g. "/ month". */
  suffix?: string;
  included: string[];
  timeline: string;
}

export interface Founder extends Flagged {
  id: string;
  initial: string;
  name: string;
  role: string;
  line: string;
  owns: string;
  background: string;
  writes: string;
  email: string;
  link: Link;
}

export interface FormOption {
  value: string;
  label: string;
}
