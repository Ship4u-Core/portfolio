# SHIP4U — PORTFOLIO SITE BUILD SPECIFICATION

**Version:** 1.0
**Target agent:** Cursor (Fable / Composer agent mode) or Claude in a chat window
**Deliverable:** A production-ready Next.js + TypeScript marketing site for Ship4u, a two-person development studio.

---

## 0. HOW TO USE THIS FILE

### If you are an agent in Cursor with filesystem access

Build the full repository described in Section 4. Work in the five phases in Section 12, in order. Do not skip ahead. After each phase, verify against that phase's acceptance criteria before continuing. Do not ask for approval between phases unless something in this spec is genuinely contradictory.

### If you are Claude in a chat window

Build **Phases 1 through 3 only**, collapsed into a single self-contained `index.html` file with inlined CSS and JS, loading GSAP and Lenis from a CDN. Skip the Next.js structure, the API route, and the WebGL interlude. The goal is a previewable approximation of the art direction and the scroll choreography, not the shippable repo.

### A note on authority

This document is the design authority. Where it conflicts with your defaults, this document wins. Where it is silent, use the principles in Section 3 to decide, and prefer the more restrained option.

---

## 1. THE BRIEF

Ship4u is a new two-person development studio in India. They build web, mobile and AI products end to end: architecture, UI, development, AI integration, deployment, and ongoing scaling.

They have no brand recognition, no press, and no long client list. The only proof they can offer a prospective client on first contact is **the site itself**.

So the site has a double job:

1. Explain clearly what Ship4u does, for whom, and roughly what it costs.
2. Be, by its own existence, the strongest work sample in the portfolio.

Every technical decision below serves job 2. Every copy decision serves job 1. When the two conflict, job 1 wins — a beautiful site that leaves a buyer unsure what to hire you for has failed.

**The one-line positioning to build everything around:**

> From idea to shipped product.

---

## 2. NON-NEGOTIABLES

### 2.1 Banned outright

These are hard bans. Not preferences. If any of these appear in the output, the build has failed.

**Colour**
- Purple, violet, indigo, magenta, lavender, in any shade, in any element, including hover states and focus rings.
- Purple-to-blue, pink-to-orange, or any multi-hue gradient used as a background, a text fill, or a border.
- Blurred floating colour orbs, gradient mesh backgrounds, aurora effects, animated gradient blobs.
- Glassmorphism: frosted translucent cards with coloured glow behind them.
- Neon glow, outer glow on text, coloured drop shadows.

**Typography**
- Inter, Poppins, Montserrat, Space Grotesk, or DM Sans as the display face.
- Gradient-filled text of any kind.
- Text with a coloured glow or a stroke-and-fill duotone effect.

**Layout and component patterns**
- Bento grids.
- Rows of identical rounded cards with soft drop shadows (`rounded-2xl shadow-lg` repeated across a section).
- Testimonial carousels.
- "Trusted by" logo walls.
- Dark mode, or a theme toggle of any kind. This site is light only.
- A full-screen preloader that gates content behind a scroll or a wait longer than 1.2 seconds.

**Content**
- Emoji. Anywhere. Including in code comments, `alt` text, commit messages, console logs, and the README.
- Lorem ipsum. Every string on the page is either real copy from Section 7 or a clearly marked placeholder token from Section 11.
- Invented client names, invented testimonials, invented logos, invented team photographs.
- Animated counters ticking up to numbers that are not real, presented as if real. See Section 11 for how placeholder metrics must be handled.

**Voice**
- These words and constructions: *elevate, unlock, empower, seamless, seamlessly, cutting-edge, game-changing, revolutionise, transform your, take it to the next level, in today's fast-paced world, we're passionate about, journey, synergy, leverage* (as a verb), *solutions* (as a noun for what you sell).
- Sentences built on a long dash with a restating clause after it, used more than twice on the whole site.
- Any sentence that could appear on any other agency site without alteration.

**Motion**
- `bounce`, `elastic`, `back` easing. Ever.
- A trailing blob cursor, a cursor with a lag-follow circle, a cursor that smears.
- Parallax applied to every element in a section. Parallax is a tool for establishing depth in two or three places, not a global setting.
- Elements entering with the default `opacity: 0; translateY(20px); duration: 0.5` pattern. See Section 3.5 for what to do instead.
- Scroll-jacking that traps the user or makes a section take more than four viewport-heights of scroll to pass.

### 2.2 Required

- Light theme, warm paper base, black ink, exactly one accent colour.
- Full keyboard operability and visible focus states.
- A working `prefers-reduced-motion` path that renders every section in its final, complete state.
- Mobile that is designed, not degraded. See Section 9.
- Every price and service from Section 7 present and findable without scrolling the whole site.

---

## 3. ART DIRECTION

### 3.1 The concept: THE MANIFEST

The site is built as a **build log**. Not a brochure, not a journey, not a story. A technical record of a product being constructed, running in real time as the visitor scrolls.

This gives the whole site one grammar:

- Every section is a numbered entry: `00 INDEX`, `01 CAPABILITIES`, `02 SELECTED WORK`, and so on.
- Every section carries a status in monospace: `READY`, `BUILDING`, `COMPLETE`.
- A hairline rail persists at the top of the viewport, filling with the accent colour as scroll progresses, like a pipeline running.
- At the final section, the status flips to `SHIPPED`.

The visual vocabulary is **engineering drawing**: hairline rules, orthographic construction, dimension marks, registration crosses, monospace annotation, numbered callouts. Warm paper instead of screen-white. It should feel like a well-set technical document that happens to be alive.

This is why the site can be light, restrained and still extravagant. The spectacle comes from precision and choreography, not from colour and glow.

### 3.2 The wordmark

`SHIP4U` is set in the sans at weight 800, tracking `-0.03em`. The `4` is the only character in the accent colour. That is the entire mark. It turns the weakest part of the name — the SMS-era numeral — into a deliberate typographic device.

- Favicon: the accent-coloured `4` on paper, nothing else.
- The `4` may be used standalone as a section ornament, a bullet, and the form submit affordance.

### 3.3 Colour

Define as CSS custom properties on `:root` in `globals.css`. Expose to Tailwind via `theme.extend.colors`. There is no dark variant.

