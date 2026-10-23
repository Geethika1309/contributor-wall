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

issue "Show GitHub avatars on the wall" \
"Each square on the wall in \`site/index.html\` shows the member's initials. Show their GitHub avatar instead (\`https://github.com/<username>.png?size=96\`): in the spotlight panel, and inside the squares if you can keep them readable. Keep the year colour visible (a coloured border works), and fall back to initials if an image fails to load. Plain HTML, CSS and JavaScript only. It must still work on a phone."

issue "Add a search box that highlights squares" \
"Add a search box above the wall. As you type, squares whose name or \`learning\` matches stay bright and the rest fade out. Pressing Enter puts the first match in the spotlight. No libraries needed."

issue "Filter the wall by year" \
"Make the legend under the wall (1st year to 4th year) clickable: clicking a colour shows only that year's squares, and clicking it again shows everyone. Show the count for each year next to its colour."

issue "Accessibility pass" \
"Make the wall usable without a mouse and readable for everyone: text contrast at least 4.5:1, visible keyboard focus on every link, alt text on avatars, and a sensible heading order."

issue "Dark mode" \
"Follow the visitor's system setting with \`prefers-color-scheme\`. GitHub's dark contribution greens are a good start: \`#0e4429\`, \`#006d32\`, \`#26a641\`, \`#39d353\`. Both themes must keep text contrast at least 4.5:1."

issue "Check that each username is a real GitHub account" \
"Extend \`scripts/validate.mjs\` so the check fails if the username in the file isn't a real GitHub account. Hint: \`https://api.github.com/users/<username>\` returns 404 for unknown users. Keep the error message friendly."

echo
echo "Done. Two settings to change by hand, both under Settings > Actions > General and Settings > Branches:"
echo "  1. Fork pull request workflows: choose 'Require approval for first-time contributors who are new to GitHub'"
echo "  2. Protect main: require the 'check' status to pass before merging"
echo
echo "Repo: https://github.com/$REPO"
echo "Wall: https://$ORG.github.io/contributor-wall/"
