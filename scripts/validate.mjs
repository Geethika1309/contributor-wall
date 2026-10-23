// Checks a contributor-wall pull request.
// In CI:   node scripts/validate.mjs --base <sha> --head <sha> --author <login>
//          (reads the pull request's files from git, so they never touch the disk)
// Locally: node scripts/validate.mjs members/<username>.json
import { readFileSync, existsSync, appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const errors = [];
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? null : args[i + 1];
};

const base = flag("--base");
const head = flag("--head") || "HEAD";
const author = flag("--author");
const ALLOWED = ["name", "github", "year", "learning"];
const FILE_RE = /^members\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\.json$/;
// Pull requests that only touch these are issue work, reviewed by a maintainer instead.
const CODE_RE = /^(site\/|scripts\/|\.github\/|README\.md$|setup\.sh$|LICENSE$|\.gitignore$)/;

let files;
if (base) {
  const out = execFileSync("git", ["diff", "--name-status", `${base}...${head}`], { encoding: "utf8" }).trim();
  const rows = out ? out.split("\n").map((l) => l.split("\t")) : [];
  if (rows.length && rows.every((r) => r.slice(1).every((p) => CODE_RE.test(p)))) {
    const msg = "This pull request changes code, not a member file. A maintainer must review it before merging.";
    console.log(msg);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, "### ⚠️ " + msg + "\n");
    process.exit(0);
  }
  if (rows.length !== 1) {
    errors.push(
      `This pull request changes ${rows.length} files. It must change exactly one: members/<your-username>.json.` +
        (rows.length ? `\n  Files changed: ${rows.map((r) => r[r.length - 1]).join(", ")}` : "")
    );
  }
  for (const r of rows) {
    if (r[0] === "D") errors.push(`Don't delete files. You deleted ${r[1]}.`);
    if (r[0].startsWith("R")) errors.push(`Don't rename files. You renamed ${r[1]} to ${r[2]}.`);
  }
  files = rows.filter((r) => r[0] === "A" || r[0] === "M").map((r) => r[1]);
} else {
  files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) errors.push("Give a file to check, e.g. node scripts/validate.mjs members/octocat.json");
}

for (const file of files) {
  const m = file.match(FILE_RE);
  if (!m) {
    errors.push(`${file}: your file must be inside the members folder and named <your-github-username>.json.`);
    continue;
  }
  const username = m[1];
  if (author && username.toLowerCase() !== author.toLowerCase()) {
    errors.push(`${file}: you're signed in as "${author}", so your file must be members/${author}.json.`);
  }
  if (!base && !existsSync(file)) {
    errors.push(`${file}: file not found.`);
    continue;
  }
  const raw = base ? execFileSync("git", ["show", `${head}:${file}`], { encoding: "utf8" }) : readFileSync(file, "utf8");
  if (raw.length > 1000) errors.push(`${file}: the file is too long. Keep just the four fields.`);
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    errors.push(`${file}: this isn't valid JSON. Check for a missing comma, a missing quote, or a comma after the last line.\n  (${e.message})`);
    continue;
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    errors.push(`${file}: the file must be one { ... } object.`);
    continue;
  }
  for (const key of Object.keys(data)) {
    if (!ALLOWED.includes(key)) errors.push(`${file}: remove the field "${key}". Only ${ALLOWED.join(", ")} are allowed.`);
  }
  for (const key of ALLOWED) {
    if (!(key in data)) errors.push(`${file}: add the field "${key}".`);
  }
  for (const key of ["name", "learning"]) {
    if (key in data && (typeof data[key] !== "string" || !data[key].trim() || data[key].length > 60)) {
      errors.push(`${file}: "${key}" must be text in quotes, 1 to 60 characters.`);
    }
  }
  if ("github" in data && (typeof data.github !== "string" || data.github.toLowerCase() !== username.toLowerCase())) {
    errors.push(`${file}: "github" must be "${username}", the same as your file name.`);
  }
  if ("year" in data && ![1, 2, 3, 4].includes(data.year)) {
    errors.push(`${file}: "year" must be a number 1 to 4, with no quotes around it.`);
  }
}

const summary = process.env.GITHUB_STEP_SUMMARY;
if (errors.length) {
  const msg = "Almost there. Fix these and commit again:\n\n" + errors.map((e) => "- " + e).join("\n");
  console.error(msg);
  if (summary) appendFileSync(summary, "### ❌ Not yet\n\n" + msg + "\n");
  process.exit(1);
} else {
  const msg = "All good. You're on the wall once this is merged.";
  console.log(msg);
  if (summary) appendFileSync(summary, "### ✅ " + msg + "\n");
}