```css
:root {
  /* Base */
  --paper:        #F5F3EE;  /* page background, warm off-white */
  --paper-raised: #FBFAF7;  /* raised surfaces, input fields */
  --paper-sunk:   #EDEAE3;  /* recessed panels, table stripes */

  /* Ink */
  --ink:          #111110;  /* headlines, body */
  --ink-soft:     #4A4843;  /* secondary body */
  --graphite:     #6E6B64;  /* mono labels, captions */
  --rule:         #DCD8CF;  /* hairlines, borders, dividers */

  /* Accent — single, used sparingly */
  --signal:       #E2401C;  /* large type, graphics, active states */
  --signal-deep:  #B22F10;  /* small text on paper — meets 4.5:1 */
  --signal-wash:  #FAE6DF;  /* fills behind active rows only */

  /* Inverted band (pricing section only) */
  --ink-flood:    #141311;
  --paper-on-ink: #F2EFE8;
  --rule-on-ink:  #35322D;
}
```

**Accent discipline.** The accent appears no more than four times per viewport. It marks exactly three things: the `4` in the wordmark, the current state in any progress or active indicator, and the single most important interactive affordance in view. Never decoration.

**Contrast rules.**
- `--signal` on `--paper` is approximately 3.6:1. Use it only for text at 24px/600 or larger, and for graphics. For body-size accent text, use `--signal-deep`.
- `--graphite` on `--paper` is approximately 4.6:1. Acceptable for mono labels at 11px and above. Never lighter than this.

**Texture.** Apply a fixed-position grain overlay across the whole document: an inline SVG `feTurbulence` (`baseFrequency="0.85"`, `numOctaves="3"`), rendered to a `<div>` with `opacity: 0.035`, `mix-blend-mode: multiply`, `pointer-events: none`, `position: fixed`, `inset: 0`, `z-index: 1`. This single detail does more to remove the flat generated-website look than any other change. Do not animate it.

### 3.4 Typography

Three families, each with one job. Load via `next/font` — self-hosted, no render-blocking external requests.

| Role | Family | Source | Used for |
|---|---|---|---|
| Structural | **Geist Sans** (variable 100–900) | `npm i geist` | All headlines, all body copy, navigation, buttons |
| Technical | **Geist Mono** (variable) | `npm i geist` | Section codes, status chips, labels, prices, numbers, form labels, annotations, footer |
| Editorial | **Instrument Serif** (regular + italic) | `next/font/google` | Exactly four pull-quote lines across the entire site. Nothing else. |

The Instrument Serif italic is the human note in an otherwise machined document. Its power comes entirely from scarcity. If it appears five times, delete one.

**Scale.** Fluid, using `clamp()`. Do not use fixed pixel headlines.

```css
--type-display-xl: clamp(3.25rem, 11.5vw, 10.5rem);  /* weight 800, tracking -0.045em, leading 0.84 */
--type-display-l:  clamp(2.5rem, 7vw, 6rem);         /* weight 800, tracking -0.035em, leading 0.90 */
--type-h2:         clamp(1.875rem, 4vw, 3.25rem);    /* weight 700, tracking -0.02em, leading 1.02 */
--type-h3:         clamp(1.25rem, 2vw, 1.75rem);     /* weight 600, tracking -0.01em, leading 1.2  */
--type-body-l:     1.1875rem;                         /* leading 1.55, max-width 62ch */
--type-body:       1.0625rem;                         /* leading 1.65, max-width 68ch */
--type-mono:       0.6875rem;                         /* uppercase, tracking 0.14em, leading 1 */
--type-mono-l:     0.8125rem;                         /* uppercase, tracking 0.10em */
```

**Rules.**
- Display type is always set tight. Negative tracking and sub-1.0 line-height are what make it look designed rather than defaulted.
- Body copy never exceeds 68 characters per line.
- Monospace is always uppercase, always tracked out, always `--graphite` unless it is an active state.
- Never centre a paragraph. Headlines may be left-aligned or, in two specific places, set full-bleed and optically aligned to the grid edge.

### 3.5 Motion principles

**Easing.** Two curves, site-wide.

```js
// Entrances, reveals, anything appearing
const EASE_OUT = "expo.out";              // or cubic-bezier(0.16, 1, 0.3, 1)
// Transforms, morphs, state changes
const EASE_IN_OUT = "power4.inOut";       // or cubic-bezier(0.76, 0, 0.24, 1)
```

**Durations.** Entrances 0.7s–1.1s. State changes 0.35s–0.5s. Micro-interactions 0.15s–0.25s. Scroll-scrubbed scenes have no duration; they are bound to progress.

**Stagger.** 0.04s to 0.06s. Never more than 0.08s or it reads as slow rather than orchestrated.

**Reveal vocabulary.** Elements do not fade in. They are revealed by the document constructing itself. Use these, in roughly this priority:

1. **Clip-path wipe.** `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`, eased `expo.out`. The primary reveal for headlines and images.
2. **Mask-up from a rule.** A hairline draws in, then the text mask-reveals upward from that line as if printed onto it. The signature move of this site. Use for every major section headline.
3. **SVG path draw.** `stroke-dasharray` / `stroke-dashoffset`, scrubbed to scroll. All diagram construction.
4. **Monospace rewrite.** A mono string cycles random characters before resolving to its final value, character by character, left to right. Use for the hero counter and for exactly one word transition (Section 6.1). Do not overuse; it becomes a gimmick on the third appearance.
5. **Digit roll.** Numbers change by translating a vertical strip of digits. Prices and metrics only.

**What never happens.** No bounce. No elastic. No rotation on entrance. No 3D card tilt on hover. No scale-up-from-0.8. No blur-in.

### 3.6 Grid and spacing

- Content max width: `1440px`. Page gutters: `24px` mobile, `40px` tablet, `72px` desktop.
- 12-column grid, `24px` gutter. Expose as a dev-only overlay toggled by pressing `G` (guarded by `process.env.NODE_ENV === "development"`).
- Vertical rhythm on an 8px base. Section padding: `120px` mobile, `180px` desktop, top and bottom.
- Sections are separated by a `1px solid var(--rule)` hairline and nothing else. No curtain transitions, no coloured dividers, no wave SVGs.
- Corner radius: `2px` on inputs and buttons. `0` everywhere else. This is a drawn document, not a card interface.

---

## 4. TECHNICAL STACK AND STRUCTURE

### 4.1 Dependencies

Use latest stable versions at time of build.

```
next                      App Router, TypeScript, React 19
typescript
tailwindcss               v4 if stable, else v3 with the config in 4.3
gsap                      core + ScrollTrigger (free tier only — no Club plugins)
lenis                     smooth scroll
three                     WebGL interlude ONLY, dynamically imported
geist                     Geist Sans + Geist Mono
clsx                      conditional classnames
```

**Explicitly do not install:** Framer Motion (GSAP covers everything here, two animation engines is one too many), React Three Fiber (one static scene does not justify the reconciler), Flubber or any SVG path-morphing library (fragile, heavy, and the mono-rewrite technique in 3.5 achieves the same intent more reliably), any UI component library, any icon library.

