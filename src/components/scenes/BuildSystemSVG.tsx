import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * The 01 build system. One continuous 800 x 800 drawing that assembles
 * through four stages. Each element declares the stage range in which it is
 * present; a static render shows every element present at `stage`, an
 * animated render includes every element and lets GSAP draw and undraw them
 * (see sections/S01Capabilities.tsx).
 *
 * All strokes 1.25, square caps, ink. Exactly one element per stage is
 * stroked in the accent: the element the stage's copy describes.
 */

export type Stage = 1 | 2 | 3 | 4;

interface El {
  id: string;
  from: Stage;
  to: Stage;
  /** Stage at which this element is the accent-stroked element. */
  signalAt?: Stage;
  /** Draw order within its entry stage, 0..1 (start) */
  order?: number;
  children: ReactNode;
  /** Text labels are not stroked; they fade rather than draw. */
  text?: boolean;
}

const s = {
  fill: "none",
  stroke: "var(--ink)",
  strokeWidth: 1.25,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

/**
 * A filled block is two rects: a stroke-free fill (which the scene fades,
 * since dashes cannot hide a fill) and the drawn outline above it.
 */
function Solid({
  fill = "var(--paper-sunk)",
  ...rect
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  fill?: string;
}) {
  return (
    <>
      <rect {...rect} fill={fill} stroke="none" data-fill />
      <rect {...rect} {...s} />
    </>
  );
}

const mono = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  fontSize: 11,
  letterSpacing: "0.14em",
  fill: "var(--graphite)",
};

/* Geometry ---------------------------------------------------------- */

// Browser frame (stages 1-2). Compresses into the phone at stage 3.
const FRAME = { x: 120, y: 120, w: 560, h: 420 };
// Phone (stages 3-4)
const PHONE = { x: 280, y: 100, w: 240, h: 480, r: 24 };
// Second phone outline (stage 3)
const PHONE_B = { x: 545, y: 150, w: 180, h: 370, r: 20 };
// Database cylinder (stages 2-4)
const DB = { cx: 300, cy: 630, rx: 40, ry: 12, h: 56 };
// API box (stages 2-4)
const API = { x: 460, y: 618, w: 100, h: 56 };

// AI graph nodes (stage 4)
const NODES: { id: string; label: string; x: number; y: number }[] = [
  { id: "retrieve", label: "RETRIEVE", x: 590, y: 130 },
  { id: "rank", label: "RANK", x: 690, y: 200 },
  { id: "prompt", label: "PROMPT", x: 730, y: 300 },
  { id: "tool", label: "TOOL", x: 730, y: 400 },
  { id: "eval", label: "EVAL", x: 690, y: 500 },
  { id: "guard", label: "GUARD", x: 610, y: 570 },
  { id: "respond", label: "RESPOND", x: 590, y: 480 },
];
const NODE_W = 84;
const NODE_H = 26;

const nodeAt = (id: string) => NODES.find((n) => n.id === id)!;
const edge = (a: string, b: string, viaX?: number) => {
  const A = nodeAt(a);
  const B = nodeAt(b);
  if (viaX === undefined) return `M${A.x} ${A.y}L${B.x} ${B.y}`;
  return `M${A.x} ${A.y}L${viaX} ${A.y}L${viaX} ${B.y}L${B.x} ${B.y}`;
};

