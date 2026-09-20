# Ship4u

Marketing site for Ship4u, a two-person development studio. One page, eight sections, built as a technical document that assembles itself as you read it.

Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, GSAP with ScrollTrigger, Lenis, three.js for one WebGL interlude. Fonts: Geist Sans, Geist Mono, Instrument Serif.

The full specification the site was built from is `prompt.md`.

## Local setup

Requirements: Node 20 or later, npm 10 or later.

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000`. Press `G` in development to toggle the 12-column grid overlay.

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Runs the placeholder audit, then `next build` |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run placeholders` | Prints every unreplaced placeholder and regenerates `PLACEHOLDERS.md` |

## Where content lives

Every word on the site is in `src/content/`, typed by `src/types/content.ts`. Components read from these files and contain no copy of their own.

| File | Contents |
|---|---|
| `site.ts` | Name, legal name, location, email, profiles, page title and description, footer colophon, canonical URL |
| `sections.ts` | Section codes and titles, hero copy, interlude line, ship section copy, form labels, options, validation messages |
| `services.ts` | The four capability stages and the two support-band rows |
| `work.ts` | The hero case study and two supporting projects |
| `process.ts` | The seven process stages |
| `stack.ts` | Five stack bands, eighteen nodes with rationale, and the schematic connections |
| `pricing.ts` | Six pricing rows with amounts, included items and timelines |
| `studio.ts` | Studio paragraph, two founders, availability |

Edit these files and the site updates. Do not put copy in components.

## Replacing placeholders

Provisional content is marked two ways: a `[[TOKEN]]` string, and a `__placeholder: true` flag on the containing entry. In development every placeholder renders with a dashed outline and a `PLACEHOLDER` tag; in production it renders as plain text.

`PLACEHOLDERS.md` lists every token, the file and line it lives in, and what real content belongs there. It is regenerated on every build and by `npm run placeholders`. The build warns about remaining placeholders but never fails on them, so a staging deploy is always possible.

To replace one:

1. Open the file named in `PLACEHOLDERS.md` and replace the `[[TOKEN]]` string.
2. When every field in an entry is real, remove its `__placeholder: true` flag.
3. Run `npm run placeholders` and confirm the list is shorter.

Some notes that go beyond string tokens:

- Work images in `public/work/` are generated placeholders. Replace with real 1600 x 1000 assets and update the `image` fields in `work.ts`.
- The hero case study metrics use deliberately unreal values (`—%`, `0.0s`, `[metric]`). Replace only with measured figures; a plausible-looking number will end up in production.
- Supporting projects have `href: null`, which renders them as plain rows with no link and no hover state. Set a URL only when a case study page exists.
- Profile URLs and the studio email are omitted from the JSON-LD until they are real.

## Wiring the form transport

