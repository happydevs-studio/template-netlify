# Security Scanning Workflow Configuration

This template includes automated security vulnerability scanning using **Trivy** to help maintain a secure codebase. This guide explains how to customise and use this feature for your cloned repository.

## Quick Start

### Run Security Scan Locally
```bash
task security
```

### What You Get Automatically
- ✅ PR comments with security scan reports
- ✅ Merge blocking if HIGH/CRITICAL vulnerabilities are found
- ✅ GitHub issues on main branch for detected vulnerabilities

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/security-scan.yml` |
| Need different severity threshold? | Update `HIGH,CRITICAL` in `Taskfile.yml` and `.github/workflows/security-scan.yml` |
| Don't want security scans? | Delete `.github/workflows/security-scan.yml` |

### Severity Reference

| Severity | Status | Action |
|----------|--------|--------|
| CRITICAL | 🔴 Critical | Must fix before merge |
| HIGH | 🟠 High | Must fix before merge |
| MEDIUM | 🟡 Medium | Should be reviewed |
| LOW | 🔵 Low | Monitor and fix when possible |

---

## Overview

The security scan workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`
- ✅ Scans for vulnerabilities in npm dependencies, secrets, and misconfigurations
- ✅ Posts security reports as PR comments
- ✅ Creates GitHub issues when HIGH/CRITICAL issues are detected in `main`
- ✅ Fails PRs with HIGH/CRITICAL vulnerabilities (encouraging fixes before merge)

## Files Involved

| File | Purpose | Customisation |
|------|---------|---------------|
| [`.github/workflows/security-scan.yml`](.github/workflows/security-scan.yml) | GitHub Actions workflow | Triggers, failure behaviour, reporting |
| [`Taskfile.yml`](Taskfile.yml) | Local task runner config | Severity levels, exclusions |
| [`.scripts/generate-security-md.py`](.scripts/generate-security-md.py) | Report generator | Markdown formatting |
| [`.gitignore`](.gitignore) | Git ignore rules | Excludes `.security-reports/` from version control |

## Key Configuration Points

### 1. **Severity Threshold**

By default, the workflow **fails on HIGH and CRITICAL** vulnerabilities.

**Where it's defined:**
- `Taskfile.yml` – `security:scan` task (`--severity HIGH,CRITICAL,MEDIUM,LOW`)
- `.github/workflows/security-scan.yml` – the `check-vulns` step (`if vuln.get('Severity') in ('HIGH', 'CRITICAL')`)

**To change the threshold** (e.g., only fail on CRITICAL):

In `.github/workflows/security-scan.yml`, update the check step:
```python
if vuln.get('Severity') in ('CRITICAL',):  # ← Remove 'HIGH'
```

Also update the `--severity` flag in `Taskfile.yml`:
```yaml
--severity CRITICAL,HIGH,MEDIUM,LOW  # ← Adjust as needed
```

### 2. **Scan Targets**

The scan covers the entire filesystem (`trivy fs .`) excluding:
- `node_modules/` – third-party dependencies (flagged via `package-lock.json` instead)
- `.git/` – git internals

**To add custom exclusions**, edit `Taskfile.yml`:
```yaml
trivy fs . \
  --skip-dirs node_modules \
  --skip-dirs .git \
  --skip-dirs dist \    # ← Add custom exclusions here
```

### 3. **Scan Types**

Three scanners run by default:
- `vuln` – known CVEs in npm dependencies
- `secret` – hardcoded secrets/credentials in source files
- `misconfig` – IaC misconfigurations in GitHub Actions workflows etc.

To disable a scanner:
```yaml
--scanners vuln,secret  # ← Remove misconfig
```

### 4. **PR vs Main Branch Behaviour**

| Trigger | Behaviour |
|---------|-----------|
| **Pull Request** | Posts security report as comment, **fails if HIGH/CRITICAL found** |
| **Push to main** | Posts report, creates GitHub issue if vulnerabilities found |
| **Workflow Dispatch** | Manual run for verification |

### 5. **Disable Security Scanning**

**Option A:** Disable the workflow in GitHub UI
- Go to Actions → Security Scan → Disable workflow

**Option B:** Delete/rename the workflow file
```bash
rm .github/workflows/security-scan.yml
```

## Running the Security Scan Locally

```bash
# Install Task (one-time setup)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run security scan
task security
```

This generates:
- `.security-reports/security-report.md` – Human-readable report
- `.security-reports/security-report.json` – Machine-readable results
- `.security-reports/security-report.txt` – Plain text table output

## Understanding the Report

### Vulnerabilities
Known CVEs found in your npm dependencies (via `package-lock.json`).

| Column | Description |
|--------|-------------|
| ID | CVE identifier |
| Package | Affected npm package |
| Installed | Currently installed version |
| Fixed | Version that fixes the issue (if available) |
| Title | Short description |

### Secrets
Hardcoded credentials, API keys, or tokens found in source files.

> ⚠️ If a secret is detected, rotate it immediately even after removing it from code.

### Misconfigurations
Security misconfigurations in IaC files such as GitHub Actions workflows.

## GitHub Issues on Main Branch

When HIGH/CRITICAL vulnerabilities are detected on pushes to `main`:

1. A GitHub issue is created automatically with label `security`
2. Contains a link to the workflow run and full report
3. Includes reproduction steps and guidelines
4. Future scan failures comment on the same issue

**To resolve:**
1. Update the affected package: `npm update <package>`
2. Run `task security` locally to verify the fix
3. Open PR with the updated `package-lock.json`
4. CI will verify vulnerabilities are resolved
5. After merge, close the GitHub issue

## Troubleshooting

### Trivy Not Found

If the workflow fails with "trivy: command not found":
- Installation is automatic via the official install script
- If using a custom environment: `curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh`

### Reports Not Generated

If `.security-reports/` directory is empty:
1. Check workflow logs for errors in the scan step
2. Ensure Python 3 is available: `python3 --version`
3. Verify `.security-reports/` is not excluded by `.gitignore` (it should be excluded – reports are uploaded as workflow artifacts instead)

## For More Information

- **Trivy Documentation:** https://aquasecurity.github.io/trivy/
- **GitHub Actions:** https://docs.github.com/en/actions
- **Task Documentation:** https://taskfile.dev
