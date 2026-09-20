import type { Founder } from "@/types/content";

/**
 * PLACEHOLDER FOUNDER DATA. Replace every token, then remove `__placeholder`.
 * The `line` values are Instrument Serif uses two and three of four; keep each
 * to one sentence in the first person.
 */

export const studioIntro =
  "Ship4u is two engineers. That is the entire company, deliberately. You talk to the people writing the code, decisions take hours rather than weeks, and nothing is handed to a junior you were never introduced to. It also means we take on a limited number of projects at a time, and we will tell you honestly if yours is not one we should take.";

export const founders: Founder[] = [
  {
    __placeholder: true,
    id: "founder-a",
    initial: "A",
    name: "[[FOUNDER_A_NAME]]",
    role: "[[FOUNDER_A_ROLE]]",
    line: "[[FOUNDER_A_LINE]]",
    owns: "[[FOUNDER_A_OWNS]]",
    background: "[[FOUNDER_A_BACKGROUND]]",
    writes: "[[FOUNDER_A_WRITES]]",
    email: "[[FOUNDER_A_EMAIL]]",
    link: { label: "[[FOUNDER_A_LINK_LABEL]]", href: "[[FOUNDER_A_LINK]]" },
  },
  {
    __placeholder: true,
    id: "founder-b",
    initial: "B",
    name: "[[FOUNDER_B_NAME]]",
    role: "[[FOUNDER_B_ROLE]]",
    line: "[[FOUNDER_B_LINE]]",
    owns: "[[FOUNDER_B_OWNS]]",
    background: "[[FOUNDER_B_BACKGROUND]]",
    writes: "[[FOUNDER_B_WRITES]]",
    email: "[[FOUNDER_B_EMAIL]]",
    link: { label: "[[FOUNDER_B_LINK_LABEL]]", href: "[[FOUNDER_B_LINK]]" },
  },
];

export const founderLabels = {
  owns: "OWNS",
  background: "BACKGROUND",
  writes: "WRITES",
};

export const availability = {
  __placeholder: true,
  label: "CURRENT AVAILABILITY —",
  value: "[[AVAILABILITY]]",
};
