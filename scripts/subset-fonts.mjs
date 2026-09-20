#!/usr/bin/env node
/**
 * Latin subsets of the two preloaded Geist faces.
 *
 *   node scripts/subset-fonts.mjs
 *
 * Reads the variable woff2 files shipped by the `geist` package and writes
 * latin-only copies to src/app/fonts/, which app/layout.tsx loads through
 * next/font/local. Run it again after upgrading `geist`.
 *
 * The subset is Google Fonts' `latin` unicode-range plus the handful of
 * symbols the site sets in these faces: the rupee sign, arrows, minus and
 * division slash, and the general punctuation block (dashes, quotes, bullets).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "node_modules", "geist", "dist", "fonts");
const out = path.join(root, "src", "app", "fonts");

const RANGES = [
  [0x0000, 0x00ff], // Basic Latin + Latin-1 Supplement
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f], // General Punctuation
  [0x20ac, 0x20ac], // Euro
  [0x20b9, 0x20b9], // Rupee
  [0x2122, 0x2122],
  [0x2191, 0x2193], // Arrows up, right, down
  [0x2212, 0x2212], // Minus
  [0x2215, 0x2215], // Division slash
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
];

const FACES = [
  ["geist-sans/Geist-Variable.woff2", "Geist-Variable-latin.woff2"],
  ["geist-mono/GeistMono-Variable.woff2", "GeistMono-Variable-latin.woff2"],
];

let text = "";
for (const [from, to] of RANGES) {
  for (let cp = from; cp <= to; cp++) text += String.fromCodePoint(cp);
}

await mkdir(out, { recursive: true });
for (const [input, output] of FACES) {
  const buffer = await readFile(path.join(src, input));
  const subset = await subsetFont(buffer, text, { targetFormat: "woff2" });
  await writeFile(path.join(out, output), subset);
  console.log(
    `[ship4u] ${output}: ${Math.round(buffer.length / 1024)} KB -> ${Math.round(subset.length / 1024)} KB`,
  );
}
