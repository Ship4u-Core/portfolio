import type { StackBand, StackEdge } from "@/types/content";

/**
 * The schematic. Each node carries one real, specific line on why Ship4u
 * uses it. Generic filler here defeats the purpose of the section.
 */
export const stack: StackBand[] = [
  {
    id: "client",
    label: "CLIENT",
    nodes: [
      {
        id: "nextjs",
        name: "Next.js",
        rationale:
          "Next.js — server rendering and static pages in one framework, so marketing pages index and product pages stay fast.",
      },
      {
        id: "react",
        name: "React",
        rationale:
          "React — the largest hiring pool and component ecosystem. Boring is a feature when someone else maintains the product later.",
      },
      {
        id: "typescript",
        name: "TypeScript",
        rationale:
          "TypeScript — catches the bugs that would otherwise surface on a client's phone. Every line we ship is typed.",
      },
      {
        id: "tailwind",
        name: "Tailwind",
        rationale:
          "Tailwind — design tokens live in one place and the stylesheet stops growing. Restraint is easier when every value has a name.",
      },
    ],
  },
  {
    id: "server",
    label: "SERVER",
    nodes: [
      {
        id: "nodejs",
        name: "Node.js",
        rationale:
          "Node.js — one language across client and server, so two engineers can own the whole stack. That is the point of hiring two people.",
      },
      {
        id: "fastapi",
        name: "FastAPI",
        rationale:
          "FastAPI — Python, where the AI libraries are. Typed request models, generated docs, async by default.",
      },
      {
        id: "trpc",
        name: "tRPC",
        rationale:
          "tRPC — end-to-end types between client and server without writing a schema twice. Refactors stop being frightening.",
      },
    ],
  },
  {
    id: "data",
    label: "DATA",
    nodes: [
      {
        id: "postgres",
        name: "PostgreSQL",
        rationale:
          "PostgreSQL — relational because most products have relationships, and you will regret JSON columns in month four.",
      },
      {
        id: "redis",
        name: "Redis",
        rationale:
          "Redis — caching, queues and rate limits without a second database. Used for what it is good at and nothing else.",
      },
      {
        id: "s3",
        name: "S3",
        rationale:
          "S3 — object storage that has not failed in a way that mattered. Files do not belong in a database.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    nodes: [
      {
        id: "claude",
        name: "Claude API",
        rationale:
          "Claude API — strong on long documents and on following instructions exactly. Our default for agents that must not improvise.",
      },
      {
        id: "openai",
        name: "OpenAI",
        rationale:
          "OpenAI — broad model range and mature tooling. Used where the evals say it wins, not by default.",
      },
      {
        id: "pgvector",
        name: "pgvector",
        rationale:
          "pgvector — embeddings in the same database as the rows they describe. One backup, one query, no sync job.",
      },
      {
        id: "langgraph",
        name: "LangGraph",
        rationale:
          "LangGraph — agent workflows as explicit graphs, so the failure path is drawn before it is hit.",
      },
    ],
  },
  {
    id: "infra",
    label: "INFRA",
    nodes: [
      {
        id: "vercel",
        name: "Vercel",
        rationale:
          "Vercel — zero-config Next.js deploys with a preview URL on every commit. The weekly build you can open lives here.",
      },
      {
        id: "aws",
        name: "AWS",
        rationale:
          "AWS — for anything that needs a VPC, a queue or a GPU. Chosen when Vercel stops being the simple answer.",
      },
      {
        id: "docker",
        name: "Docker",
        rationale:
          "Docker — the same container on a laptop, in CI and in production. It removes 'works on my machine' from the conversation.",
      },
      {
        id: "gha",
        name: "GitHub Actions",
        rationale:
          "GitHub Actions — tests, type checks and deploys on every push. Set up once, reviewed in the pull request.",
      },
    ],
  },
];

/** Directed connections drawn as orthogonal hairline paths between bands. */
export const stackEdges: StackEdge[] = [
  { from: "react", to: "nextjs" },
  { from: "typescript", to: "react" },
  { from: "tailwind", to: "typescript" },
  { from: "nextjs", to: "nodejs" },
  { from: "typescript", to: "trpc" },
  { from: "nodejs", to: "postgres" },
  { from: "fastapi", to: "openai" },
  { from: "redis", to: "postgres" },
  { from: "s3", to: "redis" },
  { from: "openai", to: "claude" },
  { from: "pgvector", to: "openai" },
  { from: "langgraph", to: "pgvector" },
  { from: "aws", to: "vercel" },
  { from: "docker", to: "aws" },
  { from: "gha", to: "docker" },
  { from: "vercel", to: "nextjs" },
  { from: "aws", to: "postgres" },
];

export const stackIntro =
  "Chosen for the products we build, not for the logos. Hover a node to see why it is there.";

export const stackIntroMobile =
  "Chosen for the products we build, not for the logos. Tap a technology to see why it is there.";
