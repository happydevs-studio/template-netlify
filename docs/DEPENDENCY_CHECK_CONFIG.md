# Dependency Check Workflow Configuration

This template includes automated dependency vulnerability scanning to help maintain security. This guide explains how to customize and use this feature for your cloned repository.

## Quick Start

### Check Dependencies Locally
```bash
task dependency-check
```

### What You Get Automatically
- ✅ PR comments with vulnerability reports
- ✅ Merge blocking if CRITICAL or HIGH vulnerabilities found
- ✅ GitHub issues on main branch for detected vulnerabilities

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/dependency-check.yml` |
| Need different threshold? | Update severity check in `.github/workflows/dependency-check.yml` and `Taskfile.yml` |
| Don't want dependency checks? | Delete `.github/workflows/dependency-check.yml` |
| NVD rate limiting? | Add `NVD_API_KEY` repository secret (see below) |

### Severity Reference

| Severity | CVSS Score | Action |
|----------|-----------|--------|
| 🔴 CRITICAL | ≥ 9.0 | Immediate action required — merge blocked |
| 🟠 HIGH | 7.0–8.9 | Fix as soon as possible — merge blocked |
| 🟡 MEDIUM | 4.0–6.9 | Fix in next release — merge allowed |
| 🔵 LOW | < 4.0 | Fix when convenient — merge allowed |

---

## Overview

The dependency check workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`
- ✅ Scans all project dependencies for known CVEs
- ✅ Posts vulnerability reports as PR comments
- ✅ Creates GitHub issues when vulnerabilities are detected in `main`
- ✅ Fails PRs with CRITICAL or HIGH vulnerabilities (encouraging fixes before merge)

## Files Involved

| File | Purpose | Customization |
|------|---------|---------------|
| [`.github/workflows/dependency-check.yml`](.github/workflows/dependency-check.yml) | GitHub Actions workflow | Triggers, failure behavior, reporting |
| [`Taskfile.yml`](Taskfile.yml) | Local task runner config | Tool installation, scan exclusions |
| [`.scripts/generate-dependency-check-md.py`](.scripts/generate-dependency-check-md.py) | Report generator | Markdown formatting, severity handling |
| [`.gitignore`](.gitignore) | Git ignore rules | Excludes `.dependency-check-reports/` and `.dependency-check-tool/` |

## Key Configuration Points

### 1. **Severity Threshold**

The workflow blocks merges on CRITICAL and HIGH vulnerabilities. To change this:

In `.github/workflows/dependency-check.yml`, update the Python snippet in the `Check for CRITICAL/HIGH vulnerabilities` step:

```python
# Change which severities trigger a failure
if v.get('severity', '').upper() in ('CRITICAL', 'HIGH'):  # ← Add/remove severities
    count += 1
```

Also update the same check in `Taskfile.yml` (`dependency-check:report` task).

### 2. **File/Directory Exclusions**

Edit the `dependency-check:analyze` task in `Taskfile.yml`:

```yaml
"$DC_CMD" \
  --project "template-netlify" \
  --scan . \
  --exclude ".git/**" \
  --exclude ".dependency-check-tool/**" \
  --exclude "node_modules/**" \    # ← Add/remove exclusions
  --exclude ".dependency-check-reports/**" \
  --format JSON \
  --out ".dependency-check-reports"
```

### 3. **NVD API Key (Optional)**

OWASP Dependency-Check downloads the NVD (National Vulnerability Database) for up-to-date vulnerability data. Rate limiting can slow this down. To speed it up:

1. Get a free API key at https://nvd.nist.gov/developers/request-an-api-key
2. Add it as a GitHub repository secret named `NVD_API_KEY`
3. Update the workflow step in `.github/workflows/dependency-check.yml`:

```yaml
- name: Run dependency check analysis
  env:
    NVD_API_KEY: ${{ secrets.NVD_API_KEY }}
  run: |
    task dependency-check
```

And in `Taskfile.yml`, pass it to dependency-check:

```yaml
"$DC_CMD" \
  --nvdApiKey "$NVD_API_KEY" \
  ...
```

### 4. **Dependency-Check Version**

The version is pinned in `Taskfile.yml` and `.github/workflows/dependency-check.yml`:

```bash
DC_VERSION="9.0.9"  # ← Update to use a newer release
```

Check releases at: https://github.com/jeremylong/DependencyCheck/releases

### 5. **PR vs Main Branch Behavior**

| Trigger | Behavior |
|---------|----------|
| **Pull Request** | Posts vulnerability report as comment, **fails if CRITICAL/HIGH found** |
| **Push to main** | Posts report, creates GitHub issue if vulnerabilities found |
| **Workflow Dispatch** | Manual run for verification |

To disable PR failures (warnings only), edit `.github/workflows/dependency-check.yml`:

```yaml
# Remove or comment out the last step:
# - name: Fail job if CRITICAL/HIGH vulnerabilities found
#   if: steps.check-vulns.outputs.high_vulns_found == '1'
```

### 6. **Disable Dependency Checking**

**Option A:** Disable the workflow in GitHub UI
- Go to Actions → Dependency Check → Disable workflow

**Option B:** Delete the workflow file
```bash
rm .github/workflows/dependency-check.yml
```

## Running Dependency Check Locally

Before pushing code, analyze dependencies locally:

```bash
# Install Task (one-time setup)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run analysis (downloads dependency-check tool on first run)
task dependency-check
```

This generates:
- `.dependency-check-reports/dependency-check-report.md` — Human-readable vulnerability report
- `.dependency-check-reports/dependency-check-report.json` — Machine-readable report

> **Note:** The first run downloads the NVD database (several hundred MB) and may take several minutes. Subsequent runs use a cached database.

## GitHub Issues on Main Branch

When CRITICAL/HIGH vulnerabilities are detected on pushes to `main`:

1. A GitHub issue is created automatically with label `dependency-vulnerability`
2. Contains link to workflow run and vulnerability report
3. Includes reproduction steps and guidelines
4. Future detections comment on the same issue

**To resolve:**
1. Update the vulnerable dependency to a patched version
2. Run `task dependency-check` locally to verify the vulnerability is resolved
3. Open a PR with the updated dependency
4. CI will verify no CRITICAL/HIGH vulnerabilities remain
5. After merge, close the GitHub issue

## Troubleshooting

### dependency-check Not Found

If the workflow fails with "dependency-check: command not found":
- The install step downloads it automatically from GitHub releases
- Ensure `curl` or `wget` is available in your environment
- Verify Java 17+ is installed: `java -version`

### NVD Database Download Fails

If the database download fails:
- Check network connectivity
- Consider adding an NVD API key to avoid rate limiting (see above)
- The CI workflow uses `actions/cache` to persist the database between runs

### Reports Not Generated

If `.dependency-check-reports/` directory is empty:
1. Check workflow logs for errors
2. Verify Java is available: `java -version`
3. Check that `.dependency-check-reports/` is not excluded by `.gitignore` (it shouldn't be tracked, just excluded)

## For More Information

- **OWASP Dependency-Check:** https://owasp.org/www-project-dependency-check/
- **OWASP Dependency-Check GitHub:** https://github.com/jeremylong/DependencyCheck
- **NVD API Key:** https://nvd.nist.gov/developers/request-an-api-key
- **GitHub Actions:** https://docs.github.com/en/actions
- **Task Documentation:** https://taskfile.dev
