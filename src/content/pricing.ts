import type { PriceRow } from "@/types/content";

export const pricingHeadline = ["WHAT ARE YOU", "BUILDING?"] as const;

export const currency = "₹";

/** Amounts use Indian digit grouping: 1,00,000 not 100,000. */
export const pricing: PriceRow[] = [
  {
    id: "landing",
    service: "Landing page / marketing site",
    amount: "20,000",
    included: [
      "Design and build, up to six pages",
      "CMS for copy and images",
      "SEO, analytics and forms",
      "Under two seconds to first paint on mobile",
    ],
    timeline: "2 – 3 weeks",
  },
  {
    id: "web-app",
    service: "Full-stack web application",
    amount: "60,000",
    included: [
      "Architecture and data model",
      "Authentication, roles and admin",
      "Database, API and integrations",
      "Deployed with CI/CD and monitoring",
    ],
    timeline: "6 – 10 weeks",
  },
  {
    id: "ai-app",
    service: "Custom AI application",
    amount: "75,000",
    included: [
      "Use case scoping and an evaluation set",
      "RAG or agent pipeline",
      "Tool use and guardrails",
      "Eval report before launch",
    ],
    timeline: "6 – 10 weeks",
  },
  {
    id: "mobile-app",
    service: "Full-stack mobile application",
    amount: "1,00,000",
    included: [
      "iOS and Android from one codebase",
      "Backend, authentication and push",
      "Offline handling",
      "Store listings and release",
    ],
    timeline: "10 – 14 weeks",
  },
  {
    id: "deployment",
    service: "Deployment & cloud setup",
    amount: "15,000",
    included: [
      "Infrastructure and environments",
      "CI/CD pipeline",
      "Domains, SSL and DNS",
      "Monitoring and alerts, documented",
    ],
    timeline: "1 week",
  },
  {
    id: "maintenance",
    service: "Maintenance & support",
    amount: "10,000",
    suffix: "/ month",
    included: [
      "Fixes and dependency updates",
      "Small features each month",
      "Monitoring and incident response",
      "A short written report each month",
    ],
    timeline: "Rolling, cancel any month",
  },
];

export const pricingLabels = {
  startingFrom: "STARTING FROM",
  included: "INCLUDED",
  timeline: "TYPICAL TIMELINE",
};

export const pricingFootnote = [
  "STARTING PRICES. FINAL QUOTE DEPENDS ON SCOPE, INTEGRATIONS",
  "AND TIMELINE, AND IS FIXED IN WRITING BEFORE WORK BEGINS.",
] as const;