All icons are hand-authored inline SVG, single-stroke, `1.25px` stroke width, `currentColor`, `stroke-linecap: square`. Square caps matter — round caps read as friendly consumer-app, square reads as technical drawing.

### 4.2 File tree

```
ship4u/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                 fonts, metadata, grain overlay, rail, cursor
│  │  ├─ page.tsx                   composes sections 00–07 in order
│  │  ├─ globals.css                tokens, resets, base type, utilities
│  │  ├─ opengraph-image.tsx        generated OG card (see 10.3)
│  │  └─ api/
│  │     └─ enquiry/route.ts        POST handler, stubbed
│  ├─ components/
│  │  ├─ chrome/
│  │  │  ├─ ProgressRail.tsx        persistent top rail + status
│  │  │  ├─ Cursor.tsx              crosshair cursor, pointer:fine only
│  │  │  ├─ Grain.tsx               fixed noise overlay
│  │  │  └─ GridOverlay.tsx         dev-only, key "G"
│  │  ├─ sections/
│  │  │  ├─ S00Index.tsx
│  │  │  ├─ S01Capabilities.tsx
│  │  │  ├─ S02Work.tsx
│  │  │  ├─ S03Interlude.tsx        WebGL set piece
│  │  │  ├─ S04Process.tsx
│  │  │  ├─ S05Stack.tsx
│  │  │  ├─ S06Pricing.tsx          the inverted band
│  │  │  ├─ S07Studio.tsx           the two founders
│  │  │  └─ S08Ship.tsx             CTA + form + footer
│  │  ├─ scenes/
│  │  │  ├─ BuildSystemSVG.tsx      the 01 assembling diagram
│  │  │  ├─ WireObject.tsx          the Three.js plotter object
│  │  │  └─ StackSchematic.tsx      the 05 technical diagram
│  │  └─ ui/
│  │     ├─ SectionHeader.tsx       code + title + status, used by every section
│  │     ├─ MonoLabel.tsx
│  │     ├─ RuleRevealText.tsx      the mask-up-from-a-rule primitive
│  │     ├─ MonoRewrite.tsx         the character-cycling primitive
│  │     ├─ DigitRoll.tsx
│  │     ├─ Button.tsx
│  │     └─ Placeholder.tsx         dev-visible placeholder wrapper
│  ├─ content/
│  │  ├─ site.ts                    name, location, contact, socials
│  │  ├─ services.ts
│  │  ├─ work.ts                    PLACEHOLDER CASE STUDIES
│  │  ├─ process.ts
│  │  ├─ stack.ts
│  │  ├─ pricing.ts
│  │  └─ studio.ts                  PLACEHOLDER FOUNDER DATA
│  ├─ lib/
│  │  ├─ gsap.ts                    single registration point, Lenis wiring
│  │  ├─ motion.ts                  EASE constants, shared timeline helpers
│  │  └─ useReducedMotion.ts
│  └─ types/
│     └─ content.ts
├─ public/
│  └─ work/                         placeholder imagery
├─ PLACEHOLDERS.md                  generated checklist — see Section 11
├─ README.md
├─ tailwind.config.ts
└─ tsconfig.json
```

### 4.3 GSAP + Lenis wiring

This must be correct or every scroll scene will drift. Implement once in `src/lib/gsap.ts`:

```ts
"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export function initScroll(reduced: boolean) {
  if (reduced) {
    ScrollTrigger.normalizeScroll(false);
    return () => {};
  }
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.4 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return () => {
    lenis?.destroy();
    lenis = null;
    ScrollTrigger.getAll().forEach((s) => s.kill());
  };
}
```

**Rules.**
- Every section component creates its triggers inside `useGSAP` or a `useLayoutEffect` wrapped in `gsap.context()`, scoped to a local ref, and reverts on cleanup. No global selectors.
- Call `ScrollTrigger.refresh()` after fonts load (`document.fonts.ready`) and after any image loads inside a pinned section.
- Pinned sections use `pinSpacing: true` and `anticipatePin: 1`.
- Never nest a pinned ScrollTrigger inside another pinned ScrollTrigger.

---

## 5. GLOBAL SYSTEMS

### 5.1 The progress rail

Fixed to the top of the viewport. Height `44px`. Background `var(--paper)` at `0.88` alpha with `backdrop-filter: blur(12px)`. A `1px` bottom hairline in `var(--rule)`.

Contents, left to right:
- The `SHIP4U` wordmark, `13px`, weight 800, the `4` in `var(--signal)`.
- Centre, desktop only: the current section code and title in mono, e.g. `02 / SELECTED WORK`. This swaps with a `MonoRewrite` transition when the active section changes.
- Right: a status chip in mono — `BUILDING` for sections 00–06, `SHIPPED` once section 08 enters the viewport. On the flip to `SHIPPED`, the chip's text turns `var(--signal-deep)` and a hairline underline draws beneath it.

Directly on the bottom hairline, a `1px` fill in `var(--signal)` grows from `0%` to `100%` width bound to document scroll progress. This is the pipeline.

The rail never hides on scroll down. It is chrome, and chrome that disappears is chrome the user has to hunt for.

### 5.2 Navigation

There is no traditional nav menu. On desktop, a vertical manifest rail sits fixed to the right edge from section 01 onward:

```
00  INDEX          ·
01  CAPABILITIES   ·
02  WORK           ·
04  PROCESS        ·
05  STACK          ·
06  PRICING        ·
07  STUDIO         ·
08  SHIP           ·
```

Mono, `11px`, `var(--graphite)`, `1px` hairline on the left edge of the rail. The active row is `var(--ink)` and its marker dot becomes `var(--signal)`. Rows are buttons; clicking scrolls to that section via `lenis.scrollTo`. Completed rows get a small mono check glyph (a drawn SVG tick, not a character, not an emoji).

On mobile the rail is replaced by a single fixed bottom-right circular button showing the current section number. Tapping opens a full-screen manifest list on `var(--paper)`.

### 5.3 Cursor

Only when `(pointer: fine)` and `prefers-reduced-motion: no-preference`. Otherwise the native cursor is used and the component renders nothing.

- Default: a `16px` crosshair, two `1px` lines, `var(--ink)`, no fill, no lag. The native cursor is hidden.
- Over any interactive element: the crosshair expands to a `56px` circle with a `1px` `var(--ink)` border and a centred mono label — `OPEN`, `VIEW`, `DRAG`, `SEND`. Labels come from a `data-cursor` attribute on the element.
- Over the WebGL interlude: label `ORBIT`.

No trail. No lag. No blend modes. No blur. The cursor is an instrument, not an effect.

