# Dependency Vulnerability Scanning Configuration

This template includes automated dependency vulnerability scanning using **Trivy** to detect known CVEs in your project's dependencies. This guide explains how to customise and use this feature.

## Quick Start

### Run Analysis Locally
```bash
task dependencies
```

### What You Get Automatically
- ✅ PR comments with vulnerability report
- ✅ Merge blocking if any CRITICAL or HIGH vulnerabilities exist
- ✅ GitHub issues on main branch for blocking vulnerabilities

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/security-vulnerability-all-check.yml` |
| Want to change blocking threshold? | Edit severity check in `security-vulnerability-all-check.yml` |
| Don't want vulnerability scans? | Delete `.github/workflows/security-vulnerability-all-check.yml` |

### Severity Reference

| Severity | Status | Action |
|----------|--------|--------|
| CRITICAL | 🔴 Blocking | Must be fixed before merge |
| HIGH | 🟠 Blocking | Must be fixed before merge |
| MEDIUM | 🟡 Non-blocking | Review recommended |
| LOW | 🔵 Non-blocking | Update when convenient |

---

## Overview

What dependency scanning checks: **known CVEs in your project's packages** — npm dependencies, lock files, and other supported ecosystems.

The dependency scanning workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`
- ✅ Scans the project filesystem with Trivy
- ✅ Posts vulnerability report as PR comments
- ✅ Creates GitHub issues when CRITICAL/HIGH vulnerabilities land on `main`
- ✅ Fails PRs with CRITICAL or HIGH vulnerabilities

## Files Involved

| File | Purpose |
|------|---------|
| `.github/workflows/vulnerability-all-check.yml` | GitHub Actions workflow |
| `Taskfile.yml` (`dependencies*` tasks) | Local task runner config |
| `.scripts/generate-dependencies-md.py` | Report generator |
| `.gitignore` | Excludes `.dependencies-reports/` |

## Key Configuration Points

### Change the Blocking Threshold

To block only on CRITICAL (not HIGH), edit the `check-dependencies` step in `vulnerability-all-check.yml`:

```bash
# Change this line:
if v.get('Severity', '').upper() in ('CRITICAL', 'HIGH'):
# To:
if v.get('Severity', '').upper() == 'CRITICAL':
```

### Disable Dependency Scanning

```bash
# Option A: delete the workflow
rm .github/workflows/vulnerability-all-check.yml

# Option B: disable in GitHub UI → Actions → Dependency Vulnerability Scan → Disable workflow
```

## Running Locally

```bash
# Install Task (one-time)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run dependency scan
task dependencies
```

Reports are saved to `.dependencies-reports/`.

## For More Information

- **Trivy Documentation:** https://trivy.dev/
- **Task Documentation:** https://taskfile.dev
- See also: [`SAST_CONFIG.md`](SAST_CONFIG.md) and [`DAST_CONFIG.md`](DAST_CONFIG.md)
