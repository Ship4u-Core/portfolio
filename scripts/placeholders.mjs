#!/usr/bin/env node
/**
 * Placeholder audit for src/content/.
 *
 *   node scripts/placeholders.mjs           warn about every unreplaced item
 *   node scripts/placeholders.mjs --write   also regenerate PLACEHOLDERS.md
 *
 * Runs as the npm `prebuild` script. It warns, it never fails the build:
 * a staging deploy with placeholders must remain possible.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "src", "content");
const outFile = path.join(root, "PLACEHOLDERS.md");
const write = process.argv.includes("--write");

/* One-line notes on what real content belongs in each token. Tokens found in
   the content but missing here fall back to a generic note, so the file never
   silently omits anything. */
const NOTES = {
  LOCATION: "Where the studio is based, e.g. INDIA · REMOTE",
  LEGAL_NAME: "Registered or trading name, shown in the footer",
  EMAIL: "Studio contact address; also enables the mailto link in the footer",
  GITHUB_URL: "Studio or founder GitHub profile URL; omitted from JSON-LD until set",
  LINKEDIN_URL: "Studio or founder LinkedIn URL; omitted from JSON-LD until set",
  AVAILABILITY: "Current availability line, e.g. TAKING PROJECTS FROM NOVEMBER",
  FOUNDER_A_NAME: "Founder one, full name",
  FOUNDER_A_ROLE: "Founder one, role in a few words, e.g. ARCHITECTURE · BACKEND",
  FOUNDER_A_LINE: "Founder one, one sentence on what they do at Ship4u",
  FOUNDER_A_OWNS: "Founder one, the parts of a project they own",
  FOUNDER_A_BACKGROUND: "Founder one, one line of relevant background",
  FOUNDER_A_WRITES: "Founder one, languages and tools they write in",
  FOUNDER_A_EMAIL: "Founder one, direct email",
  FOUNDER_A_LINK: "Founder one, one external profile URL",
  FOUNDER_A_LINK_LABEL: "Founder one, label for that link, e.g. GITHUB",
  FOUNDER_B_NAME: "Founder two, full name",
  FOUNDER_B_ROLE: "Founder two, role in a few words, e.g. PRODUCT · FRONTEND",
  FOUNDER_B_LINE: "Founder two, one sentence on what they do at Ship4u",
  FOUNDER_B_OWNS: "Founder two, the parts of a project they own",
  FOUNDER_B_BACKGROUND: "Founder two, one line of relevant background",
  FOUNDER_B_WRITES: "Founder two, languages and tools they write in",
  FOUNDER_B_EMAIL: "Founder two, direct email",
  FOUNDER_B_LINK: "Founder two, one external profile URL",
  FOUNDER_B_LINK_LABEL: "Founder two, label for that link, e.g. LINKEDIN",
  WORK_1_NAME: "Hero case study, project name",
  WORK_1_YEAR: "Hero case study, year shipped",
  WORK_1_DURATION: "Hero case study, engagement length, e.g. 14 WEEKS",
  WORK_1_DESCRIPTION: "Hero case study, one-line description",
  WORK_1_PROBLEM: "Hero case study, two or three lines under THE PROBLEM",
  WORK_1_BUILT: "Hero case study, two or three lines under WHAT WE BUILT",
  WORK_1_STACK: "Hero case study, mono stack string",
  WORK_1_METRIC_1: "Hero case study, first real result metric label; set display to the real value",
  WORK_1_METRIC_2: "Hero case study, second real result metric label; set display to the real value",
  WORK_1_METRIC_3: "Hero case study, third real result metric label; set display to the real value",
  WORK_2_NAME: "Supporting project two, name; set href to enable the row link",
  WORK_2_YEAR: "Supporting project two, year",
  WORK_2_DESCRIPTION: "Supporting project two, one-line description",
  WORK_2_STACK: "Supporting project two, mono stack string",
  WORK_3_NAME: "Supporting project three, name; set href to enable the row link",
  WORK_3_YEAR: "Supporting project three, year",
  WORK_3_DESCRIPTION: "Supporting project three, one-line description",
  WORK_3_STACK: "Supporting project three, mono stack string",
};

