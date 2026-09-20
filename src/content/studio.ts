import type { Founder } from "@/types/content";

/**
 * The `line` values are Instrument Serif uses two and three of four; keep each
 * to one sentence in the first person.
 */

export const studioIntro =
  "At Ship4u, you work directly with seasoned engineers who design and ship your product end-to-end. You get clear communication, decisions in hours instead of weeks, and nothing is handed off without your knowledge. We take on a limited number of projects to ensure focus, and if a project is not the right fit, we will tell you honestly.";

export const founders: Founder[] = [
  {
    id: "founder-a",
    initial: "L",
    name: "Laksh Krishna Sharma",
    role: "AI ENGINEER · DEVOPS",
    line: "I design the AI pipelines and the cloud they run on, and I keep them cheap enough to stay in production.",
    owns: "Architecture, LLM pipelines, APIs, cloud infrastructure",
    background:
      "AI Engineer at TrustAstrology.ai. Previously AI at Ant Creatives and full-stack at Venumonk. CS at MAIT, Data Science at IIT Madras.",
    writes: "Python, TypeScript, FastAPI, LangGraph, PostgreSQL, Redis, AWS, GCP, Docker",
    email: "laksh@ship4u.in",
    link: { label: "PORTFOLIO", href: "https://laksh-krishna-sharma.vercel.app/" },
  },
  {
    id: "founder-b",
    initial: "R",
    name: "Rupesh Singh Karki",
    role: "AI ENGINEER · FULL STACK",
    line: "I build the product end to end — agents, backends, and the interfaces people actually use.",
    owns: "Multi-agent systems, full-stack product, data workflows",
    background:
      "AI Engineer at TrustAstrology.ai. Previously full-stack at SociolinQ. CS at MAIT.",
    writes: "Python, TypeScript, FastAPI, React, LangGraph, PostgreSQL, MongoDB, Redis, AWS",
    email: "rupesh@ship4u.in",
    link: { label: "PORTFOLIO", href: "https://rupesh-singh-karki.vercel.app/" },
  },
];

export const founderLabels = {
  owns: "OWNS",
  background: "BACKGROUND",
  writes: "WRITES",
};

export const availability = {
  label: "CURRENT AVAILABILITY —",
  value: "AVAILABLE NOW",
};