### 5.4 Reduced motion

When `prefers-reduced-motion: reduce`:

- Lenis is not initialised; native scrolling is used.
- All ScrollTrigger scrub animations are skipped and every animated element is rendered at its **final** state immediately. Nothing is left mid-construction.
- Pinned sections are unpinned and laid out as normal stacked content. The 01 build-system SVG shows its fourth and final stage. The process track becomes a vertical list.
- The Three.js object renders one static frame and does not rotate.
- The custom cursor is disabled.
- Remaining transitions are limited to opacity and colour, `≤200ms`.

This path must be tested, not assumed. A site whose reduced-motion mode is a blank page is a broken site.

---

## 6. SECTION SPECIFICATIONS

Each section opens with a `SectionHeader`: mono code, title, and status, on one line above a full-width hairline.

```
01 / CAPABILITIES                                          [ BUILDING ]
───────────────────────────────────────────────────────────────────────
```

Section 00 is the exception and carries no header.

---

### 6.1 `00 INDEX` — Hero

**Height:** `100svh` exactly. Not `100vh` — mobile browser chrome will break it.

**Layout (desktop).** Asymmetric. The headline occupies columns 1–9. Columns 10–12 hold the manifest rail and a small technical annotation block. A single hairline runs full-bleed horizontally at roughly 62% viewport height; the headline sits on it.

**Content.**

Top-left, mono, `--graphite`:
```
SHIP4U — DEVELOPMENT STUDIO — [[LOCATION]]
```

Headline, `--type-display-xl`, three lines, left aligned, ragged right:
```
FROM IDEA
TO SHIPPED
PRODUCT.
```
The full stop after `PRODUCT` is set in `var(--signal)`. It is the only accent in the headline.

Beneath the hairline, `--type-body-l`, max 56ch:
> We design, build and deploy production-grade web, mobile and AI products. Two engineers, the full lifecycle, no handoffs between agencies.

Two actions, side by side:
- Primary: `START A PROJECT` — solid `var(--ink)` fill, `var(--paper)` text, mono, `2px` radius.
- Secondary: `SEE THE WORK` — text only with a `1px` bottom rule that extends left-to-right on hover.

Bottom-left, mono, `--graphite`:
```
SCROLL TO BUILD ↓
```
(Use a drawn SVG arrow, not the character.)

**Load choreography.** Total under `1.2s`. This is not a preloader; content is in the DOM and readable throughout.

| t | Event |
|---|---|
| 0.00s | Paper visible. Page fully laid out but headline clipped to zero width, opacity 1. |
| 0.00–0.55s | The full-bleed hairline draws from left edge to right edge, `expo.out`. |
| 0.10–0.70s | Top-left mono block runs a `MonoRewrite` resolving to its final string. |
| 0.35s | Line 1 `FROM IDEA` masks up from the hairline, `expo.out`, 0.9s. |
| 0.41s | Line 2 `TO SHIPPED` masks up. |
| 0.47s | Line 3 `PRODUCT.` masks up. |
| 0.55–0.95s | A mono counter in the top right cycles `000` → `100` with a `1px` bar filling beneath it, then both fade to `--graphite` at 60% and persist as a static `100 / READY` annotation. |
| 0.90s | Paragraph and buttons clip-wipe in, 0.06s stagger. |
| 1.05s | The `4` in the rail wordmark flips to `var(--signal)`. |

**Scroll choreography (0 → 100% of hero exit).**
- The three headline lines translate upward at different rates: line 1 at `-14%`, line 2 at `-22%`, line 3 at `-30%` of viewport height. Subtle shear, not a slideshow.
- The hairline stays fixed until the headline has passed it, then releases.
- At 55% progress, the word `IDEA` in line 1 runs a single `MonoRewrite` into `PRODUCT`, scrubbed. This delivers the word-transformation idea without path morphing. It happens once, on this site, and never again.
- At 85% progress the manifest rail (5.2) fades in at the right edge.

---

### 6.2 `01 CAPABILITIES` — The build system

The section pins for `340vh` of scroll. Left half: a single continuous SVG that assembles through four stages. Right half: the copy for the current stage, swapping as stages advance.

**The SVG.** `viewBox="0 0 800 800"`, all strokes `1.25px` `var(--ink)`, no fills except `var(--paper-sunk)` for solid blocks. Exactly one element per stage is stroked in `var(--signal)` — the element the current copy is describing.

| Progress | Stage | What draws |
|---|---|---|
| 0–25% | **WEBSITES** | A browser frame draws itself: outer rect, then a title bar with three small squares, then a URL field, then content blocks fill downward in a 0.05s stagger. A dimension mark with arrowheads appears at the base annotated `< 2.0s LCP` in mono. |
| 25–50% | **WEB APPLICATIONS** | The static blocks become interactive: a sidebar slides in from the left edge of the frame, a data table draws row by row, a modal outline appears over it, and three hairlines connect the frame to a small labelled cylinder (database) and rect (API) below. |
| 50–75% | **MOBILE APPLICATIONS** | The browser frame compresses horizontally and gains rounded corners and a notch, becoming a phone. The table reflows into a card list. The database and API connections persist and re-route. A second, smaller phone outline draws behind, offset, annotated `iOS / ANDROID`. |
| 75–100% | **AI APPLICATIONS** | Nodes emit from the phone in an arc. A directed graph of seven nodes draws with animated connector paths. Labels in mono: `RETRIEVE`, `RANK`, `PROMPT`, `TOOL`, `EVAL`, `GUARD`, `RESPOND`. The `EVAL` node strokes in `var(--signal)` and pulses once per 3s. |

Every stroke is scrubbed via `stroke-dashoffset` bound to scroll progress. Transitions between stages do not clear the canvas — each stage **transforms** the previous one. That continuity is the entire point of this section.

**Right column copy**, swapping at stage boundaries with a clip-wipe out and mask-up in:

**WEBSITES / LANDING PAGES**
> Fast, indexable marketing sites built to convert. Under two seconds to first paint on a mid-range Android phone, because that is what most of your traffic is using.
> `HTML · SSR · ANALYTICS · CMS · SEO`

**WEB APPLICATIONS**
> Full-stack products with real authentication, real data and real integrations. Frontend, backend, database, APIs. Built to survive actual users rather than a demo.
> `AUTH · DATABASE · API · PAYMENTS · ADMIN`

**MOBILE APPLICATIONS**
> Cross-platform apps with the backend that makes them work. Built, signed, submitted, and shipped to both stores.
> `IOS · ANDROID · PUSH · OFFLINE · STORE RELEASE`

