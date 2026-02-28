# Agents Instructions for template.netlify

This is an open standard for agents, AI assistants, and automation tools to understand project conventions and best practices.

> 📚 **Documentation Hub**: For comprehensive documentation navigation, see [docs/index.md](index.md) which provides a structured map of all project documentation.

> 🏗️ **Structure Convention**: The categories in [docs/index.md](index.md) drive naming across the project—Taskfile tasks use `category:action` (e.g., `hygiene:complexity`), GitHub Actions use `category-action-check.yml` (e.g., `hygiene-complexity-check.yml`).

## Project Overview

This is a minimal static site template demonstrating Netlify deployment with GitHub Actions CI/CD. The application is a multi-page static site with separate HTML, CSS, and JS files—no build process, no bundlers, no frameworks.

## Architecture

**Static Multi-Page Site**: The site consists of three pages (`index.html`, `page2.html`, `page3.html`), each with its own CSS and JS file (`page1.css`/`page1.js`, `page2.css`/`page2.js`, `page3.css`/`page3.js`). There's no templating and no build step.

**Deployment Pipeline**: 
- Production: Pushes to `main` trigger production deployment via [.github/workflows/netlify-deploy.yml](../.github/workflows/netlify-deploy.yml)
- Preview: PRs to `main` create preview deployments at `https://pr-{number}--{site-name}.netlify.app`
- Cleanup: PRs closed/merged trigger automatic preview deletion via [.github/workflows/netlify-cleanup-preview.yml](../.github/workflows/netlify-cleanup-preview.yml)

**Configuration**: [netlify.toml](../netlify.toml) publishes the root directory `.` as-is with no build command.

## Critical Workflows

### Local Development
```bash
npm start  # Runs node server.js on port 8080
```
The custom `server.js` reads security headers from `netlify.toml` so local dev matches production behavior. Alternative: Open [index.html](../index.html) directly in browser.

### Deployment
- **Production**: Push/merge to `main` → Auto-deploys → Commit comment with URL
- **Preview**: Open PR → Auto-deploys preview → PR comment with preview URL
- **Cleanup**: Close/merge PR → Auto-deletes preview deployment (frees Netlify resources)
- **Secrets Required**: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` in GitHub repo secrets

### GitHub Actions Workflows
**Deploy** ([.github/workflows/netlify-deploy.yml](../.github/workflows/netlify-deploy.yml)):
- Uses `nwtgck/actions-netlify@v2.1` action
- Runs on `ubuntu-latest` with `pull-requests: write` permission
- Has separate steps for production (main branch) and preview (PRs) with different comment settings
- Times out after 5 minutes

**Cleanup** ([.github/workflows/netlify-cleanup-preview.yml](../.github/workflows/netlify-cleanup-preview.yml)):
- Triggers on `pull_request: [closed]` events
- Queries Netlify API for deployment matching `pr-{number}` alias
- Deletes the preview deployment via Netlify API
- Handles gracefully if no deployment exists

### Agentic Workflows

**Copilot Coding Agent** ([.github/copilot-setup-steps.yml](../.github/copilot-setup-steps.yml)):
- Enables GitHub Copilot to be assigned to issues and autonomously create PRs
- Sets up Node.js, Playwright, Taskfile, and Python analysis tools
- Agent uses `AGENTS.md` and `docs/` for project context and conventions

**Auto-label PRs** ([.github/workflows/hygiene-auto-label-pr.yml](../.github/workflows/hygiene-auto-label-pr.yml)):
- Automatically labels PRs based on changed files using [.github/labeler.yml](../.github/labeler.yml)
- Categories match project structure: `docs`, `security`, `reliability`, `hygiene`, `deployment`, `tests`, `ci`, `content`
- Labels sync on PR open, synchronize, and reopen

## Project Conventions

**Dev Dependencies Only**: [package.json](../package.json) has dev dependencies (`@playwright/test`, `markdownlint-cli`) for testing and linting. The `start` script runs `node server.js`.

**Separate Stylesheets**: Each page has its own CSS file (e.g., `page1.css`). The homepage uses a gradient background (`linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)`) and flexbox centering.

**No Build Step**: [netlify.toml](../netlify.toml) explicitly uses `echo 'No build step required for static site'` as the build command. The publish directory is `.` (root).

**Conventional Commits**: All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) standard for clear, predictable commit history. Format: `<type>(<scope>): <description>` where type is one of:
- `feat:` - New feature or content
- `fix:` - Bug fix or issue correction
- `docs:` - Documentation updates
- `style:` - Styling or visual changes
- `test:` - Test additions or updates
- `chore:` - Build, dependencies, or maintenance
- `refactor:` - Code restructuring without feature changes

Examples: `feat(hero): add gradient animation`, `fix(nav): correct mobile menu alignment`, `docs(complexity): update threshold guidance`

## Customization Guide

This is a **template** repository—here's how to customize it:

**Visual Changes** (in individual CSS files, e.g., `page1.css`):
- Background gradient: Modify `linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)` with new color stops
- Font sizes: `h1 { font-size: 4rem }` and `p { font-size: 1.5rem }`
- Layout: Change flexbox properties in `body` or `.container`

**Content Changes** (in individual HTML files):
- Homepage: Edit [index.html](../index.html) — heading, subtext, navigation
- Page 2: Edit [page2.html](../page2.html) — text input interactive feature
- Page 3: Edit [page3.html](../page3.html) — counter interactive feature

**Site Configuration**:
- Set `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` as GitHub repo secrets (see [README.md](README.md) Netlify Setup)
- Netlify site name determines preview URLs: `pr-{number}--{site-name}.netlify.app`

**Adding Pages**: Create additional HTML/CSS/JS files in root. They'll deploy automatically. Add navigation links in each page's `<nav>` block. See existing pages (`page2.html`, `page3.html`) for the pattern.

## Integration Points

**Netlify**: Direct deployment via GitHub Actions (not Netlify's automatic git integration).

**GitHub Actions**: Workflows require repo secrets (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`) and use `secrets.GITHUB_TOKEN` for PR commenting.

**Netlify API**: Cleanup workflow uses `https://api.netlify.com/api/v1/sites/{site_id}/deploys` endpoint to query and delete preview deployments.

## When Making Changes

- Content/style edits: Modify [index.html](../index.html) directly
- Deployment behavior: Edit [.github/workflows/netlify-deploy.yml](../.github/workflows/netlify-deploy.yml)
- Cleanup behavior: Edit [.github/workflows/netlify-cleanup-preview.yml](../.github/workflows/netlify-cleanup-preview.yml)
- Netlify settings: Update [netlify.toml](../netlify.toml) (though current config is minimal)
- No need to run builds or install dependencies—changes are deployed as-is

## Common Patterns

This project demonstrates:
- GitHub Actions workflows with conditional steps (`if: github.event_name == 'push'`)
- PR preview deployments using dynamic aliases (`alias: pr-${{ github.event.number }}`)
- Automatic resource cleanup on PR close using Netlify API
- Zero-build static site deployment pattern
- Multi-page static sites with separate CSS/JS files
