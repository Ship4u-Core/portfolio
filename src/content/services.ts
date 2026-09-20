import type { CapabilityStage, SupportRow } from "@/types/content";

export const capabilities: CapabilityStage[] = [
  {
    id: "websites",
    index: 1,
    title: "WEBSITES / LANDING PAGES",
    body: "Fast, indexable marketing sites built to convert. Under two seconds to first paint on a mid-range Android phone, because that is what most of your traffic is using.",
    tags: ["HTML", "SSR", "ANALYTICS", "CMS", "SEO"],
  },
  {
    id: "web-apps",
    index: 2,
    title: "WEB APPLICATIONS",
    body: "Full-stack products with real authentication, real data and real integrations. Frontend, backend, database, APIs. Built to survive actual users rather than a demo.",
    tags: ["AUTH", "DATABASE", "API", "PAYMENTS", "ADMIN"],
  },
  {
    id: "mobile",
    index: 3,
    title: "MOBILE APPLICATIONS",
    body: "Cross-platform apps with the backend that makes them work. Built, signed, submitted, and shipped to both stores.",
    tags: ["IOS", "ANDROID", "PUSH", "OFFLINE", "STORE RELEASE"],
  },
  {
    id: "ai",
    index: 4,
    title: "AI APPLICATIONS",
    body: "Agents, RAG pipelines and LLM features that do something specific and useful. Evaluated against a test set, not judged by how the demo felt.",
    tags: ["AGENTS", "RAG", "EVALS", "TOOL USE", "INTEGRATIONS"],
  },
];

export const support: SupportRow[] = [
  {
    title: "DEPLOYMENT & CLOUD",
    body: "CI/CD, infrastructure, domains, SSL, monitoring. Set up once, correctly, so it stops being your problem.",
  },
  {
    title: "MAINTENANCE & SUPPORT",
    body: "Ongoing development, fixes and new features. We stay on after launch.",
  },
];
