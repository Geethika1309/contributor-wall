# Contributor Wall

Everyone who joins GitHub Community GITAM adds themselves here with one pull request.
The wall is live at: **https://gcc-gitam-blr.github.io/contributor-wall/**

## Add yourself (first years start here)

You need a GitHub account and about five minutes. Everything happens on the GitHub website, so you don't need a terminal or any software.

**Before you start:** sign in to GitHub and find your **username**. Click your profile picture at the top right; your username is the name shown under it (for example `asha-rao`). It is not your display name and has no spaces.

1. **Fork this repo.** Click **Fork** at the top right of this page, then the green **Create fork** button. You now have your own copy at `github.com/<your-username>/contributor-wall`.
2. **Create your file.** In your fork, click the `members` folder, then **Add file → Create new file**.
3. **Name it** `<your-username>.json`, for example `asha-rao.json`. Use your username exactly, then `.json`.
4. **Paste this** into the big box and change the values:

   ```json
   {
     "name": "Your Name",
     "github": "your-github-username",
     "year": 1,
     "learning": "Python"
   }
   ```

   | Field | What to write | Example |
   |---|---|---|
   | `name` | Your name, as you want it on the wall | `"Asha Rao"` |
   | `github` | Your username, the same as the file name | `"asha-rao"` |
   | `year` | Your year of study: 1, 2, 3 or 4, **without quotes** | `1` |
   | `learning` | One thing you're learning or want to learn | `"Python"` |

   Keep every `"` quote and every comma, and don't add a comma after the last line. The wall is public, so don't add a phone number or email.

5. **Save it.** Click the green **Commit changes...** button, then **Commit changes** again in the box that opens.
6. **Open a pull request.** Go back to the main page of your fork (click `contributor-wall` at the top). Click **Contribute → Open pull request**, then **Create pull request**. You can leave the title and text as they are, or title it `Add <your-username> to the wall`.
7. **Wait about a minute for the check** at the bottom of your pull request.
   - **Green tick:** your file is correct. A maintainer will merge it, and about a minute later your name is on the wall.
   - **Red cross:** click **Details** next to the check and read the message. It tells you exactly what to fix. Then go to your fork, open `members/<your-username>.json`, click the pencil icon, fix it, and commit again. Your pull request updates by itself and the check runs again.
   - **"Awaiting approval":** a volunteer will approve it in a moment. You don't need to do anything.

### If you get stuck

- **"This pull request changes 2 files"**: you edited something else by mistake. The easy fix is to start again: close the pull request, delete your fork (in your fork, **Settings**, scroll to the bottom, **Delete this repository**), and go back to step 1.
- **"You're signed in as ..."**: the file name must be your own username. Open your file, click the pencil icon, change the name in the box at the top, and commit.
- **"This isn't valid JSON"**: compare your file with the example above, character by character. The message gives the line number where it went wrong.
- **Want to change your details later?** Edit your file in your fork and open a new pull request the same way.

## The rules the check enforces

- Change exactly one file: `members/<your-username>.json`.
- The file name, the `github` field and your GitHub account must all match.
- `year` is 1, 2, 3 or 4.
- `name` and `learning` are short text, 60 characters at most.
- No other fields.

## Want something harder? (2nd and 3rd years)

1. Open the **Issues** tab and pick one labelled `good first issue` that nobody has claimed.
2. Comment "I'll take this" so nobody else builds the same thing. If someone already claimed it, pick another.
3. Fork the repo, make a branch, and build it. Plain HTML, CSS and JavaScript only, no frameworks or packages.
4. Test it locally (below), then open a pull request with `Closes #<issue number>` in the description.
5. The check passes code changes with a note; a maintainer reviews them before merging. Reply to review comments by pushing more commits to the same branch.

## Run it locally

You only need [Node.js](https://nodejs.org).

```
node scripts/validate.mjs members/your-username.json
node scripts/build.mjs
```

The build writes the site to `dist/`. Serve it with any local server, for example `npx serve dist` or `python -m http.server -d dist`, then open the address it prints. Opening `dist/index.html` directly won't load the members list.
