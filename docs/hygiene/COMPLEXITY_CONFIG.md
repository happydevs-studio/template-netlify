# Code Complexity Workflow Configuration

This template includes automated code complexity analysis using **Lizard** to help maintain code quality. This guide explains how to customize and use this feature for your cloned repository.

## Quick Start

### Check Complexity Locally
```bash
task complexity
```

### What You Get Automatically
- ✅ PR comments with complexity reports
- ✅ Merge blocking if CCN > 10 (Cyclomatic Complexity)
- ✅ GitHub issues on main branch for high complexity problems

### Common Issues

| Problem | Solution |
|---------|----------|
| Workflow not triggering? | Check workflow is at `.github/workflows/hygiene-complexity-check.yml` (not `.github/`) |
| Need different threshold? | Update CCN > 10 threshold in `Taskfile.yml`, `.github/workflows/hygiene-complexity-check.yml`, and `.github/scripts/generate-complexity-md.py` |
| Don't want complexity checks? | Delete `.github/workflows/hygiene-complexity-check.yml` |

### Threshold Reference

| CCN | Status | Action |
|-----|--------|--------|
| ≤ 10 | ✅ Good | Merge allowed |
| 11-15 | ⚠️ Warning | Consider refactoring |
| > 15 | 🔴 Critical | Refactor before merge |

---

## Overview

The complexity workflow:
- ✅ Runs automatically on every PR to `main` and push to `main`  
- ✅ Analyzes cyclomatic complexity (CCN), function length, and code metrics
- ✅ Posts complexity reports as PR comments
- ✅ Creates GitHub issues when complexity issues are detected in `main`
- ✅ Fails PRs with high-complexity items (encouraging fixes before merge)

## Files Involved

| File | Purpose | Customization |
|------|---------|---------------|
| [`.github/workflows/hygiene-complexity-check.yml`](.github/workflows/hygiene-complexity-check.yml) | GitHub Actions workflow | Triggers, failure behavior, reporting |
| [`Taskfile.yml`](Taskfile.yml) | Local task runner config | Complexity thresholds, exclusions |
| [`.github/scripts/generate-complexity-md.py`](.github/scripts/generate-complexity-md.py) | Report generator | Markdown formatting, metrics |
| [`.gitignore`](.gitignore) | Git ignore rules | Excludes `.complexity-reports/` from version control |

## Key Configuration Points

### 1. **Complexity Threshold (CCN > 10)**

**Where it's defined:**
- `Taskfile.yml` - Python script checks `if ccn > 10` (line ~20)
- `.github/workflows/hygiene-complexity-check.yml` - AWK filter `'$2 > 10'` (multiple places)

**To change CCN threshold:**

In `Taskfile.yml`, update the `complexity:analyze` task to change the lizard exclusions or in the `generate-complexity-md.py` script:

```python
# Line ~19 in generate-complexity-md.py
if ccn > 10:  # ← Change this number (e.g., 15 for higher tolerance, 8 for stricter)
    high_complexity_items.append(row)
```

Also update the workflow file:
```yaml
# .github/workflows/hygiene-complexity-check.yml, line ~51
HIGH_COUNT=$(awk -F',' '$2 > 10' ...)  # ← Change 10 to your threshold
```

### 2. **File/Directory Exclusions**

Lizard analysis excludes certain paths from complexity checks. Edit in `Taskfile.yml`:

```yaml
# complexity:analyze task, lines 59-63
lizard . \
  -x "tests/*" \          # ← Exclude test files
  -x ".github/*" \        # ← Exclude GitHub workflows
  -x "node_modules/*" \   # ← Exclude dependencies
  -x ".git/*" \           # ← Exclude git directory
  -x "build/*" \          # ← Add custom exclusions here
```

### 3. **PR vs Main Branch Behavior**

The workflow has different behavior based on the trigger:

| Trigger | Behavior |
|---------|----------|
| **Pull Request** | Posts complexity report as comment, **fails if CCN > 10**, blocks merge |
| **Push to main** | Posts complexity report, creates GitHub issue if complexities found |
| **Workflow Dispatch** | Manual run for verification |