const elements: El[] = [
  /* ---------------- Stage 1: WEBSITES ---------------- */
  {
    id: "frame",
    from: 1,
    to: 2,
    order: 0,
    children: (
      <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} {...s} />
    ),
  },
  {
    id: "titlebar",
    from: 1,
    to: 2,
    order: 0.15,
    children: (
      <>
        <path d={`M${FRAME.x} 160H${FRAME.x + FRAME.w}`} {...s} />
        <rect x={138} y={134} width={12} height={12} {...s} />
        <rect x={158} y={134} width={12} height={12} {...s} />
        <rect x={178} y={134} width={12} height={12} {...s} />
      </>
    ),
  },
  {
    id: "url",
    from: 1,
    to: 2,
    order: 0.3,
    children: <rect x={210} y={132} width={440} height={16} {...s} />,
  },
  {
    id: "block-hero",
    from: 1,
    to: 1,
    order: 0.42,
    children: <Solid x={150} y={190} width={500} height={100} />,
  },
  {
    id: "block-col-1",
    from: 1,
    to: 1,
    order: 0.55,
    children: <Solid x={150} y={310} width={150} height={80} />,
  },
  {
    id: "block-col-2",
    from: 1,
    to: 1,
    order: 0.6,
    children: <Solid x={325} y={310} width={150} height={80} />,
  },
  {
    id: "block-col-3",
    from: 1,
    to: 1,
    order: 0.65,
    children: <Solid x={500} y={310} width={150} height={80} />,
  },
  {
    id: "text-lines",
    from: 1,
    to: 1,
    order: 0.72,
    children: (
      <>
        <path d="M150 420H650" {...s} />
        <path d="M150 445H600" {...s} />
        <path d="M150 470H520" {...s} />
      </>
    ),
  },
  {
    id: "dimension",
    from: 1,
    to: 1,
    signalAt: 1,
    order: 0.85,
    children: (
      <>
        <path d={`M${FRAME.x} 580H${FRAME.x + FRAME.w}`} {...s} />
        <path d={`M${FRAME.x} 572V588`} {...s} />
        <path d={`M${FRAME.x + FRAME.w} 572V588`} {...s} />
        <path
          d={`M${FRAME.x + 10} 575L${FRAME.x} 580L${FRAME.x + 10} 585`}
          {...s}
        />
        <path
          d={`M${FRAME.x + FRAME.w - 10} 575L${FRAME.x + FRAME.w} 580L${FRAME.x + FRAME.w - 10} 585`}
          {...s}
        />
      </>
    ),
  },
  {
    id: "dimension-label",
    from: 1,
    to: 1,
    text: true,
    order: 0.95,
    children: (
      <text x={400} y={612} textAnchor="middle" style={mono}>
        {"< 2.0s LCP"}
      </text>
    ),
  },

  /* ---------------- Stage 2: WEB APPLICATIONS ---------------- */
  {
    id: "sidebar",
    from: 2,
    to: 2,
    order: 0,
    children: (
      <>
        <path d={`M240 160V${FRAME.y + FRAME.h}`} {...s} />
        <path d="M140 190H220M140 220H220M140 250H220M140 280H220" {...s} />
      </>
    ),
  },
  {
    id: "table",
    from: 2,
    to: 2,
    order: 0.2,
    children: (
      <>
        <Solid x={262} y={186} width={388} height={24} />
        <path
          d="M262 240H650M262 270H650M262 300H650M262 330H650M262 360H650M262 390H650"
          {...s}
        />
        <path
          d="M262 186V390M650 186V390M360 186V390M460 186V390M560 186V390"
          {...s}
        />
      </>
    ),
  },
  {
    id: "modal",
    from: 2,
    to: 2,
    order: 0.5,
    children: (
      <>
        <Solid x={330} y={250} width={260} height={160} fill="var(--paper)" />
        <rect x={570} y={258} width={10} height={10} {...s} />
        <path d="M350 290H520M350 315H480M350 380H420" {...s} />
      </>
    ),
  },
  {
    id: "db",
    from: 2,
    to: 4,
    signalAt: 2,
    order: 0.65,
    children: (
      <>
        <ellipse
          cx={DB.cx}
          cy={DB.cy - DB.h / 2}
          rx={DB.rx}
          ry={DB.ry}
          {...s}
        />
        <path
          d={`M${DB.cx - DB.rx} ${DB.cy - DB.h / 2}V${DB.cy + DB.h / 2}M${DB.cx + DB.rx} ${DB.cy - DB.h / 2}V${DB.cy + DB.h / 2}`}
          {...s}
        />
        <path
          d={`M${DB.cx - DB.rx} ${DB.cy + DB.h / 2}A${DB.rx} ${DB.ry} 0 0 0 ${DB.cx + DB.rx} ${DB.cy + DB.h / 2}`}
          {...s}
        />
      </>
    ),
  },
  {
    id: "db-label",
    from: 2,
    to: 4,
    text: true,
    order: 0.72,
    children: (
      <text
        x={DB.cx}
        y={DB.cy + DB.h / 2 + 26}
        textAnchor="middle"
        style={mono}
      >
        DATABASE
      </text>
    ),
  },
  {
    id: "api",
    from: 2,
    to: 4,
    order: 0.75,
    children: <rect x={API.x} y={API.y} width={API.w} height={API.h} {...s} />,
  },
  {
    id: "api-label",
    from: 2,
    to: 4,
    text: true,
    order: 0.82,
    children: (
      <text
        x={API.x + API.w / 2}
        y={API.y + API.h + 26}
        textAnchor="middle"
        style={mono}
      >
        API
      </text>
    ),
  },
  // Connectors from the browser frame (stage 2 only; re-routed at stage 3)
  {
    id: "conn-frame",
    from: 2,
    to: 2,
    order: 0.85,
    children: (
      <>
        <path
          d={`M${DB.cx} ${FRAME.y + FRAME.h}V${DB.cy - DB.h / 2 - DB.ry}`}
          {...s}
        />
        <path
          d={`M${API.x + API.w / 2} ${FRAME.y + FRAME.h}V${API.y}`}
          {...s}
        />
        <path d={`M${DB.cx + DB.rx} ${DB.cy}H${API.x}`} {...s} />
      </>
    ),
  },

  /* ---------------- Stage 3: MOBILE ---------------- */
  {
    id: "phone",
    from: 3,
    to: 4,
    order: 0,
    children: (
      <>
        <rect
          x={PHONE.x}
          y={PHONE.y}
          width={PHONE.w}
          height={PHONE.h}
          rx={PHONE.r}
          {...s}
        />
        <rect
          x={PHONE.x + 80}
          y={PHONE.y + 12}
          width={80}
          height={12}
          rx={6}
          {...s}
        />
      </>
    ),
  },
  {
    id: "cards",
    from: 3,
    to: 4,
    order: 0.25,
    children: (
      <>
        <Solid x={305} y={170} width={190} height={70} />
        <Solid x={305} y={255} width={190} height={70} />
        <Solid x={305} y={340} width={190} height={70} />
        <Solid x={305} y={425} width={190} height={70} />
      </>
    ),
  },
  {
    id: "conn-phone",
    from: 3,
    to: 4,
    order: 0.5,
    children: (
      <>
        <path
          d={`M${PHONE.x + 80} ${PHONE.y + PHONE.h}V${DB.cy - DB.h / 2 - DB.ry}H${DB.cx}`}
          {...s}
        />
        <path
          d={`M${PHONE.x + PHONE.w - 80} ${PHONE.y + PHONE.h}V${API.y - 10}H${API.x + API.w / 2}V${API.y}`}
          {...s}
        />
      </>
    ),
  },
  {
    id: "phone-b",
    from: 3,
    to: 3,
    signalAt: 3,
    order: 0.6,
    children: (
      <rect
        x={PHONE_B.x}
        y={PHONE_B.y}
        width={PHONE_B.w}
        height={PHONE_B.h}
        rx={PHONE_B.r}
        {...s}
      />
    ),
  },
  {
    id: "phone-b-label",
    from: 3,
    to: 3,
    text: true,
    order: 0.85,
    children: (
      <text
        x={PHONE_B.x + PHONE_B.w / 2}
        y={PHONE_B.y + PHONE_B.h + 26}
        textAnchor="middle"
        style={mono}
      >
        IOS / ANDROID
      </text>
    ),
  },

  /* ---------------- Stage 4: AI ---------------- */
  {
    id: "graph-edges",
    from: 4,
    to: 4,
    order: 0.05,
    children: (
      <>
        <path
          d={`M${PHONE.x + PHONE.w} 150H${nodeAt("retrieve").x - NODE_W / 2}`}
          {...s}
        />
        <path d={edge("retrieve", "rank")} {...s} />
        <path d={edge("rank", "prompt")} {...s} />
        <path d={edge("prompt", "tool")} {...s} />
        <path d={edge("tool", "eval")} {...s} />
        <path d={edge("eval", "guard")} {...s} />
        <path d={edge("guard", "respond")} {...s} />
        <path d={edge("respond", "prompt", 640)} {...s} />
        <path
          d={`M${nodeAt("respond").x - NODE_W / 2} ${nodeAt("respond").y}H${PHONE.x + PHONE.w}`}
          {...s}
        />
      </>
    ),
  },
  ...NODES.map<El>((n, i) => ({
    id: `node-${n.id}`,
    from: 4,
    to: 4,
    signalAt: n.id === "eval" ? 4 : undefined,
    order: 0.2 + i * 0.1,
    children: (
      <Solid
        x={n.x - NODE_W / 2}
        y={n.y - NODE_H / 2}
        width={NODE_W}
        height={NODE_H}
        fill="var(--paper)"
      />
    ),
  })),
  ...NODES.map<El>((n, i) => ({
    id: `label-${n.id}`,
    from: 4,
    to: 4,
    text: true,
    order: 0.28 + i * 0.1,
    children: (
      <text
        x={n.x}
        y={n.y + 4}
        textAnchor="middle"
        style={{ ...mono, fontSize: 10 }}
      >
        {n.label}
      </text>
    ),
  })),
];