**AI APPLICATIONS**
> Agents, RAG pipelines and LLM features that do something specific and useful. Evaluated against a test set, not judged by how the demo felt.
> `AGENTS · RAG · EVALS · TOOL USE · INTEGRATIONS`

**Below the pin — the support band.** Two full-width rows, hairline-separated, visually subordinate. These are not headline services and should not be given equal weight.

| | |
|---|---|
| **DEPLOYMENT & CLOUD** | CI/CD, infrastructure, domains, SSL, monitoring. Set up once, correctly, so it stops being your problem. |
| **MAINTENANCE & SUPPORT** | Ongoing development, fixes and new features. We stay on after launch. |

---

### 6.3 `02 SELECTED WORK`

All content in this section is placeholder. See Section 11 for the handling rules — this is the section where invented metrics do the most damage if they leak to production.

**Structure:** one hero case study with a full zoom treatment, then two supporting projects as editorial rows. Not three equal zooms. Three pinned zoom scenes would cost nine viewport-heights and bore the visitor by the second one.

**Hero case study.** Pins for `280vh`.

| Progress | Behaviour |
|---|---|
| 0–30% | A `180px` wide thumbnail sits centred on the paper, a hairline frame around it with corner registration crosses. It scales up and its frame draws outward. Mono annotations at each corner give the project code, year, and duration. |
| 30–55% | The thumbnail reaches full-bleed. A browser chrome frame draws around it, then dissolves. The project name masks up over the image in `--type-display-l`, `var(--paper)` on an `var(--ink)` scrim limited to the type's own bounding box. |
| 55–80% | The image scales back to 60% width and locks to the left. A two-column breakdown wipes in on the right: `THE PROBLEM`, `WHAT WE BUILT`, `STACK`, each a mono label with two or three lines beneath. |
| 80–100% | Three result metrics roll in using `DigitRoll`, mono, large. Then the whole scene clip-wipes upward and releases the pin. |

**Supporting projects.** Two rows, full width, hairline separated, `160px` tall. Each row: mono index, project name in `--type-h2`, a one-line description, a mono stack string, and a right-aligned year. On hover, the row background fills `var(--paper-sunk)` from left to right in `0.4s`, a `320px` preview image clip-wipes in at the right edge following the cursor's vertical position, and the cursor label becomes `OPEN`. On mobile, the preview image is simply always visible as a small thumbnail at the row's left.

**If a project has no case study page yet**, the row is not a link and carries no hover state. Do not create dead links to `#`.

---

### 6.4 `03 INTERLUDE` — The WebGL set piece

This is the single WebGL moment. It sits between the work and the process because it is a breath, not an argument.

**Scene.** Full-bleed, `100svh`, `var(--paper)` background, no header, no section code.

Centred: a slowly rotating wireframe object rendered as if drawn by a pen plotter. Black hairlines on paper. No shading, no material, no lights, no shadows, no environment map.

**Implementation.**

```
Renderer      WebGLRenderer, alpha: true, antialias: true, dpr capped at 2
Camera        OrthographicCamera — perspective would undermine the drawing feel
Geometry      IcosahedronGeometry(1, 2) wrapped in EdgesGeometry
Material      LineBasicMaterial, color 0x111110, transparent, opacity 0.85
Object        LineSegments
Rotation      y: +0.0016 rad/frame, x: +0.0006 rad/frame, constant
Cursor        lerp the object's rotation offset toward ±0.10 rad on each axis
              from normalised pointer position, lerp factor 0.04
Entry         animate a uniform-free line draw by scaling the geometry's
              draw range from 0 to full over 1.4s on first intersection
Exit          pause the RAF loop when the section is out of the viewport
```

**Loading.** `next/dynamic` with `ssr: false`, triggered by an `IntersectionObserver` with `rootMargin: "300px"`. Three.js must not appear in the initial bundle. Until it loads, render a static inline SVG wireframe of the same silhouette so there is never an empty hole in the layout.

**Overlay.** Bottom-left, the first Instrument Serif italic line of the site, `--type-h2`:

> *Every product is a machine. We draw it before we build it.*

Beneath it, mono, `--graphite`:
```
FIG. 01 — SYSTEM GEOMETRY / ORTHOGRAPHIC / DRAG TO ORBIT
```

**Reduced motion:** render one static frame at a fixed rotation. No RAF loop, no cursor tracking.

**Mobile:** do not load Three.js at all below `768px`. Render the static SVG fallback. It looks nearly identical and saves roughly 150KB on the connection least able to afford it.

---

### 6.5 `04 PROCESS`

Horizontal track driven by vertical scroll. Pins for `300vh`; the track translates on X across seven stages.

A continuous `1px` hairline runs the full length of the track at the vertical centre. A `10px` filled circle in `var(--signal)` travels along it bound to scroll progress. As it passes each stage, that stage's number turns from `var(--graphite)` to `var(--ink)` and its glyph draws.

**Stages:**

| # | Stage | Line |
|---|---|---|
| 01 | DISCOVER | We work out what you are actually building and what it has to do on day one. |
| 02 | ARCHITECT | Data model, services, integrations, hosting. Decided before a line is written. |
| 03 | DESIGN | Interface and flows, designed against the real data, not against a mood board. |
| 04 | BUILD | Weekly deployed builds you can open. No three-week silences. |
| 05 | TEST | Real devices, real edge cases, real load. Fixes before launch, not after. |
| 06 | DEPLOY | Infrastructure, CI/CD, domains, SSL, monitoring. Handed over documented. |
| 07 | SCALE | Ongoing development as the product and the traffic grow. |

Note the change from the client's original list: their first stage was `IDEA`, which belongs to the client, not to Ship4u. It has been replaced with `DESIGN`, which is work Ship4u actually performs and charges for.

Each stage has a small single-stroke SVG glyph that draws on entry: a magnifier with a square field, an orthographic cube, a grid with one highlighted cell, a bracket pair, a checkmark inside a frame, an upward chevron over a plane, a stepped bar. Square caps, `1.25px`.

**Mobile:** vertical list, hairline running top to bottom on the left, dot travelling down it. Same content, no horizontal scroll.

---

### 6.6 `05 STACK`

Not a logo wall. A technical schematic.

A centred SVG diagram. Technologies are **mono text nodes** in `1px` hairline boxes, connected by orthogonal hairline paths with right-angle corners, grouped into five labelled bands running top to bottom:

```
CLIENT      Next.js      React      TypeScript     Tailwind
SERVER      Node.js      FastAPI    tRPC
DATA        PostgreSQL   Redis      S3
AI          Claude API   OpenAI     pgvector       LangGraph
INFRA       Vercel       AWS        Docker         GitHub Actions
```

