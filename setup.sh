#!/usr/bin/env bash
# One-time setup. Needs the GitHub CLI (gh) logged in as an org owner.
# Usage: ./setup.sh <your-org>
set -euo pipefail
ORG="${1:?Usage: ./setup.sh <your-org>}"
REPO="$ORG/contributor-wall"

git init -q -b main 2>/dev/null || true
git add -A
git commit -qm "Start the contributor wall" || true
gh repo create "$REPO" --public --source . --push \
  --description "Everyone in GitHub Community GITAM, one pull request each."

# Publish the wall with GitHub Pages, built by Actions
gh api -X POST "repos/$REPO/pages" -f build_type=workflow >/dev/null || echo "Turn on Pages by hand: Settings > Pages > Source: GitHub Actions"

gh label create "good first issue" --repo "$REPO" --color 7057ff --force >/dev/null

issue () { gh issue create --repo "$REPO" --label "good first issue" --title "$1" --body "$2" >/dev/null; echo "  issue: $1"; }

issue "Design the wall: turn the plain list into cards" \
"The page in \`site/index.html\` is a plain list. Turn each member into a card with their GitHub avatar (\`https://github.com/<username>.png\`), name, year and what they're learning. Plain HTML and CSS only, no frameworks. It must still work on a phone."

issue "Add a search box" \
"Add a search box above the wall that filters members as you type, matching name or the \`learning\` field. No libraries needed."

issue "Group or filter members by year" \
"Let visitors see 1st, 2nd, 3rd and 4th years separately, with buttons or headings. Show the count for each year."

issue "Accessibility pass" \
"Make the wall usable without a mouse and readable for everyone: text contrast at least 4.5:1, visible keyboard focus on every link, alt text on avatars, and a sensible heading order."

issue "Dark mode" \
"Follow the visitor's system setting with \`prefers-color-scheme\`. Both themes must keep text contrast at least 4.5:1."

issue "Check that each username is a real GitHub account" \
"Extend \`scripts/validate.mjs\` so the check fails if the username in the file isn't a real GitHub account. Hint: \`https://api.github.com/users/<username>\` returns 404 for unknown users. Keep the error message friendly."

echo
echo "Done. Two settings to change by hand, both under Settings > Actions > General and Settings > Branches:"
echo "  1. Fork pull request workflows: choose 'Require approval for first-time contributors who are new to GitHub'"
echo "  2. Protect main: require the 'check' status to pass before merging"
echo
echo "Repo: https://github.com/$REPO"
echo "Wall: https://$ORG.github.io/contributor-wall/"
