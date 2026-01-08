# Copilot Instructions for template.netlify

## Project Overview

This is a minimal static site template demonstrating Netlify deployment with GitHub Actions CI/CD. The entire application is a single [index.html](../index.html) file with embedded CSS—no build process, no bundlers, no frameworks.

## Architecture

**Static Single-File Site**: All HTML, CSS, and content lives in [index.html](../index.html). There's no separate CSS/JS files, no templating, no build step.

**Deployment Pipeline**: 
- Production: Pushes to `main` trigger production deployment via [.github/workflows/netlify-deploy.yml](workflows/netlify-deploy.yml)
- Preview: PRs to `main` create preview deployments at `https://pr-{number}--{site-name}.netlify.app`

**Configuration**: [netlify.toml](../netlify.toml) publishes the root directory `.` as-is with no build command.

## Critical Workflows

### Local Development
```bash
npm start  # Uses npx http-server on port 8080
```
Alternative: Open [index.html](../index.html) directly in browser or use `python -m http.server 8080`.

### Deployment
- **Production**: Push/merge to `main` → Auto-deploys → Commit comment with URL
- **Preview**: Open PR → Auto-deploys preview → PR comment with preview URL
- **Secrets Required**: `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` in GitHub repo secrets

### GitHub Actions Workflow
The [netlify-deploy.yml](workflows/netlify-deploy.yml) workflow:
- Uses `nwtgck/actions-netlify@v2.1` action
- Runs on `ubuntu-latest` with `pull-requests: write` permission
- Has separate steps for production (main branch) and preview (PRs) with different comment settings
- Times out after 5 minutes

## Project Conventions

**Zero Dependencies**: No npm packages installed. [package.json](../package.json) only defines the `start` script using `npx http-server`.

**Inline Everything**: All styling is embedded in `<style>` tags in [index.html](../index.html). Uses a gradient background (`linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)`) and flexbox centering.

**No Build Step**: [netlify.toml](../netlify.toml) explicitly uses `echo 'No build step required for static site'` as the build command. The publish directory is `.` (root).

## Customization Guide

This is a **template** repository—here's how to customize it:

**Visual Changes** (all in [index.html](../index.html) `<style>` block):
- Background gradient: Modify `linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)` with new color stops
- Font sizes: `h1 { font-size: 4rem }` and `p { font-size: 1.5rem }`
- Layout: Change flexbox properties in `body` or `.container`

**Content Changes** (in [index.html](../index.html) `<body>`):
- Heading: Edit `<h1>Hello World</h1>` 
- Subtext: Edit `<p>Welcome to your Netlify static site!</p>`
- Page title: Edit `<title>Hello World</title>` in `<head>`

**Site Configuration**:
- Set `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` as GitHub repo secrets (see [README.md](../README.md) Netlify Setup)
- Netlify site name determines preview URLs: `pr-{number}--{site-name}.netlify.app`

**Adding Pages**: Create additional HTML files in root (e.g., `about.html`). They'll deploy automatically. Link from `index.html` with `<a href="about.html">`.

## Integration Points

**Netlify**: Direct deployment via GitHub Actions (not Netlify's automatic git integration).

**GitHub Actions**: Workflow requires repo secrets (`NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`) and uses `secrets.GITHUB_TOKEN` for PR commenting.

## When Making Changes

- Content/style edits: Modify [index.html](../index.html) directly
- Deployment behavior: Edit [.github/workflows/netlify-deploy.yml](workflows/netlify-deploy.yml)
- Netlify settings: Update [netlify.toml](../netlify.toml) (though current config is minimal)
- No need to run builds or install dependencies—changes are deployed as-is

## Common Patterns

This project demonstrates:
- GitHub Actions workflows with conditional steps (`if: github.event_name == 'push'`)
- PR preview deployments using dynamic aliases (`alias: pr-${{ github.event.number }}`)
- Zero-build static site deployment pattern
- Single-file web applications with embedded styles
