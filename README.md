# Contributor Wall

Everyone who joins GitHub Community GITAM adds themselves here with one pull request.
The wall is live at: `https://gcc-gitam-blr.github.io/contributor-wall/`

## Add yourself (first years start here)

1. **Fork** this repo with the button at the top right.
2. In your fork, open the `members` folder and click **Add file → Create new file**.
3. Name the file `your-github-username.json`, exactly your username.
4. Paste this and fill it in:

   ```json
   {
     "name": "Your Name",
     "github": "your-github-username",
     "year": 2,
     "learning": "React"
   }
   ```

5. Click **Commit changes**, then **Contribute → Open pull request**.
6. Title it `Add your-github-username to the wall` and open it.
7. Wait for the check. Green means you're done. Red means read the message, fix your file, and commit again. The pull request updates by itself.

## The rules the check enforces

- Change exactly one file: `members/<your-username>.json`.
- The file name, the `github` field and your GitHub account must all match.
- `year` is 1, 2, 3 or 4.
- `name` and `learning` are short text, 60 characters at most.
- No other fields.

## Want something harder? (2nd and 3rd years)

Pick an issue labelled `good first issue`, comment "I'll take this" so nobody duplicates you, then open a pull request that links the issue with `Closes #<number>`.
The check passes code changes with a note; a maintainer reviews them before merging.

## Run it locally

```
node scripts/validate.mjs members/your-username.json
node scripts/build.mjs
```

Then open `dist/index.html` through any local server, for example `npx serve dist`.
