import type { FormOption, SectionMeta } from "@/types/content";

/** The manifest. Section 03 is a breath, not an entry, and is not listed. */
export const sections: SectionMeta[] = [
  { code: "00", id: "index", title: "INDEX", short: "INDEX", inManifest: true },
  {
    code: "01",
    id: "capabilities",
    title: "CAPABILITIES",
    short: "CAPABILITIES",
    inManifest: true,
  },
  { code: "02", id: "work", title: "SELECTED WORK", short: "WORK", inManifest: true },
  {
    code: "03",
    id: "interlude",
    title: "INTERLUDE",
    short: "INTERLUDE",
    inManifest: false,
  },
  { code: "04", id: "process", title: "PROCESS", short: "PROCESS", inManifest: true },
  { code: "05", id: "stack", title: "STACK", short: "STACK", inManifest: true },
  { code: "06", id: "pricing", title: "PRICING", short: "PRICING", inManifest: true },
  { code: "07", id: "studio", title: "STUDIO", short: "STUDIO", inManifest: true },
  { code: "08", id: "ship", title: "SHIP", short: "SHIP", inManifest: true },
];

export const manifest = sections.filter((s) => s.inManifest);

export const hero = {
  eyebrowPrefix: "SHIP4U — DEVELOPMENT STUDIO — ",
  lines: ["FROM IDEA", "TO SHIPPED", "PRODUCT"] as const,
  /** The word in line 1 that rewrites to `rewriteTo` at 55% of hero scroll. */
  rewriteFrom: "IDEA",
  rewriteTo: "PRODUCT",
  body: "We design, build and deploy production-grade web, mobile and AI products. Two engineers, the full lifecycle, no handoffs between agencies.",
  primary: "START A PROJECT",
  secondary: "SEE THE WORK",
  scrollHint: "SCROLL TO BUILD",
  counterLabel: "READY",
};

export const interlude = {
  /** Instrument Serif line one of four. */
  line: "Every product is a machine. We draw it before we build it.",
  caption: "FIG. 01 — SYSTEM GEOMETRY / ORTHOGRAPHIC / DRAG TO ORBIT",
};

export const ship = {
  headline: "LET'S SHIP IT",
  /** Instrument Serif line four of four. */
  line: "Tell us what you are building. We will tell you honestly whether we are the right people to build it.",
  fields: {
    name: "NAME",
    email: "EMAIL",
    brief: "WHAT ARE YOU BUILDING?",
    briefPlaceholder: "A marketplace for equipment rental, web and Android",
    budget: "BUDGET",
    timeline: "TIMELINE",
    submit: "SEND",
  },
  budgetOptions: [
    { value: "under-50k", label: "Under ₹50,000" },
    { value: "50k-150k", label: "₹50,000 – ₹1,50,000" },
    { value: "150k-500k", label: "₹1,50,000 – ₹5,00,000" },
    { value: "above-500k", label: "Above ₹5,00,000" },
    { value: "unsure", label: "Not sure yet" },
  ] satisfies FormOption[],
  timelineOptions: [
    { value: "asap", label: "ASAP" },
    { value: "1-3", label: "1 – 3 months" },
    { value: "3-6", label: "3 – 6 months" },
    { value: "exploring", label: "Exploring" },
  ] satisfies FormOption[],
  errors: {
    name: "NAME IS REQUIRED",
    email: "A VALID EMAIL IS REQUIRED",
    brief: "TELL US WHAT YOU ARE BUILDING",
    budget: "CHOOSE A BUDGET RANGE",
    timeline: "CHOOSE A TIMELINE",
    network: "SEND FAILED. TRY AGAIN, OR EMAIL US DIRECTLY.",
  },
  success: {
    title: "RECEIVED",
    body: "WE READ EVERY ENQUIRY OURSELVES AND REPLY WITHIN TWO WORKING DAYS.",
  },
};
