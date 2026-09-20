import type { Project } from "@/types/content";

export const heroProject: Project = {
  code: "W-01",
  name: "HearU",
  year: "2025",
  description: "An AI mental-wellness journal with a voice assistant, shipped on Kubernetes.",
  problem: [
    "Most wellness apps treat the journal as a text box and the model as a demo.",
    "There was no confidential write-and-speak loop that could actually ship on a cluster.",
  ],
  built: [
    "A FastAPI backend and React journal, with a Gemini voice assistant for people who would rather talk than type.",
    "CI on GitHub Actions and a Kubernetes deploy on GCP, so the thing you open is the thing that runs.",
  ],
  stack: "FASTAPI · REACT · GEMINI · GITHUB ACTIONS · KUBERNETES · GCP",
  metrics: [
    { display: "1", label: "VOICE ASSISTANT" },
    { display: "1", label: "KUBERNETES CLUSTER" },
    { display: "2", label: "SURFACES WEB AND VOICE" },
  ],
  image: {
    src: "/work/placeholder-02.svg",
    width: 1600,
    height: 1000,
    alt: "HearU — AI mental-wellness journal, registration frame.",
  },
  href: "https://github.com/laksh-krishna-sharma/HearU",
};

export const supportingProjects: Project[] = [
  {
    code: "W-02",
    name: "Eidos",
    year: "2025",
    description:
      "A self-healing RAG system that evaluates its own answers and rewrites the weak ones.",
    stack: "NEXT.JS · FASTAPI · LANGGRAPH · QDRANT · POSTGRES · R2 · AWS",
    image: {
      src: "/work/placeholder-01.webp",
      width: 1600,
      height: 1000,
      alt: "Eidos — self-healing RAG system, registration frame.",
    },
    href: "https://self-healing-rag-frontend.karkisinghgamer.workers.dev/login",
  },
  {
    code: "W-03",
    name: "Exovision",
    year: "2025",
    description:
      "Custom model detects comets, planets, and stars and determines their positions based on their movement.",
    stack: "PYTHON · CUSTOM ML MODEL · ASTRONOMY",
    image: {
      src: "/work/placeholder-03.webp",
      width: 1600,
      height: 1000,
      alt: "Exovision — celestial object detection and tracking pipeline, registration frame.",
    },
    href: "https://github.com/laksh-krishna-sharma/Exovision",
  },
];

export const workLabels = {
  problem: "THE PROBLEM",
  built: "WHAT WE BUILT",
  stack: "STACK",
  results: "RESULTS",
};
