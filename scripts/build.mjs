// Collects members/*.json into dist/members.json and copies the site.
import { readdirSync, readFileSync, mkdirSync, writeFileSync, cpSync } from "node:fs";
import { execFileSync } from "node:child_process";

// When each member file was first added, from git history. Empty if there's no history.
const joined = {};
try {
  const log = execFileSync("git", ["log", "--diff-filter=A", "--format=%cI", "--name-only", "--", "members"], { encoding: "utf8" });
  let date;
  for (const line of log.split("\n")) {
    if (/^\d{4}-\d\d-\d\dT/.test(line)) date = line;
    else if (line) joined[line] = date; // the log is newest first, so the oldest add is kept
  }
} catch {}

const members = readdirSync("members")
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  .map((f) => ({ ...JSON.parse(readFileSync(`members/${f}`, "utf8")), joined: joined[`members/${f}`] || null }))
  .sort((a, b) => (a.joined || "").localeCompare(b.joined || "") || a.name.localeCompare(b.name));

mkdirSync("dist", { recursive: true });
writeFileSync("dist/members.json", JSON.stringify(members, null, 2));
cpSync("site", "dist", { recursive: true });
console.log(`Built the wall: ${members.length} member${members.length === 1 ? "" : "s"}.`);
