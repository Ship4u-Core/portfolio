import type { Project } from "@/types/content";

/**
 * PLACEHOLDER CASE STUDIES.
 *
 * Every entry here is provisional. Metric values are deliberately blank
 * (spec 11.4): a number that looks real will end up in production, a
 * visible blank will not. Replace the tokens, then remove `__placeholder`.
 */

export const heroProject: Project = {
  __placeholder: true,
  code: "W-01",
  name: "[[WORK_1_NAME]]",
  year: "[[WORK_1_YEAR]]",
  duration: "[[WORK_1_DURATION]]",
  description: "[[WORK_1_DESCRIPTION]]",
  problem: ["[[WORK_1_PROBLEM]]"],
  built: ["[[WORK_1_BUILT]]"],
  stack: "[[WORK_1_STACK]]",
  metrics: [
    { display: "—%", label: "[[WORK_1_METRIC_1]]" },
    { display: "0.0s", label: "[[WORK_1_METRIC_2]]" },
    { display: "[metric]", label: "[[WORK_1_METRIC_3]]" },
  ],
  image: {
    src: "/work/placeholder-01.svg",
    width: 1600,
    height: 1000,
    alt: "Placeholder frame for the hero case study. Replace before launch.",
  },
  href: null,
};

export const supportingProjects: Project[] = [
  {
    __placeholder: true,
    code: "W-02",
    name: "[[WORK_2_NAME]]",
    year: "[[WORK_2_YEAR]]",
    description: "[[WORK_2_DESCRIPTION]]",
    stack: "[[WORK_2_STACK]]",
    image: {
      src: "/work/placeholder-02.svg",
      width: 1600,
      height: 1000,
      alt: "Placeholder frame for the second project. Replace before launch.",
    },
    href: null,
  },
  {
    __placeholder: true,
    code: "W-03",
    name: "[[WORK_3_NAME]]",
    year: "[[WORK_3_YEAR]]",
    description: "[[WORK_3_DESCRIPTION]]",
    stack: "[[WORK_3_STACK]]",
    image: {
      src: "/work/placeholder-03.svg",
      width: 1600,
      height: 1000,
      alt: "Placeholder frame for the third project. Replace before launch.",
    },
    href: null,
  },
];

export const workLabels = {
  problem: "THE PROBLEM",
  built: "WHAT WE BUILT",
  stack: "STACK",
  results: "RESULTS",
};
