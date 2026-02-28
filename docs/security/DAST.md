# DAST Workflow Configuration

This template includes automated Dynamic Application Security Testing (DAST) using **OWASP ZAP** to detect runtime security issues by scanning your running site. This guide explains how to customise and use this feature.

## Quick Start

### Run Analysis Locally
```bash
# Start the site first
task start &
# Run DAST scan against it
task dast -- http://localhost:8080
```

### What You Get Automatically
- ✅ PR comments with DAST findings report
- ✅ Merge blocking if any High or Medium alerts exist
- ✅ GitHub issues on main branch for blocking alerts

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/security-dast-check.yml` |
| ZAP not available? | The workflow uses Docker to run ZAP — no installation needed in CI |
| Don't want DAST checks? | Delete `.github/workflows/security-dast-check.yml` |

### Risk Level Reference

| Risk Level | riskcode | Status | Action |
|------------|----------|--------|--------|
| High | 3 | 🔴 Blocking | Must be fixed before merge |
| Medium | 2 | 🟡 Blocking | Must be fixed before merge |
| Low | 1 | 🔵 Non-blocking | Review when time allows |
| Informational | 0 | ℹ️ Non-blocking | Awareness only |

---

## Overview

What DAST checks: **your running application** for HTTP-level security vulnerabilities — missing security headers, injection vectors, exposed sensitive endpoints, and other issues that only appear at runtime.

The DAST workflow:
- ✅ Starts a local http-server for the static site
- ✅ Runs OWASP ZAP baseline scan against it
- ✅ Posts findings as PR comments
- ✅ Creates GitHub issues when High/Medium alerts land on `main`
- ✅ Fails PRs with High or Medium alerts

## Files Involved

| File | Purpose |
|------|---------|
| `.github/workflows/security-dast-check.yml` | GitHub Actions workflow |
| `Taskfile.yml` (`dast*` tasks) | Local task runner config |
| `.scripts/generate-dast-md.py` | Report generator |
| `.gitignore` | Excludes `.dast-reports/` |

## Key Configuration Points

### Change the Target URL

In `Taskfile.yml`, the `dast` task accepts the target URL as an argument:

```bash
task dast -- http://your-site-url
```

In `security-dast-check.yml`, the CI workflow starts a local server and passes `http://localhost:8080`. To scan a deployed preview instead, update that step with your preview URL.

### Change the Blocking Threshold

To block only on High (not Medium), edit `security-dast-check.yml`:

```python
# Change this line:
if int(alert.get('riskcode', 0)) >= 2:
# To:
if int(alert.get('riskcode', 0)) >= 3:
```

### Disable DAST Checking

```bash
# Option A: delete the workflow
rm .github/workflows/security-dast-check.yml

# Option B: disable in GitHub UI → Actions → DAST Analysis → Disable workflow
```

## Running Locally

```bash
# Install Task (one-time)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Start the site
task start &

# Run DAST scan (requires Docker)
task dast -- http://localhost:8080
```

Reports are saved to `.dast-reports/`.

## For More Information

- **OWASP ZAP Documentation:** https://www.zaproxy.org/docs/
- **ZAP Baseline Scan:** https://www.zaproxy.org/docs/docker/baseline-scan/
- **Task Documentation:** https://taskfile.dev
- See also: [`SAST.md`](SAST.md) and [`DEPENDENCIES.md`](DEPENDENCIES.md)