const TOKEN = /\[\[([A-Z0-9_]+)\]\]/g;

async function scan() {
  const files = (await readdir(contentDir)).filter((f) => f.endsWith(".ts")).sort();
  const tokens = [];
  const flags = [];
  for (const file of files) {
    const text = await readFile(path.join(contentDir, file), "utf8");
    text.split(/\r?\n/).forEach((line, i) => {
      const lineNo = i + 1;
      if (/__placeholder:\s*true/.test(line)) flags.push({ file, line: lineNo });
      for (const m of line.matchAll(TOKEN)) {
        tokens.push({ token: m[0], name: m[1], file, line: lineNo });
      }
    });
  }
  return { tokens, flags };
}

function report({ tokens, flags }) {
  const bright = (s) => `\x1b[1m\x1b[33m${s}\x1b[0m`;
  const dim = (s) => `\x1b[2m${s}\x1b[0m`;
  if (tokens.length === 0 && flags.length === 0) {
    console.log("\x1b[32m[ship4u] No placeholders in src/content.\x1b[0m");
    return;
  }
  console.log("");
  console.log(bright(`[ship4u] ${tokens.length} placeholder token(s) and ${flags.length} flagged entr(y/ies) remain in src/content/`));
  console.log(bright("[ship4u] These render with a PLACEHOLDER outline in development and as plain text in production."));
  console.log("");
  const seen = new Set();
  for (const t of tokens) {
    const key = `${t.file}:${t.line}:${t.token}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  ${bright(t.token.padEnd(26))} ${dim(`src/content/${t.file}:${t.line}`)}`);
  }
  console.log("");
  console.log(dim("  Full list with notes: PLACEHOLDERS.md (regenerate with `node scripts/placeholders.mjs --write`)."));
  console.log("");
}

function markdown({ tokens, flags }) {
  const byName = new Map();
  for (const t of tokens) {
    const entry = byName.get(t.name) ?? { name: t.name, locations: [] };
    entry.locations.push(`${t.file}:${t.line}`);
    byName.set(t.name, entry);
  }
  const rows = [...byName.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) => {
      const note = NOTES[e.name] ?? "Replace with real content";
      const where = [...new Set(e.locations)].map((l) => `\`src/content/${l}\``).join(", ");
      return `| \`[[${e.name}]]\` | ${where} | ${note} |`;
    });

  const flagRows = flags.map((f) => `- \`src/content/${f.file}:${f.line}\``);

  return `# Placeholders

Generated by \`scripts/placeholders.mjs\`. Do not edit by hand; run
\`node scripts/placeholders.mjs --write\` after changing anything in \`src/content/\`.

Every value below is provisional. In development each one renders with a
dashed outline and a \`PLACEHOLDER\` tag; in production it renders as plain text,
which is why this list must reach zero before launch.

## Tokens (${rows.length})

| Token | File | Replace with |
|---|---|---|
${rows.join("\n")}

## Entries flagged \`__placeholder: true\` (${flags.length})

Remove the flag once every field in the entry is real.

${flagRows.join("\n")}

## Not tokens, but provisional

- \`public/work/placeholder-01.svg\`, \`placeholder-02.svg\`, \`placeholder-03.svg\`: generated placeholder images. Replace with real 1600 x 1000 assets and update \`image\` in \`src/content/work.ts\`.
- Hero case study metric \`display\` values (\`—%\`, \`0.0s\`, \`[metric]\`) are deliberately unreal. Replace only with measured figures.
- \`href: null\` on supporting projects keeps the rows unlinked. Set a URL only when a case study page exists.
- \`NEXT_PUBLIC_SITE_URL\` (environment variable) drives the canonical URL, sitemap, robots and JSON-LD. Defaults to \`http://localhost:3000\`.
- \`src/app/api/enquiry/route.ts\` has no transport wired. Enquiries are logged to the server console only and WILL BE LOST until one is added.
`;
}

const result = await scan();
report(result);
if (write) {
  await writeFile(outFile, markdown(result), "utf8");
  console.log(`[ship4u] Wrote ${path.relative(root, outFile)}`);
}
