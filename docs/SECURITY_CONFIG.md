# Security Analysis Workflow Configuration

This template includes automated static security analysis using **Semgrep** to help detect security issues and bugs early. This guide explains how to customize and use this feature for your cloned repository.

## Quick Start

### Run Analysis Locally
```bash
task security
```

### What You Get Automatically
- ✅ PR comments with security findings report
- ✅ Merge blocking if any ERROR-severity findings exist
- ✅ GitHub issues on main branch for error-severity problems

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/security-check.yml` |
| Want stricter/looser rules? | Use a custom Semgrep config file (see below) |
| Don't want security checks? | Delete `.github/workflows/security-check.yml` |

### Severity Reference

| Severity | Status | Action |
|----------|--------|--------|
| ERROR | 🔴 Blocking | Must be fixed before merge |
| WARNING | ⚠️ Non-blocking | Review recommended |
| INFO | ℹ️ Informational | Awareness only |

---

## Overview

The security workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`
- ✅ Analyzes code using Semgrep's auto-configured rule set
- ✅ Posts findings as PR comments
- ✅ Creates GitHub issues when error-severity findings land on `main`
- ✅ Fails PRs with error-severity findings (encouraging fixes before merge)

## Files Involved

| File | Purpose | Customization |
|------|---------|---------------|
| [`.github/workflows/security-check.yml`](.github/workflows/security-check.yml) | GitHub Actions workflow | Triggers, failure behavior, reporting |
| [`Taskfile.yml`](Taskfile.yml) | Local task runner config | Rule config, exclusions |
| [`.scripts/generate-security-md.py`](.scripts/generate-security-md.py) | Report generator | Markdown formatting |
| [`.gitignore`](.gitignore) | Git ignore rules | Excludes `.security-reports/` from version control |

## Key Configuration Points

### 1. **Rule Configuration**

By default, Semgrep runs with `--config=auto`, which automatically selects rules relevant to the languages in your project.

**To use a custom rule set**, create a `.semgrep.yml` file in the project root:

```yaml
# .semgrep.yml
rules:
  - id: my-custom-rule
    pattern: exec(...)
    message: Avoid using exec()
    severity: ERROR
    languages: [python]
```

Then update the `security:analyze` task in `Taskfile.yml`:

```yaml
semgrep \
  --config=.semgrep.yml \   # ← Replace --config=auto
  --json \
  ...
```

**To use a specific Semgrep registry ruleset:**

```yaml
semgrep \
  --config=p/security-audit \   # ← e.g. p/owasp-top-ten, p/javascript
  --json \
  ...
```

### 2. **File/Directory Exclusions**

Edit the `security:analyze` task in `Taskfile.yml`:

```yaml
semgrep \
  --config=auto \
  --json \
  --exclude="node_modules" \    # ← Exclude dependencies
  --exclude=".git" \            # ← Exclude git directory
  --exclude="tests" \           # ← Add custom exclusions here
  .
```

### 3. **PR vs Main Branch Behavior**

| Trigger | Behavior |
|---------|----------|
| **Pull Request** | Posts security findings as comment, **fails if ERROR findings exist**, blocks merge |
| **Push to main** | Posts findings report, creates GitHub issue if error findings present |
| **Workflow Dispatch** | Manual run for verification |

To make findings non-blocking (warnings only), edit `.github/workflows/security-check.yml`:

```yaml
# Remove or comment out the "Fail job" step at the end:
- name: Fail job if error-severity findings found
  # if: steps.check-security.outputs.errors_found == '1'  # ← Comment this out
  run: |
    echo "⚠️ Security findings detected (non-blocking)"
```

### 4. **Disable Security Checking**

**Option A:** Disable the workflow in GitHub UI
- Go to Actions → Security Analysis → Disable workflow

**Option B:** Delete the workflow file
```bash
rm .github/workflows/security-check.yml
```

## Running Security Analysis Locally

Before pushing code, run security analysis locally:

```bash
# Install Task (one-time setup)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run security analysis
task security
```

This generates:
- `.security-reports/security-report.md` - Human-readable report
- `.security-reports/security-report.json` - Machine-readable findings

## Understanding Security Findings

### Severity Levels

| Severity | Description |
|----------|-------------|
| `ERROR` | High-confidence security or correctness issue — must be reviewed |
| `WARNING` | Potential issue or best-practice violation — should be reviewed |
| `INFO` | Informational finding — low priority |

### Example Output

```
Rule: python.lang.security.dangerous-exec
Severity: ERROR
Location: app.py:42
Message: Avoid calling exec() with user-controlled input
```

## GitHub Issues on Main Branch

When error-severity findings are detected on pushes to `main`:

1. A GitHub issue is created automatically with label `security`
2. Contains link to workflow run and security report
3. Includes reproduction steps and guidelines
4. Future error findings comment on the same open issue

**To resolve:**
1. Create a branch to address the reported findings
2. Run `task security` locally to verify findings are resolved
3. Open PR with the fix
4. CI will verify no error-severity findings remain
5. After merge, close the GitHub issue

## Best Practices for This Template

Since this is a **static HTML template**, code should remain minimal:

- ✅ Keep helper scripts small and focused
- ✅ Avoid patterns flagged by security rules
- ✅ Review WARNING findings even when they don't block the build
- ✅ Test code locally before pushing: `task security`

## Troubleshooting

### Semgrep Not Found

If the workflow fails with "semgrep: command not found":
- Installation is automatic via `pip3 install --user semgrep`
- If using a custom Python environment, ensure semgrep is installed: `pip install semgrep`

### No Findings But Expecting Some

- Verify the rule config matches your file types: `semgrep --config=auto` may not pick up rules for HTML
- Try a more targeted config: `--config=p/html` or `--config=p/javascript`

### Reports Not Generated

If `.security-reports/` directory is empty:
1. Check workflow logs for errors
2. Verify Python script is accessible: `.scripts/generate-security-md.py`

## For More Information

- **Semgrep Documentation:** https://semgrep.dev/docs/
- **Semgrep Registry:** https://semgrep.dev/r
- **GitHub Actions:** https://docs.github.com/en/actions
- **Task Documentation:** https://taskfile.dev
