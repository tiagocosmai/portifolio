/**
 * Regenerates src/data/courses.json from src/data/courses.txt (Portuguese source).
 * Run: npm run sync:courses
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const raw = readFileSync(join(root, "src/data/courses.txt"), "utf8");
const [distRaw, rest] = raw.split("===PRESENCIAL===");
const [presRaw, evRaw] = (rest ?? "").split("===EVENTOS===");

const distance = [];
const distTrim = (distRaw ?? "").trim();
const blocks = distTrim.split(/\n(?====)/);
for (const block of blocks) {
  const t = block.trim();
  if (!t.startsWith("===")) continue;
  const lines = t.split("\n");
  const first = lines[0]
    .replace(/^===+\s*/, "")
    .replace(/\s*===+\s*$/, "")
    .trim();
  if (!first) continue;
  const pipe = first.indexOf("|");
  const provider = pipe === -1 ? first : first.slice(0, pipe).trim();
  const url = pipe === -1 ? "" : first.slice(pipe + 1).trim();
  const items = lines
    .slice(1)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((pt) => ({ pt }));
  if (provider && items.length) distance.push({ provider, url, items });
}
const presential = (presRaw ?? "")
  .trim()
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .map((pt) => ({ pt }));

/** Event line: `título… || https://…` → `{ pt, url? }` */
function parseEventLine(line) {
  const sep = " || ";
  const i = line.lastIndexOf(sep);
  if (i === -1) return { pt: line };
  const pt = line.slice(0, i).trim();
  const url = line.slice(i + sep.length).trim();
  if (!pt || !url || !/^https?:\/\//i.test(url)) return { pt: line };
  return { pt, url };
}

const events = (evRaw ?? "")
  .trim()
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .map(parseEventLine);

writeFileSync(
  join(root, "src/data/courses.json"),
  JSON.stringify({ distance, presential, events }, null, 2) + "\n",
);
console.log(
  "courses.json:",
  distance.reduce((n, g) => n + g.items.length, 0),
  "distance +",
  presential.length,
  "presential +",
  events.length,
  "events",
);
