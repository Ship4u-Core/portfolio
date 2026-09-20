import type { PriceRow } from "@/types/content";

export const pricingHeadline = ["WHAT ARE YOU", "BUILDING?"] as const;

export const currency = "₹";

/** Amounts use Indian digit grouping: 1,00,000 not 100,000. All prices are onwards. */
export const pricing: PriceRow[] = [
  {
    id: "landing",
    service: "Landing page / marketing site",
    amount: "20,000",
    suffix: " onwards",
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
    amount: "1,00,000",
    suffix: " onwards",
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
    amount: "1,10,000",
    suffix: " onwards",
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
    suffix: " onwards",
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
    amount: "25,000",
    suffix: " onwards",
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
    amount: "15,000",
    suffix: "/ month onwards",
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
  "ALL PRICES ARE ONWARDS.",
] as const;