export const STAGE_TITLES = [
  "WEBSITES",
  "WEB APPLICATIONS",
  "MOBILE",
  "AI",
] as const;

interface BuildSystemSVGProps {
  /** Which stage's final composition to show statically. */
  stage: Stage;
  /** Include every element so GSAP can drive the sequence. */
  animated?: boolean;
  className?: string;
  title?: string;
}

export function BuildSystemSVG({
  stage,
  animated = false,
  className,
  title,
}: BuildSystemSVGProps) {
  const visible = animated
    ? elements
    : elements.filter((el) => el.from <= stage && el.to >= stage);

  return (
    <svg
      viewBox="0 0 800 800"
      className={clsx("h-auto w-full", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      data-build-system
      data-animated={animated ? "" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {/* Registration crosses */}
      <g {...s} stroke="var(--rule)">
        <path d="M24 40H56M40 24V56" />
        <path d="M744 40H776M760 24V56" />
        <path d="M24 760H56M40 744V776" />
        <path d="M744 760H776M760 744V776" />
      </g>
      {visible.map((el) => {
        const isSignal = !animated && el.signalAt === stage;
        return (
          <g
            key={el.id}
            data-el={el.id}
            data-from={el.from}
            data-to={el.to}
            data-order={el.order ?? 0}
            data-signal-at={el.signalAt}
            data-text={el.text ? "" : undefined}
            className={isSignal ? "signal-stroke" : undefined}
          >
            {el.children}
          </g>
        );
      })}
    </svg>
  );
}