Band labels sit at the left edge in mono, `var(--graphite)`, rotated 90° or set horizontally above each band — horizontal is safer and more readable; prefer it.

**Draw-in.** Bands draw top to bottom, scrubbed to scroll. Within a band, node boxes draw left to right, then the connector paths between bands draw.

**Interaction.** On hover of any node: the node's border and all directly connected paths stroke in `var(--signal)`; every unconnected node drops to `0.35` opacity; a mono tooltip appears below the node with one line on why Ship4u uses it. Write a real, specific sentence for each — `"PostgreSQL — relational because most products have relationships, and you will regret JSON columns in month four."` Generic filler here defeats the purpose of the section.

**Mobile:** the diagram does not scale down usefully. Replace it entirely with five grouped mono lists under their band labels, hairline separated. Tapping a technology expands its one-line rationale inline.

---

### 6.7 `06 PRICING` — The inverted band

**This is the only section on the site with a dark background.** It is not dark mode; it is a page turn. Everything about it should feel like the document changed stock.

Full-bleed `var(--ink-flood)`. Type in `var(--paper-on-ink)`. Rules in `var(--rule-on-ink)`. The accent stays `var(--signal)` and reads far more strongly here — use it for exactly two things: the section status chip, and the currency symbol on each price.

The grain overlay switches to `mix-blend-mode: screen` inside this section so the texture survives the inversion.

**Header**, `--type-display-l`:
```
WHAT ARE YOU
BUILDING?
```

**Rows**, not cards. Full width, hairline separated, `96px` tall, expanding on click.

| Service | Starting from |
|---|---|
| Landing page / marketing site | ₹20,000 |
| Full-stack web application | ₹60,000 |
| Custom AI application | ₹75,000 |
| Full-stack mobile application | ₹1,00,000 |
| Deployment & cloud setup | ₹15,000 |
| Maintenance & support | ₹10,000 / month |

Prices set in Geist Mono at `--type-h2`, right-aligned, tabular figures (`font-variant-numeric: tabular-nums`). Indian digit grouping as written above — `₹1,00,000`, not `₹100,000`.

**Row interaction.** Clicking a row expands it downward, `0.45s`, `power4.inOut`, revealing a mono two-column list: what is included, and typical timeline. Only one row open at a time. The row's left edge gains a `2px` `var(--signal)` bar while open. Implement as a proper accordion with `aria-expanded` and `aria-controls`.

**Footnote**, mono, `var(--rule-on-ink)` lightened for legibility:
```
STARTING PRICES. FINAL QUOTE DEPENDS ON SCOPE, INTEGRATIONS
AND TIMELINE, AND IS FIXED IN WRITING BEFORE WORK BEGINS.
```

That last clause matters commercially. Fixed-in-writing is the single most reassuring thing a new studio can say about price, and it costs nothing.

**Entry transition.** As the section top crosses the viewport bottom, the ink flood wipes upward from the bottom edge with a hard `clip-path` edge, over `0.7s`, `power4.inOut`. The progress rail's colours invert in the same tween. No fade.

---

### 6.8 `07 STUDIO`

Two named founders, no photographs. Instead of headshots, each founder gets a **spec block** that reads like a component in the same drawn document.

**Layout.** Two columns on desktop, stacked on mobile, divided by a vertical hairline.

Each block:
- The founder's initial, set in Instrument Serif at `--type-display-l`, `var(--signal)` at `0.12` opacity, positioned as a background graphic behind the block, bleeding off the left edge.
- Name in `--type-h2`.
- Role in mono, `var(--graphite)`.
- One first-person line in Instrument Serif italic, `--type-body-l`. This is serif use two and three of four.
- A mono list, hairline-separated rows: `OWNS`, `BACKGROUND`, `WRITES`.
- Contact: email and one profile link, mono, with an underline that draws on hover.

**Above the two blocks**, a short honest paragraph. Draft:

> Ship4u is two engineers. That is the entire company, deliberately. You talk to the people writing the code, decisions take hours rather than weeks, and nothing is handed to a junior you were never introduced to. It also means we take on a limited number of projects at a time, and we will tell you honestly if yours is not one we should take.

That last sentence is worth keeping. A studio that admits a capacity limit reads as in demand and as honest at the same time, and it pre-empts the most obvious objection to hiring two people.

**Below**, a mono availability line:
```
CURRENT AVAILABILITY — [[AVAILABILITY]]
```

---

### 6.9 `08 SHIP` — Closing and enquiry

**The collapse.** As this section enters, run a short sequence:
1. The manifest rail's rows check off top to bottom, `0.05s` stagger, each tick drawing over `0.2s`.
2. The rail's status chip runs a `MonoRewrite` from `BUILDING` to `SHIPPED`, then turns `var(--signal-deep)`.
3. The progress rail fill reaches `100%` and a hairline underline draws beneath the status chip.

**Headline**, `--type-display-xl`, centred as the one deliberate exception to the no-centred-type rule:
```
LET'S SHIP IT.
```
The full stop in `var(--signal)`, matching the hero. The site opens and closes on the same mark.

**The form.** A real form, not a `mailto:` link. This is the only lead capture on the site and it is the commercial point of the whole build.

Fields:
| Field | Type | Notes |
|---|---|---|
| Name | text | required |
| Email | email | required, validated |
| What are you building? | textarea | required, 3 rows, placeholder: `A marketplace for equipment rental, web and Android` |
| Budget | select | Under ₹50,000 / ₹50,000–₹1,50,000 / ₹1,50,000–₹5,00,000 / Above ₹5,00,000 / Not sure yet |
| Timeline | select | ASAP / 1–3 months / 3–6 months / Exploring |

Styling: no boxes. Each field is a `1px` bottom rule only, label in mono above it, `var(--paper-raised)` fill on focus, and the rule turning `var(--signal)` on focus. Submit button carries the `4` mark and the label `SEND`.

Validation is client-side and inline, messages in mono `var(--signal-deep)` beneath the field. Never use `alert()`.

**API.** `POST /api/enquiry`. Validate server-side. Return `200 { ok: true }`. Log the payload to the server console and leave a clearly commented block showing exactly where to wire a real transport:

```ts
// TODO(ship4u): wire a transport. Options, in order of effort:
//   1. Resend  — `await resend.emails.send({...})`, add RESEND_API_KEY
//   2. Formspree/Web3Forms — POST-forward, no backend key needed
//   3. Supabase/Postgres table — if you want a CRM later
// Until one is wired, enquiries are logged only and WILL BE LOST.
```

That last line must be present. A silently discarded lead form is the single most expensive bug a portfolio site can ship with.

**Success state:** the form clip-wipes out and is replaced in place by a mono confirmation and a drawn tick. No modal, no redirect, no confetti.