To disable PR failures (warnings only), edit `.github/workflows/hygiene-complexity-check.yml`:

```yaml
# Remove or comment out the "Fail job" step at the end:
- name: Fail job if high complexity found
  # if: steps.check-complexity.outputs.high_complexity_found == '1'  # ← Comment this out
  run: |
    echo "⚠️ Complexity issues detected (non-blocking)"
```

### 4. **Disable Complexity Checking**

To temporarily disable this workflow:

**Option A:** Disable the workflow in GitHub UI
- Go to Actions → Code Complexity Check → Disable workflow

**Option B:** Delete/rename the workflow file
```bash
# This will prevent the workflow from running
rm .github/workflows/hygiene-complexity-check.yml
```

**Option C:** Comment out the trigger
```yaml
# .github/workflows/complexity-check.yml
# on:
#   pull_request:
#     branches: [ main ]
#   push:
#     branches: [ main ]
```

## Running Complexity Analysis Locally

Before pushing code, analyze complexity locally:

```bash
# Install Task (one-time setup)
curl -sL https://taskfile.dev/install.sh | sh -s -- -b /usr/local/bin

# Run complexity analysis
task complexity
```

This generates:
- `.complexity-reports/complexity-report.md` - Human-readable report
- `.complexity-reports/complexity-report.csv` - Machine-readable metrics

## Understanding Complexity Metrics

### Cyclomatic Complexity (CCN)

Measures the number of independent paths through code. Higher = more complex.

| CCN Value | Assessment | Action |
|-----------|-----------|--------|
| ≤ 10 | ✅ Good | No action needed |
| 11-15 | ⚠️ Warning | Consider refactoring |
| > 15 | 🔴 Critical | Should be refactored |

**Example:**
```javascript
// CCN = 1 (linear code)
function simple() {
  return value * 2;
}

// CCN = 3 (two decision points)
function withConditions(x) {
  if (x > 0) {
    if (x > 10) return "high";
    return "low";
  }
  return "negative";
}
```

### NLOC (Non-Lines-of-Code)

Physical lines of code, excluding comments and blank lines.

**Target:** Keep functions under 50 lines.

## GitHub Issues on Main Branch

When complexity issues are detected on pushes to `main`:

1. A GitHub issue is created automatically with label `code-complexity`
2. Contains link to workflow run and complexity report
3. Includes reproduction steps and guidelines
4. Future complexity issues comment on the same issue

**To resolve:**
1. Create a branch to address the complex functions
2. Run `task complexity` locally to verify improvements
3. Open PR with refactored code
4. CI will verify complexity is reduced
5. After merge, close the GitHub issue

## Best Practices for This Template

Since this is a **static HTML template**, code should remain minimal:

- ✅ Keep helper scripts small and focused
- ✅ Avoid complex conditional logic
- ✅ Prefer simple, readable code over clever implementations
- ✅ Test code locally before pushing: `task complexity`

## Troubleshooting

### Lizard Not Found

If the workflow fails with "lizard: command not found":
- Task installation is automatic via `pip3 install --user lizard`
- If using custom Python environment, ensure lizard is installed: `pip install lizard`

### Reports Not Generated

If `.complexity-reports/` directory is empty:
1. Check workflow logs for errors
2. Verify Python script is executable: `chmod +x .github/scripts/generate-complexity-md.py`
3. Check that `.complexity-reports/` is not excluded by your `.gitignore` (it shouldn't be)

### Custom Threshold Not Working

If your threshold changes aren't taking effect:
1. Both `Taskfile.yml` AND `.github/workflows/hygiene-complexity-check.yml` must be updated
2. The Python script also has threshold checks
3. Rebuild Docker image or clear cache if using containers

## For More Information

- **Lizard Documentation:** https://github.com/terryyin/lizard
- **GitHub Actions:** https://docs.github.com/en/actions
- **Task Documentation:** https://taskfile.dev
