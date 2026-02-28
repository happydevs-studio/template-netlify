# Deployment

Release and environment workflows for the template-netlify project.

## Overview

This project deploys a static site to Netlify using GitHub Actions. There is no build step — static files are published as-is.

## Workflows

| Workflow | Trigger | Purpose |
| -------- | ------- | ------- |
| [netlify-deploy.yml](../../.github/workflows/netlify-deploy.yml) | Push to `main` / PR to `main` | Production deploy and PR preview deploy |
| [netlify-cleanup-preview.yml](../../.github/workflows/netlify-cleanup-preview.yml) | PR closed | Delete preview deployments to free Netlify resources |

## Environments

- **Production**: Deployed on push to `main`. URL: `https://<site-name>.netlify.app/`
- **Preview**: Created per PR. URL: `https://pr-<number>--<site-name>.netlify.app`

## Required Secrets

| Secret | Where to find |
| ------ | ------------- |
| `NETLIFY_AUTH_TOKEN` | Netlify User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID` | Netlify Site settings → General → Site details → Site ID |

## Configuration

Deployment is configured via [netlify.toml](../../netlify.toml):
- Publish directory: `.` (root)
- Build command: `echo 'No build step required for static site'`