**Footer.** Mono throughout, `11px`, hairline top border. Left: `SHIP4U · [[LEGAL_NAME]] · [[LOCATION]]`. Centre: email, and up to two profile links. Right: `© 2026`. Beneath, one final full-width mono line, `var(--graphite)`:

```
THIS SITE WAS BUILT BY SHIP4U. NEXT.JS · TYPESCRIPT · GSAP · THREE.JS · WEBGL.
```

That line is the whole strategy in one sentence. Do not omit it.

---

## 7. COPY REFERENCE

All copy lives in `src/content/*.ts` as typed objects, never inline in components. Section 6 contains the approved copy for each section. Additional required strings:

**Meta description:**
> Ship4u is a two-person development studio building production-ready web, mobile and AI products. Architecture through deployment, fixed quotes, no handoffs.

**The four Instrument Serif lines**, in order of appearance:
1. Interlude: *Every product is a machine. We draw it before we build it.*
2. Studio, founder A: `[[FOUNDER_A_LINE]]`
3. Studio, founder B: `[[FOUNDER_B_LINE]]`
4. Above the form: *Tell us what you are building. We will tell you honestly whether we are the right people to build it.*

**Voice rules for any copy you must write yourself:**
- Short declarative sentences. Concrete nouns.
- Say what is done, not what is enabled. "We ship weekly builds you can open," not "We enable transparent collaboration."
- Specificity over scale. "Under two seconds on a mid-range Android" beats "blazing fast."
- Admit limits. A new studio that names a constraint reads as more credible than one that claims none.
- Never address the reader as "you" more than once per paragraph.

---

## 8. RESPONSIVE BEHAVIOUR

Breakpoints: `640` / `768` / `1024` / `1280` / `1536`.

Mobile is designed, not degraded. Specific mandates:

| Section | Below 768px |
|---|---|
| 00 Hero | Display scales to `clamp(2.75rem, 13vw, 4rem)`. Headline stays three lines. Manifest annotation block hidden. Buttons stack full width. |
| 01 Capabilities | Unpin. The SVG becomes four separate static illustrations at the final state of each stage, each above its copy block. Do not attempt a pinned scrub on a touch device. |
| 02 Work | Hero case study unpins; image, then breakdown, then metrics, stacked. Supporting rows show a permanent thumbnail rather than a hover preview. |
| 03 Interlude | Static SVG only. Three.js never loads. |
| 04 Process | Vertical list with a left hairline and a travelling dot. |
| 05 Stack | Grouped mono lists, tap to expand rationale. No diagram. |
| 06 Pricing | Rows stack to two lines — service above, price below, right-aligned. Accordion behaviour unchanged. |
| 07 Studio | Blocks stack. Background initials reduce to `0.08` opacity. |
| 08 Ship | Form fields full width. Headline scales to `clamp(2.5rem, 12vw, 4rem)`. |

**Touch:** every pinned scrub section is unpinned below `768px`. Scroll-jacking on touch is the fastest way to make a site feel broken. Horizontal drag is permitted only where it is the native gesture.

**Tap targets:** minimum `44 × 44px`. The manifest rail rows on mobile must meet this.

---

## 9. PERFORMANCE AND ACCESSIBILITY

### 9.1 Budget

| Metric | Target |
|---|---|
| LCP (mobile, 4G throttle) | < 2.0s |
| CLS | < 0.02 |
| INP | < 200ms |
| Initial JS (gzip, excl. Three.js) | < 180KB |
| Three.js chunk | lazy, desktop only, never in initial bundle |
| Lighthouse Performance — desktop | ≥ 95 |
| Lighthouse Performance — mobile | ≥ 85 |
| Lighthouse Accessibility | ≥ 95 |

### 9.2 Required practices

- Fonts via `next/font`, self-hosted, `display: swap`, subset to `latin`. Preload the two Geist faces. Do not preload Instrument Serif; it is below the fold.
- All raster images through `next/image`, AVIF with WebP fallback, explicit `width`/`height`, `priority` on the hero case study image only.
- Every SVG is inline in the component, not an `<img>`, so it can be animated and so it inherits `currentColor`.
- `will-change` applied only to elements currently animating, and removed on completion.
- Animate `transform`, `opacity` and `clip-path` only. Never animate `width`, `height`, `top`, `left`, or `box-shadow`.
- Debounce `ScrollTrigger.refresh()` on resize at 150ms.

### 9.3 Accessibility

- Semantic landmarks: one `<header>`, one `<main>`, `<section>` per numbered section with `aria-labelledby` pointing at its heading.
- Heading order strictly descending. The hero is the only `<h1>`.
- Focus visible: `2px` `var(--signal)` outline with `2px` offset. Never `outline: none` without a replacement.
- The manifest rail is a `<nav aria-label="Sections">` with real buttons.
- The pricing accordion uses `aria-expanded` and `aria-controls` correctly.
- Decorative SVG carries `aria-hidden="true"`. Informational SVG carries a `<title>`.
- The WebGL canvas is `aria-hidden` and keyboard-inert; all information it conveys is decorative.
- Test the whole page with the keyboard alone, including the form, before declaring the build complete.

---

## 10. METADATA AND SEO

### 10.1 Required

- `title`: `Ship4u — Web, Mobile and AI Product Development`
- `description`: as in Section 7.
- Canonical URL, `robots: index, follow`, `lang="en-IN"`.
- `Organization` + `ProfessionalService` JSON-LD in `layout.tsx`, including `name`, `description`, `areaServed: "IN"`, `url`, `email`, and `priceRange: "₹₹"`.
- `sitemap.ts` and `robots.ts` in `app/`.

### 10.2 Practical note

A single-page site with all content in the DOM at load ranks fine. Do not lazy-mount sections behind scroll triggers in a way that removes their text from the initial HTML — animate presentation, never presence. Every word on this site must be in the server-rendered markup.

### 10.3 OG image

Generate with `next/og` in `app/opengraph-image.tsx`, `1200 × 630`: `var(--paper)` background, the `SHIP4U` wordmark with the accent `4` at large size, the positioning line beneath in Geist Mono, a hairline border inset `32px`. No photography, no gradient.

---

## 11. PLACEHOLDER HANDLING

The client has no published case studies and no finalised founder details yet. Placeholders are therefore unavoidable — but placeholder metrics that leak into production are worse than no metrics at all, because they are a lie a prospective client can catch.

### 11.1 Mechanism

Every placeholder value lives in `src/content/` and its containing entry carries a flag:

```ts
export const work: Project[] = [
  {
    __placeholder: true,
    code: "W-01",
    name: "[[WORK_1_NAME]]",
    // ...
  },
];
```

