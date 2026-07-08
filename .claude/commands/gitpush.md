You are performing a full project publish for this repository. Execute all five steps below in order. Stop and report to the user if any step fails — do not continue to later steps when an earlier one has an unresolved problem.

---

## Step 1 — Security scan (run FIRST, before touching git)

Search every tracked and untracked file in the working directory for sensitive data. Flag anything that matches the patterns below and refuse to push until the user confirms the finding is a false positive or removes it.

Patterns to grep for (case-insensitive):
- Secrets / tokens: `AKIA[0-9A-Z]{16}` (AWS key), `sk-[a-zA-Z0-9]{20,}` (OpenAI), `gho_`, `ghp_`, `github_pat_`, `xox[baprs]-` (Slack), `SG\.` (SendGrid), `key-[a-zA-Z0-9]{32}`, `Bearer [a-zA-Z0-9\-_\.]{20,}`
- Generic secrets: `password\s*=\s*['"][^'"]{4,}`, `secret\s*=\s*['"][^'"]{4,}`, `api[_-]?key\s*=\s*['"][^'"]{4,}`
- Private keys: `-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----`
- Environment / config files: `.env`, `*.pem`, `*.p12`, `*.pfx`, `*.key` files that are not in `.gitignore`

Also verify that `.gitignore` exists and excludes `.env*`, `*.pem`, `*.key`, `node_modules/`, and `*.p12`.

Report: "✅ Security scan passed — no sensitive data found" or list every finding with file path and line number.

---

## Step 2 — README

Check whether `README.md` exists and is non-trivial (more than 5 lines).

- If it does not exist or is just a title line, create a professional README that includes: project name and one-line description, live site URL (GitHub Pages), features list, tech stack table, file structure, how to run locally, deployment notes, and customisation tips.
- If it already exists and is complete, update only the sections that are stale (e.g., live site URL, features that have changed). Do not rewrite sections that are still accurate.

Commit the README change separately with message `docs: update README`.

---

## Step 3 — Push to GitHub

1. Run `git status` to see what has changed.
2. Stage all modified and untracked files except anything that should be ignored. Never stage `.env*`, `*.pem`, `*.key`, or `*.p12` files.
3. If there are no changes to commit, skip to Step 4.
4. Write a concise conventional-commit message that accurately describes the changes (e.g., `feat: add contact form validation`, `fix: hero layout on mobile`).
5. Commit and push to the `main` branch (or the current tracking branch).

---

## Step 4 — GitHub Pages via GitHub Actions

Check whether `.github/workflows/` contains a Pages deploy workflow:

**If the workflow file is missing**, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then commit and push it.

**After pushing**, call the GitHub API to ensure Pages is enabled with `build_type: workflow`:

```
PATCH https://api.github.com/repos/{owner}/{repo}/pages
body: { "build_type": "workflow" }
```

If the endpoint returns 404 (Pages not yet created), use POST instead.

Retrieve the GitHub token from the Windows Credential Manager using:
```powershell
$tmp = "$env:TEMP\gitcred.txt"
Set-Content -Path $tmp -Value "protocol=https`nhost=github.com`n" -NoNewline -Encoding ascii
$creds = cmd /c "git credential fill < `"$tmp`"" 2>&1
$token = ($creds | Where-Object { $_ -match "^password=" }) -replace "^password=", ""
```

Then trigger a `workflow_dispatch` event so the site deploys immediately. Wait ~15 seconds and check the run status via the Actions API. Report the final deployment URL when the run succeeds.

---

## Step 5 — Update GitHub repo About

Using the same token from Step 4, call:

```
PATCH https://api.github.com/repos/{owner}/{repo}
body: {
  "description": "<one-sentence description of the project>",
  "homepage": "<GitHub Pages live URL>"
}
```

Derive the owner and repo name from `git remote get-url origin`.

Report the final description and homepage that were saved.

---

## Summary

After all steps complete, print a short summary table:

| Step | Result |
|---|---|
| Security scan | ✅ / ⚠️ findings |
| README | created / updated / unchanged |
| Git push | pushed `<commit hash>` / nothing to push |
| GitHub Pages | deployed at `<url>` |
| Repo About | updated |
