# SAST Workflow Configuration

This template includes automated Static Application Security Testing (SAST) using **Semgrep** to detect security bugs and anti-patterns in your own source code. This guide explains how to customise and use this feature.

## Quick Start

### Run Analysis Locally
```bash
task sast
```

### What You Get Automatically
- ✅ PR comments with SAST findings report
- ✅ Merge blocking if any ERROR-severity findings exist
- ✅ GitHub issues on main branch for error-severity problems

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/security-sast-check.yml` |
| Want stricter/looser rules? | Use a custom Semgrep config file (see below) |
| Don't want SAST checks? | Delete `.github/workflows/security-sast-check.yml` |

### Severity Reference

| Severity | Status | Action |
|----------|--------|--------|
| ERROR | 🔴 Blocking | Must be fixed before merge |
| WARNING | ⚠️ Non-blocking | Review recommended |
| INFO | ℹ️ Informational | Awareness only |

---

## Overview

What SAST checks: **your own source code** for security vulnerabilities and anti-patterns using pattern matching (e.g. dangerous function calls, injection risks, hardcoded secrets).

The SAST workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`
- ✅ Analyses code using Semgrep's auto-configured rule set
- ✅ Posts findings as PR comments
- ✅ Creates GitHub issues when error-severity findings land on `main`
- ✅ Fails PRs with error-severity findings

## Files Involved

| File | Purpose |
|------|---------|
| `.github/workflows/security-sast-check.yml` | GitHub Actions workflow |
| `Taskfile.yml` (`sast*` tasks) | Local task runner config |
| `.scripts/generate-sast-md.py` | Report generator |
| `.gitignore` | Excludes `.sast-reports/` |

## Key Configuration Points

### Custom Rule Set

By default, Semgrep runs with `--config=auto`. To use a specific ruleset, update the `sast:analyze` task in `Taskfile.yml`:

```yaml
semgrep \
  --config=p/owasp-top-ten \   # ← replace --config=auto
  --json \
  ...
```

### Disable SAST Checking

```bash
# Option A: delete the workflow
rm .github/workflows/security-sast-check.yml

# Option B: disable in GitHub UI → Actions → SAST Analysis → Disable workflow
```

## Running Locally

```bash
# Install Task (one-time)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run SAST
task sast
```

Reports are saved to `.sast-reports/`.

## For More Information

- **Semgrep Documentation:** https://semgrep.dev/docs/
- **Semgrep Registry:** https://semgrep.dev/r
- **Task Documentation:** https://taskfile.dev
- See also: [`DEPENDENCIES.md`](DEPENDENCIES.md) and [`DAST.md`](DAST.md)
