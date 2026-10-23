// Collects members/*.json into dist/members.json and copies the site.
import { readdirSync, readFileSync, mkdirSync, writeFileSync, cpSync } from "node:fs";

const members = readdirSync("members")
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  .map((f) => JSON.parse(readFileSync(`members/${f}`, "utf8")))
  .sort((a, b) => a.name.localeCompare(b.name));

mkdirSync("dist", { recursive: true });
writeFileSync("dist/members.json", JSON.stringify(members, null, 2));
cpSync("site", "dist", { recursive: true });
console.log(`Built the wall: ${members.length} member${members.length === 1 ? "" : "s"}.`);
