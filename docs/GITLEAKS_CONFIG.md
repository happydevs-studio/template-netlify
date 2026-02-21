# Secrets Scan Workflow Configuration

This template includes automated secrets scanning using **Gitleaks** to prevent credentials and API keys from being committed to source control. This guide explains how to customize and use this feature for your cloned repository.

## Quick Start

### Scan Locally
```bash
task gitleaks
```

### What You Get Automatically
- ✅ PR comments with secrets scan results
- ✅ Merge blocking if any secrets are detected
- ✅ GitHub issues on main branch when secrets are found

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/gitleaks.yml` |
| False positive results? | Add a `.gitleaksignore` file to suppress them |
| Don't want secrets scanning? | Delete `.github/workflows/gitleaks.yml` |

---

## Overview

The gitleaks workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`
- ✅ Scans full git history for hardcoded secrets, API keys, and tokens
- ✅ Posts scan results as PR comments
- ✅ Creates GitHub issues when secrets are detected in `main`
- ✅ Fails PRs when secrets are found (blocking merge)

## Files Involved

| File | Purpose |
|------|---------|
| [`.github/workflows/gitleaks.yml`](.github/workflows/gitleaks.yml) | GitHub Actions workflow |
| [`Taskfile.yml`](Taskfile.yml) | Local task runner (`task gitleaks`) |
| [`.scripts/generate-gitleaks-report.py`](.scripts/generate-gitleaks-report.py) | Markdown report generator |
| [`.gitignore`](.gitignore) | Excludes `.gitleaks-reports/` from version control |

## Suppressing False Positives

Create a `.gitleaksignore` file in the repository root to suppress specific findings by their fingerprint:

```
# .gitleaksignore
# Format: <fingerprint>
abc123:config.example.js:generic-api-key:10
```

The fingerprint for each finding is included in the JSON report at `.gitleaks-reports/gitleaks-report.json`.

Alternatively, use inline comments to suppress a specific line:

```javascript
const EXAMPLE_KEY = "example-placeholder-not-real"; // gitleaks:allow
```

## PR vs Main Branch Behavior

| Trigger | Behavior |
|---------|----------|
| **Pull Request** | Posts scan report as comment, **fails if secrets found**, blocks merge |
| **Push to main** | Posts scan report, creates GitHub issue if secrets found |
| **Workflow Dispatch** | Manual run for verification |

## Disable Secrets Scanning

**Option A:** Disable the workflow in GitHub UI  
→ Actions → Secrets Scan → Disable workflow

**Option B:** Delete the workflow file  
```bash
rm .github/workflows/gitleaks.yml
```

## Running the Scan Locally

```bash
# Install Task (one-time setup)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run secrets scan
task gitleaks
```

This generates:
- `.gitleaks-reports/gitleaks-report.md` — Human-readable report
- `.gitleaks-reports/gitleaks-report.json` — Machine-readable findings

## If Secrets Are Found

1. **Rotate the secret immediately** — even after removing it from git history, treat it as compromised
2. Remove the secret from the codebase and use environment variables or a secret manager instead
3. Use `git filter-repo` or BFG Repo Cleaner to remove the secret from git history
4. Add the fingerprint to `.gitleaksignore` only if it is a confirmed false positive

## More Information

- **Gitleaks Documentation:** https://github.com/gitleaks/gitleaks
- **GitHub Actions:** https://docs.github.com/en/actions
- **Task Documentation:** https://taskfile.dev