The enquiry form posts to `POST /api/enquiry` (`src/app/api/enquiry/route.ts`). The route validates server-side and emails the payload with [Resend](https://resend.com). Copy `.env.example` to `.env` and replace `re_xxxxxxxxx` with your real API key from [resend.com/api-keys](https://resend.com/api-keys). The route accepts both JSON (the form with JavaScript) and form-encoded bodies (the same form with JavaScript disabled); keep both paths working.

`onboarding@resend.dev` is Resend's test sender. It can only deliver to the email on the Resend account. For production, verify `ship4u.in` at [resend.com/domains](https://resend.com/domains) and set `RESEND_FROM` to an address on that domain.

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL. Drives the sitemap, robots, Open Graph URL and JSON-LD. | `http://localhost:3000` |
| `RESEND_API_KEY` | Resend API key used by `POST /api/enquiry`. Required for the form to deliver. | — |
| `ENQUIRY_TO` | Inbox that receives form submissions. | `contact@ship4u.in` (`site.email`) |
| `RESEND_FROM` | From address. Must be a verified Resend domain in production. | `Ship4u <onboarding@resend.dev>` |

Set `NEXT_PUBLIC_SITE_URL` to the production origin (for example `https://ship4u.dev`) before deploying. Set `RESEND_API_KEY` (and the from/to addresses) in the host's environment as well.

## Accessibility and motion

- The document is complete and legible with JavaScript disabled. An inline head script adds `js` to `<html>` so that pre-animation states only apply when GSAP will animate them.
- The same script arms a 900 ms hydration deadline. If React has not mounted by then, `<html>` gains `late`, the hero's pre-animation states lift and the load choreography is skipped so the page never waits on JavaScript. Scroll choreography still runs.
- `prefers-reduced-motion: reduce` disables Lenis, every scrub and every pin. Sections render in their final state; the only transitions left are colour and opacity at 200 ms or less.
- Below 768px nothing is pinned. The process track is vertical, the capabilities drawing is four static illustrations, the stack schematic is five expandable lists, and three.js is never loaded.
- three.js is loaded with `next/dynamic` only when the interlude is within 300px of the viewport on a desktop that allows motion and has WebGL. It is not in the initial bundle.

## Notes on the toolchain

- Tailwind CSS v4 is configured entirely in `src/app/globals.css` through `@theme inline`; there is no `tailwind.config.ts`. The specification's reference to a Tailwind config in section 4.3 predates v4.
- `@gsap/react` is included for `useGSAP`. It is the only runtime dependency beyond the specification's list. `subset-font` is a dev dependency used only by the font script below.
- All GSAP animation is scoped to a component subtree and torn down on unmount. Only `transform`, `opacity`, `clip-path` and SVG dash values are animated.
- Geist Sans and Geist Mono are taken from the `geist` package but served as latin subsets from `src/app/fonts/` (about 33 KB each instead of 70 KB), loaded through `next/font/local` and preloaded. After upgrading `geist`, run `npm run fonts` to regenerate them. Instrument Serif comes from `next/font/google`, latin subset, not preloaded.

## Performance

Measured with `npx lighthouse` against `next start` on this machine (Lighthouse 13, simulated 4G and 4x CPU slowdown for mobile):

| | Desktop | Mobile |
|---|---|---|
| Performance | 98 | 85 to 88 |
| Accessibility | 97 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 0.8 s | 3.2 s |
| CLS | 0 | 0 |
| TBT | 120 ms | 250 to 330 ms |

Two items from the specification's budget (section 9.1) are not met and are structural rather than fixable in this codebase:

- Initial JavaScript is about 201 KB gzipped against a 180 KB budget. Of that, React 19 and the Next.js 16 app-router runtime are 131 KB and GSAP with ScrollTrigger 41 KB, before any site code. Three.js is not included and never loads on mobile.
- Simulated mobile LCP is 3.2 s against a 2.0 s budget. The LCP element is the hero paragraph, which the specification's load choreography reveals from JavaScript at 0.9 s. The hydration deadline caps the worst case on slow devices, but Lighthouse's model still charges the script download and hydration to it. On a real device with a warm CDN the figure is lower; measure with field data once deployed.

The desktop accessibility score of 97 is one axe contrast finding on the hero's `100 / READY` counter, which the specification sets at 60 percent graphite after it settles. It is decorative and hidden from assistive technology.

## Project layout

```
src/
  app/            layout, page, globals.css, fonts/, api/enquiry, opengraph-image, sitemap, robots, icon
  components/
    chrome/       ProgressRail, ManifestRail, Cursor, Grain, GridOverlay, ScrollProvider
    sections/     S00Index .. S08Ship and their client-side scene wrappers
    scenes/       BuildSystemSVG, StackSchematic, ProcessGlyphs, WireStatic, WireObject, WireMount
    ui/           SectionHeader, MonoLabel, Button, Placeholder, StatusChip, MonoRewrite, DigitRoll, RuleRevealText, Icons
  content/        all copy, typed
  lib/            gsap.ts, motion.ts, sectionStore.ts, useReducedMotion.ts, enquiry.ts, mail.ts
  types/          content types
scripts/
  placeholders.mjs
  subset-fonts.mjs
public/
  work/           placeholder images
```
