# Security

Overview of security scanning and controls for this project.

## Contents

- [SAST — Static Application Security Testing](#sast--static-application-security-testing)
- [DAST — Dynamic Application Security Testing](#dast--dynamic-application-security-testing)
- [Dependency Vulnerability Scanning](#dependency-vulnerability-scanning)
- [Secrets Detection](#secrets-detection)
- [Penetration Testing](#penetration-testing)

---

# SAST — Static Application Security Testing

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

---

# DAST — Dynamic Application Security Testing

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

---

# Dependency Vulnerability Scanning

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
| `.github/workflows/security-vulnerability-all-check.yml` | GitHub Actions workflow |
| `Taskfile.yml` (`dependencies*` tasks) | Local task runner config |
| `.scripts/generate-dependencies-md.py` | Report generator |
| `.gitignore` | Excludes `.dependencies-reports/` |

## Key Configuration Points

### Change the Blocking Threshold

To block only on CRITICAL (not HIGH), edit the `check-dependencies` step in `security-vulnerability-all-check.yml`:

```bash
# Change this line:
if v.get('Severity', '').upper() in ('CRITICAL', 'HIGH'):
# To:
if v.get('Severity', '').upper() == 'CRITICAL':
```

### Disable Dependency Scanning

```bash
# Option A: delete the workflow
rm .github/workflows/security-vulnerability-all-check.yml

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

---

# Secrets Detection

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
| Workflow not triggering? | Check workflow is at `.github/workflows/security-secrets-check.yml` |
| False positives? | Add a `.gitleaks.toml` allowlist (see below) |
| Don't want secrets checks? | Delete `.github/workflows/security-secrets-check.yml` |

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
| `.github/workflows/security-secrets-check.yml` | GitHub Actions workflow |
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
rm .github/workflows/security-secrets-check.yml

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

---

# Penetration Testing

Penetration testing (pen testing) is a **manual, adversarial security exercise** in which a tester attempts to exploit your application as a real attacker would. It complements the automated checks (SAST, DAST, dependency scanning, secrets detection) by uncovering logic flaws, misconfigured infrastructure, and chained vulnerabilities that automated tools cannot reason about.

## Quick Start

### When to Run a Pen Test

| Trigger | Recommendation |
|---------|----------------|
| Before first production launch | ✅ Strongly recommended |
| After significant new features | ✅ Recommended |
| Periodic cadence (quarterly / annually) | ✅ Recommended |
| After a security incident | ✅ Required |
| Every pull request | ❌ Not practical — use DAST instead |

### Scope for a Static Netlify Site

| Area | What to Test |
|------|-------------|
| HTTP security headers | Verify CSP, HSTS, X-Frame-Options, etc. match policy |
| Client-side code | XSS, insecure `eval`, prototype pollution, unsafe `postMessage` handlers |
| Third-party scripts | Integrity of CDN resources (SRI), supply-chain risk |
| Netlify redirects & rewrites | Unintended open redirects, path-traversal in redirect rules |
| Authentication (if added) | Session handling, token storage, logout, brute-force protection |
| DNS & TLS | Certificate validity, DNSSEC, subdomain takeover risk |
| API integrations | Any serverless functions or external APIs called by the site |

### Severity Reference

| Severity | Status | Action |
|----------|--------|--------|
| Critical | 🔴 Immediate | Stop release, fix before any further deployment |
| High | 🟠 Blocking | Fix before next production release |
| Medium | 🟡 Planned | Schedule fix within current sprint |
| Low / Info | 🔵 Non-blocking | Document and address in backlog |

---

## Overview

Pen testing differs from automated scanning in key ways:

| | Automated (SAST / DAST) | Penetration Test |
|---|---|---|
| **Who runs it** | CI pipeline (machine) | Security professional (human) |
| **Frequency** | Every PR / push | Periodic or triggered |
| **Coverage** | Known patterns and signatures | Novel logic, chained attacks |
| **Output** | Machine-readable report | Detailed narrative report + proof-of-concept |
| **Time** | Seconds to minutes | Hours to days |

For this template — a static site hosted on Netlify — the automated checks (DAST baseline scan, SAST, dependency scanning) cover the bulk of continuous risk. A pen test adds depth by:

- Testing for logic-level vulnerabilities automated tools miss
- Verifying your Netlify configuration matches your security intent
- Validating that security headers actually prevent the attacks they are designed to prevent
- Checking for subdomain takeover or DNS misconfiguration
- Reviewing any third-party integrations or serverless functions you have added

## Process

A lightweight pen test process for this project:

### 1. Define scope and rules of engagement

Document which URLs, Netlify functions, and integrations are in scope. Agree on timing to avoid false alarms in monitoring.

### 2. Recon

```bash
# Check DNS and TLS
dig <your-domain> +short
nmap -sV --script ssl-cert <your-domain>

# Review HTTP response headers
curl -I https://<your-domain>
```

### 3. Automated baseline (if not already running in CI)

```bash
# Full OWASP ZAP active scan (more thorough than the baseline CI scan)
docker run --rm ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py \
  -t https://<your-deployed-site> \
  -r zap-full-report.html
```

### 4. Manual testing checklist

- [ ] Review `netlify.toml` headers against [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [ ] Test all client-side forms and input fields for XSS
- [ ] Check all redirects for open-redirect potential
- [ ] Verify SRI hashes on external scripts/stylesheets
- [ ] Attempt forced browsing to unlisted paths
- [ ] Check for sensitive information in JavaScript bundles (keys, internal URLs)
- [ ] Review `robots.txt` and `sitemap.xml` for unintended exposure
- [ ] Check cookies (if any) for `Secure`, `HttpOnly`, and `SameSite` flags
- [ ] Verify HTTPS enforcement and HSTS preloading

### 5. Document findings

For each finding record:
- **Title** — short description
- **Severity** — Critical / High / Medium / Low
- **Description** — what the issue is and why it matters
- **Reproduction steps** — how to trigger the issue
- **Recommendation** — how to remediate
- **Evidence** — screenshot or request/response dump

### 6. Remediate and retest

Fix findings in order of severity. After fixing each item, retest the specific scenario to confirm the fix is effective before closing the finding.

## Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| [OWASP ZAP](https://www.zaproxy.org/) | Full active scan | Already used for DAST baseline; use `zap-full-scan.py` for pen test depth |
| [Burp Suite Community](https://portswigger.net/burp/communitydownload) | Manual HTTP interception and testing | Free community edition available |
| [Nikto](https://github.com/sullo/nikto) | Web server misconfiguration scan | `nikto -h https://<your-site>` |
| [nuclei](https://github.com/projectdiscovery/nuclei) | Template-based vulnerability scanning | Large community template library |
| [subfinder](https://github.com/projectdiscovery/subfinder) | Subdomain enumeration | Check for subdomain takeover risk |
| [SSLyze](https://github.com/nabla-c0d3/sslyze) | TLS/SSL configuration analysis | `sslyze <your-domain>` |
| [securityheaders.com](https://securityheaders.com/) | HTTP header analysis (online) | Quick header grading |
| [observatory.mozilla.org](https://observatory.mozilla.org/) | Full site security rating (online) | CSP, HSTS, SRI scoring |

## Third-Party Pen Testing

For regulated environments or before a major public launch, consider engaging a specialist firm to conduct an independent assessment. When scoping an engagement for a static Netlify site:

- Share the public production URL and any staging environments
- Include any serverless functions (`netlify/functions/`) in scope
- Provide the repository for white-box review (optional but recommended)
- Request OWASP Top 10 and OWASP ASVS coverage as a minimum

## Disable / Skip

Pen testing is a manual process — there is no automated workflow to disable. If you add serverless functions or a backend, expand the scope checklist accordingly.

## For More Information

- **OWASP Testing Guide:** https://owasp.org/www-project-web-security-testing-guide/
- **OWASP ASVS:** https://owasp.org/www-project-application-security-verification-standard/
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Netlify Security:** https://www.netlify.com/security/
- **OWASP ZAP Full Scan:** https://www.zaproxy.org/docs/docker/full-scan/
