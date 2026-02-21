# Secrets Detection Workflow Configuration

This template includes automated secrets detection using **Gitleaks** to identify hardcoded credentials, API keys, and other sensitive data in your source code and git history. This guide explains how to customise and use this feature.

## Quick Start

### Run Analysis Locally
```bash
task secrets
```

### What You Get Automatically
- ✅ PR comments with secrets detection report
- ✅ Merge blocking if any secrets are detected
- ✅ GitHub issues on main branch if secrets land there

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/secrets-check.yml` |
| False positives? | Add a `.gitleaks.toml` allowlist (see below) |
| Don't want secrets checks? | Delete `.github/workflows/secrets-check.yml` |

---

## Overview

What secrets detection checks: **hardcoded credentials** — API keys, tokens, passwords, private keys, and other sensitive values in source code files and git history.

The secrets workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`
- ✅ Scans all files and full git history with Gitleaks
- ✅ Posts findings as PR comments
- ✅ Creates GitHub issues when secrets land on `main`
- ✅ Fails PRs whenever secrets are detected (always blocking)

## Files Involved

| File | Purpose |
|------|---------|
| `.github/workflows/secrets-check.yml` | GitHub Actions workflow |
| `Taskfile.yml` (`secrets*` tasks) | Local task runner config |
| `.scripts/generate-secrets-md.py` | Report generator |
| `.gitignore` | Excludes `.secrets-reports/` |

## Suppressing False Positives

Create a `.gitleaks.toml` in the project root to allowlist known false positives:

```toml
[allowlist]
description = "Project allowlist"

# Allowlist a specific file
paths = [
  '''tests/fixtures/.*'''
]

# Allowlist a specific pattern (e.g. a test key)
regexes = [
  '''AKIAIOSFODNN7EXAMPLE'''
]

# Allowlist a specific commit
commits = [
  "abc123def456"
]
```

## If Secrets Are Detected

Act immediately:

1. **Revoke** the exposed credential (rotate API keys, invalidate tokens)
2. **Remove** the secret from the codebase
3. **Clean git history** if the secret was committed:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch path/to/file" \
     --prune-empty --tag-name-filter cat -- --all
   ```
   Or use [BFG Repo Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) for a simpler approach.
4. **Force-push** the cleaned history (coordinate with your team)

## Disable Secrets Checking

```bash
# Option A: delete the workflow
rm .github/workflows/secrets-check.yml

# Option B: disable in GitHub UI → Actions → Secrets Detection → Disable workflow
```

## Running Locally

```bash
# Install Task (one-time)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run secrets detection
task secrets
```

Reports are saved to `.secrets-reports/`.

## For More Information

- **Gitleaks Documentation:** https://gitleaks.io/
- **Gitleaks Rules:** https://github.com/gitleaks/gitleaks/tree/master/cmd/generate/config/rules
- **Task Documentation:** https://taskfile.dev
- See also: [`SAST_CONFIG.md`](SAST_CONFIG.md), [`DEPENDENCIES_CONFIG.md`](DEPENDENCIES_CONFIG.md), [`DAST_CONFIG.md`](DAST_CONFIG.md)