Requirements:

1. `src/components/ui/Placeholder.tsx` wraps any placeholder value. In `development` it renders the child with a `1px dashed var(--signal)` outline and a mono `PLACEHOLDER` tag in the corner. In `production` it renders the child plain, with no outline.
2. A build-time check in `next.config` or an npm `prebuild` script scans `src/content/` for `__placeholder: true` and `[[` tokens, and prints a bright console warning listing every unreplaced item with its file and line. It **warns**, it does not fail the build — the client needs to be able to deploy a staging version.
3. `PLACEHOLDERS.md` is generated at the repo root listing every token, the file it lives in, and a one-line note on what real content should go there.

### 11.2 Token list

| Token | File | Replace with |
|---|---|---|
| `[[LOCATION]]` | `site.ts` | e.g. `INDIA · REMOTE` |
| `[[LEGAL_NAME]]` | `site.ts` | Registered or trading name |
| `[[EMAIL]]` | `site.ts` | Contact address |
| `[[AVAILABILITY]]` | `studio.ts` | e.g. `TAKING PROJECTS FROM NOVEMBER` |
| `[[FOUNDER_A_NAME]]` `[[FOUNDER_A_ROLE]]` `[[FOUNDER_A_LINE]]` `[[FOUNDER_A_OWNS]]` `[[FOUNDER_A_EMAIL]]` `[[FOUNDER_A_LINK]]` | `studio.ts` | Founder one |
| `[[FOUNDER_B_*]]` | `studio.ts` | Founder two, same fields |
| `[[WORK_1_NAME]]` `[[WORK_1_PROBLEM]]` `[[WORK_1_BUILT]]` `[[WORK_1_STACK]]` `[[WORK_1_METRIC_1..3]]` `[[WORK_1_YEAR]]` | `work.ts` | Hero case study |
| `[[WORK_2_*]]` `[[WORK_3_*]]` | `work.ts` | Supporting projects |

### 11.3 Placeholder imagery

`public/work/` gets three generated placeholder images at `1600 × 1000`: `var(--paper-sunk)` background, a hairline grid, corner registration crosses, and a centred mono label reading `PLACEHOLDER — REPLACE BEFORE LAUNCH`. Generate them as SVG. Never use stock photography, never use an AI-generated image, never use a screenshot of another company's product.

### 11.4 Placeholder metrics

Use structurally realistic but obviously provisional values, never plausible-looking specifics:

- Good: `—% faster`, `0.0s LCP`, `[metric]`
- Bad: `47% faster`, `1.2s LCP`, `3,200 users`

A number that looks real will end up in production. A visible blank will not.

---

## 12. BUILD PHASES

Work in order. Verify each phase's criteria before starting the next.

### Phase 1 — Foundation
Scaffold Next.js + TypeScript + Tailwind. Implement all colour and type tokens. Wire the three fonts. Build `Grain`, `GridOverlay`, `SectionHeader`, `MonoLabel`, `Button`, `Placeholder`. Create every file in `src/content/` with full typed data, including all placeholder tokens. Build the page as a plain, unanimated, fully typeset document — all eight sections, all real copy, correct hierarchy, correct spacing, zero motion.

**Acceptance:** the site is complete, readable, correctly typeset and fully responsive with JavaScript disabled. If it does not look good motionless, no amount of animation will save it. Do not proceed until this is true.

### Phase 2 — Chrome and scroll
Wire GSAP + Lenis per 4.3. Build `ProgressRail`, the manifest rail, and `Cursor`. Implement `useReducedMotion` and the full reduced-motion path. Build the reveal primitives: `RuleRevealText`, `MonoRewrite`, `DigitRoll`.

**Acceptance:** smooth scroll works, the rail tracks sections accurately, section codes update correctly, the reduced-motion path renders every section complete and unanimated.

### Phase 3 — Scene choreography
Implement, in order: hero load and scroll (6.1), pricing inversion (6.7), process track (6.5), work zoom (6.3), capabilities build system (6.2), stack schematic (6.6), closing collapse (6.9).

The capabilities SVG is the hardest piece in the build and the one most worth the effort. Budget accordingly.

**Acceptance:** every pinned section releases cleanly, no scroll drift, no jump on refresh mid-page, `ScrollTrigger.refresh()` after `document.fonts.ready` is in place.

### Phase 4 — WebGL and forms
Build `WireObject` (6.4) with dynamic import, intersection gating, desktop-only loading, and the static SVG fallback. Build the enquiry form and `POST /api/enquiry` with the wiring comment intact.

**Acceptance:** Three.js is absent from the initial bundle and absent entirely on mobile. Form validates, submits, returns 200, shows the in-place success state, and logs a clear warning that enquiries are not yet delivered anywhere.

### Phase 5 — Hardening
Metadata, JSON-LD, sitemap, robots, OG image. Full keyboard pass. Lighthouse against the 9.1 budget on both desktop and mobile. Generate `PLACEHOLDERS.md`. Write a README covering local setup, where content lives, how to replace placeholders, and how to wire the form transport.

**Acceptance:** all 9.1 targets met, zero console errors or warnings, `PLACEHOLDERS.md` accurate and complete.

---

## 13. FINAL CHECK

Before declaring the build complete, confirm every line:

- [ ] No purple, no gradients, no glow, no glass, no blobs anywhere in the codebase.
- [ ] No emoji in any file, including comments and the README.
- [ ] No dark mode, no theme toggle.
- [ ] Instrument Serif appears exactly four times.
- [ ] The accent colour appears no more than four times per viewport.
- [ ] Every price from Section 6.7 is present and correct, with Indian digit grouping.
- [ ] Nothing fades in with the default `opacity/translateY` pattern.
- [ ] Every placeholder is visibly marked in development and listed in `PLACEHOLDERS.md`.
- [ ] No invented metric could be mistaken for a real one.
- [ ] The form does not silently discard submissions without warning in the console.
- [ ] The entire page is keyboard-navigable with visible focus.
- [ ] `prefers-reduced-motion` renders every section fully and correctly.
- [ ] The site is complete and legible with JavaScript disabled.
- [ ] Three.js does not load on mobile or in the initial bundle.
- [ ] The final footer line naming the stack is present.

---

## 14. ONE INSTRUCTION ABOVE ALL OTHERS

This site's only job is to make a stranger think: *if they built this for themselves, I want to know what they would build for me.*

That happens through precision, not volume. A section that is perfectly typeset, perfectly timed and perfectly restrained will do more for Ship4u than three sections crammed with effects. If a choice arises between adding something impressive and finishing something properly, finish it properly.

Build fewer things, better.