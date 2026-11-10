# Contributing to Good First Issues

Thank you for your interest in contributing to Good First Issues. This guide
explains the project stack, local setup, and expected contribution workflow.

## Project overview

Good First Issues helps first-time open-source contributors find beginner
friendly GitHub issues. The site lists open issues and lets users filter them by
programming language, label, repository, and repository stars.

The project has two main parts:

- A static frontend served from the repository root.
- A Go backend script that fetches issue data from the GitHub GraphQL API and
  writes the generated data file used by the frontend.

## Tech stack

- HTML, CSS, and JavaScript for the static website.
- Bootstrap for layout and UI components.
- Go for fetching issue data from GitHub.
- GitHub GraphQL API for repository and issue metadata.
- GitHub Actions for scheduled data refreshes.

## Repository structure

- `index.html` and `about.html`: main static pages.
- `styles/`: CSS files used by the frontend.
- `scripts/`: JavaScript used to render and filter issue data.
- `assets/` and `icons/`: images, icons, and branding assets.
- `backend/`: Go scripts and generated issue data.
- `.github/workflows/go-write-to-file.yml`: scheduled workflow that refreshes
  `backend/data.json`.

## Local setup

### 1. Fork and clone the repository

```bash
git clone https://github.com/<your-username>/goodfirstissues.git
cd goodfirstissues
```

Add the original repository as `upstream` so you can keep your fork up to date:

```bash
git remote add upstream https://github.com/iedr/goodfirstissues.git
git fetch upstream
```

### 2. Run the static site locally

The frontend is static, so no package installation is required for basic UI or
documentation changes. Open `index.html` in a browser, or serve the repository
with any local static server. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### 3. Optional: refresh issue data locally

Refreshing `backend/data.json` requires Go and a GitHub personal access token
with permission to read public repository data.

```bash
cd backend
go mod tidy
go build -v -o main-to-file main-to-file.go
./main-to-file -gh_token=<your-github-token>
```

This rewrites `backend/data.json`. Only include generated data changes in a pull
request when they are directly related to your contribution.

## Contribution workflow

1. Open or choose an issue before starting work.
2. Create a focused branch from the latest `master`.
3. Keep your pull request focused on one issue or topic.
4. Avoid unrelated formatting, generated data, or cosmetic changes.
5. Test or manually verify the behavior you changed.
6. Open a pull request against `iedr/goodfirstissues:master`.

Example branch names:

```bash
git switch -c docs/update-contributing
git switch -c fix/filter-selection
```

## Pull request checklist

Before opening a pull request, please confirm that:

- The change is scoped to the issue being addressed.
- Any setup or testing commands used are included in the pull request
  description.
- UI changes were checked in a browser.
- Documentation changes were reviewed for accuracy and broken links.
- Generated files were not changed unless the issue requires it.
- The pull request references the related issue.

## Notes for contributors

- Do not commit secrets, tokens, or local environment files.
- Prefer clear, descriptive commit messages.
- If you cannot run a full verification locally, explain what you did verify and
  why the full check was not possible.
