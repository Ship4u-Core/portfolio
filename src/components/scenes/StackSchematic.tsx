import { stack, stackEdges } from "@/content/stack";
import type { StackNode } from "@/types/content";

/**
 * The 05 schematic. Technologies are mono text nodes in hairline boxes,
 * connected by orthogonal hairline paths, in five labelled bands.
 *
 * Layout is fixed on a 180 x 120 lattice so that connector routes can be
 * authored by hand and stay legible. Desktop only; mobile gets lists.
 */

const COL_STEP = 180;
const ROW_STEP = 120;
const X0 = 120;
const Y0 = 40;
export const NODE_W = 150;
export const NODE_H = 40;

interface Placed extends StackNode {
  band: string;
  cx: number;
  cy: number;
}

export const placedNodes: Placed[] = stack.flatMap((band, row) =>
  band.nodes.map((node, col) => ({
    ...node,
    band: band.id,
    cx: X0 + col * COL_STEP + NODE_W / 2,
    cy: Y0 + row * ROW_STEP + NODE_H / 2,
  })),
);

/** Hand-routed orthogonal paths, keyed by `${from}-${to}`. */
const routes: Record<string, string> = {
  "react-nextjs": "M300 60H270",
  "typescript-react": "M480 60H450",
  "tailwind-typescript": "M660 60H630",
  "nextjs-nodejs": "M205 80V160",
  "typescript-trpc": "M555 80V160",
  "nodejs-postgres": "M205 200V280",
  "fastapi-openai": "M395 200V250H465V350H395V400",
  "redis-postgres": "M300 300H270",
  "s3-redis": "M480 300H450",
  "openai-claude": "M300 420H270",
  "pgvector-openai": "M480 420H450",
  "langgraph-pgvector": "M660 420H630",
  "aws-vercel": "M300 540H270",
  "docker-aws": "M480 540H450",
  "gha-docker": "M660 540H630",
  "vercel-nextjs": "M120 540H100V60H120",
  "aws-postgres": "M315 520V470H285V330H255V320",
};

const stroke = {
  fill: "none",
  stroke: "var(--ink)",
  strokeWidth: 1.25,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

const mono = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  letterSpacing: "0.12em",
};

interface StackSchematicProps {
  className?: string;
}

export function StackSchematic({ className }: StackSchematicProps) {
  return (
    <svg
      viewBox="88 8 736 570"
      className={className}
      role="img"
      data-stack-schematic
    >
      <title>Schematic of the Ship4u technology stack in five bands</title>

      {/* Band labels */}
      {stack.map((band, row) => (
        <text
          key={band.id}
          x={X0}
          y={Y0 + row * ROW_STEP - 12}
          style={{ ...mono, fontSize: 11, fill: "var(--graphite)" }}
          data-band-label={band.id}
        >
          {band.label}
        </text>
      ))}

      {/* Connectors */}
      <g data-stack-edges>
        {stackEdges.map(({ from, to }) => {
          const d = routes[`${from}-${to}`];
          if (!d) return null;
          return (
            <path
              key={`${from}-${to}`}
              d={d}
              {...stroke}
              data-edge=""
              data-from={from}
              data-to={to}
            />
          );
        })}
      </g>

      {/* Nodes */}
      {placedNodes.map((n) => (
        <g
          key={n.id}
          data-stack-node={n.id}
          data-band={n.band}
          tabIndex={0}
          role="img"
          aria-label={`${n.name}. ${n.rationale}`}
          style={{ cursor: "default" }}
        >
          <rect
            x={n.cx - NODE_W / 2}
            y={n.cy - NODE_H / 2}
            width={NODE_W}
            height={NODE_H}
            {...stroke}
            fill="var(--paper)"
            data-node-box=""
          />
          <text
            x={n.cx}
            y={n.cy + 4}
            textAnchor="middle"
            style={{ ...mono, fontSize: 12, fill: "var(--ink)" }}
          >
            {n.name.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
