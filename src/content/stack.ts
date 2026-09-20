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
          "Next.js — report jobs queue from Next.js APIs, admin dashboards fetch live data, and the Eidos UI ships on it.",
      },
      {
        id: "react",
        name: "React",
        rationale:
          "React — product surfaces and internal dashboards. The same components talk to FastAPI and to Next.",
      },
      {
        id: "typescript",
        name: "TypeScript",
        rationale:
          "TypeScript — every line we ship is typed. Catches the bugs that would otherwise hit a client's phone.",
      },
      {
        id: "python",
        name: "Python",
        rationale:
          "Python — FastAPI, LangGraph, workers, and the Astro Engine. The language the AI libraries actually live in.",
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
          "Node.js — Next.js API routes and Express services. One language with the client, so two people can own the request path.",
      },
      {
        id: "golang",
        name: "Golang",
        rationale:
          "Golang — services that have to stay small and concurrent. Chi when the API is Go; Python stays where the AI libraries are.",
      },
      {
        id: "graphql",
        name: "GraphQL",
        rationale:
          "GraphQL — the in-house Astro Engine over FastAPI. Typed queries, no paid astrology provider in the loop.",
      },
      {
        id: "fastapi",
        name: "FastAPI",
        rationale:
          "FastAPI — Astro Engine, RAG backends, Eidos. We moved Flask here for async throughput and kept it.",
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
          "PostgreSQL — relational because Eidos and most products have relationships. We will regret JSON columns in month four.",
      },
      {
        id: "redis",
        name: "Redis",
        rationale:
          "Redis — time-decayed affinity, short-term agent memory, job locks around the edges. Used for what it is good at.",
      },
      {
        id: "mongodb",
        name: "MongoDB",
        rationale:
          "MongoDB — report-job locking, structured user memory, CRM lead stores. Documents when the shape actually is a document.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    nodes: [
      {
        id: "gemini",
        name: "Gemini",
        rationale:
          "Gemini — chat intent and the Eidos critic loop. Default when we need a fast, cheap generation pass.",
      },
      {
        id: "openai",
        name: "OpenAI",
        rationale:
          "OpenAI — ranking and chat intent alongside Gemini. Used where the evals say it wins, not by habit.",
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
          "LangGraph — orchestrator, workers, judge, retries. The TrustAstrology agents and the Eidos critic are graphs, not prompts.",
      },
    ],
  },
  {
    id: "infra",
    label: "INFRA",
    nodes: [
      {
        id: "gcp",
        name: "GCP",
        rationale:
          "GCP — Pub/Sub into BigQuery, Cloud Run, GCE workers, GCS for 35+ report PDFs. Where the heavy async work runs.",
      },
      {
        id: "aws",
        name: "AWS",
        rationale:
          "AWS — VPC, ALB, ECS Fargate, EventBridge, Lambda, S3. Chosen when the job needs a box, a queue, or a cron.",
      },
      {
        id: "docker",
        name: "Docker",
        rationale:
          "Docker — the same container on a laptop, on ECS, and on the Eidos box behind Nginx. It ends 'works on my machine'.",
      },
      {
        id: "azure",
        name: "Azure",
        rationale:
          "Azure — when the client's estate is already there. Same boxes, queues and crons as AWS, different console.",
      },
      {
        id: "jenkins",
        name: "Jenkins",
        rationale:
          "Jenkins — Eidos deploys to a raw AWS host, Elastic IP, Nginx. GitHub Actions for the repos that do not need a box.",
      },
    ],
  },
];

/** Directed connections drawn as orthogonal hairline paths between bands. */
export const stackEdges: StackEdge[] = [
  { from: "react", to: "nextjs" },
  { from: "typescript", to: "react" },
  { from: "python", to: "typescript" },
  { from: "nextjs", to: "nodejs" },
  { from: "typescript", to: "graphql" },
  { from: "python", to: "golang" },
  { from: "nodejs", to: "postgres" },
  { from: "fastapi", to: "openai" },
  { from: "redis", to: "postgres" },
  { from: "mongodb", to: "redis" },
  { from: "openai", to: "gemini" },
  { from: "pgvector", to: "openai" },
  { from: "langgraph", to: "pgvector" },
  { from: "aws", to: "gcp" },
  { from: "docker", to: "aws" },
  { from: "azure", to: "docker" },
  { from: "jenkins", to: "azure" },
  { from: "gcp", to: "nextjs" },
  { from: "aws", to: "postgres" },
];

export const stackIntro =
  "Chosen for the products we build, not for the logos. Hover a node to see why it is there.";

export const stackIntroMobile =
  "Chosen for the products we build, not for the logos. Tap a technology to see why it is there.";
