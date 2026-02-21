#!/usr/bin/env python3
"""Generate a Markdown security report from Trivy JSON output.

This script is used both locally (via 'task trivy') and in CI/CD.
It must reliably generate reports without silently hiding errors.
"""

import os
import json
from datetime import datetime
import sys
import traceback


SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"]

SEVERITY_ICONS = {
    "CRITICAL": "🔴",
    "HIGH": "🟠",
    "MEDIUM": "🟡",
    "LOW": "🔵",
    "UNKNOWN": "⚪",
}


def read_json_report(json_path):
    """Read Trivy JSON report and return parsed data."""
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"JSON report not found at {json_path}")

    try:
        with open(json_path, "r") as f:
            data = json.load(f)
    except Exception as e:
        raise RuntimeError(f"Failed to read JSON report: {e}") from e

    return data


def extract_vulnerabilities(data):
    """Extract and categorise vulnerabilities from Trivy results."""
    by_severity = {s: [] for s in SEVERITY_ORDER}

    for result in data.get("Results", []):
        target = result.get("Target", "unknown")
        result_type = result.get("Type", "")
        for vuln in result.get("Vulnerabilities") or []:
            severity = vuln.get("Severity", "UNKNOWN").upper()
            if severity not in by_severity:
                severity = "UNKNOWN"
            by_severity[severity].append({
                "target": target,
                "type": result_type,
                "vuln_id": vuln.get("VulnerabilityID", ""),
                "pkg": vuln.get("PkgName", ""),
                "installed": vuln.get("InstalledVersion", ""),
                "fixed": vuln.get("FixedVersion", ""),
                "title": vuln.get("Title", ""),
            })

    return by_severity


def extract_secrets(data):
    """Extract detected secrets from Trivy results."""
    secrets = []
    for result in data.get("Results", []):
        target = result.get("Target", "unknown")
        for secret in result.get("Secrets") or []:
            secrets.append({
                "target": target,
                "rule_id": secret.get("RuleID", ""),
                "category": secret.get("Category", ""),
                "title": secret.get("Title", ""),
                "severity": secret.get("Severity", "UNKNOWN").upper(),
            })
    return secrets


def extract_misconfigurations(data):
    """Extract misconfigurations from Trivy results."""
    misconfigs = []
    for result in data.get("Results", []):
        target = result.get("Target", "unknown")
        for mc in result.get("Misconfigurations") or []:
            severity = mc.get("Severity", "UNKNOWN").upper()
            misconfigs.append({
                "target": target,
                "id": mc.get("ID", ""),
                "title": mc.get("Title", ""),
                "description": mc.get("Description", ""),
                "severity": severity,
            })
    return misconfigs


def count_by_severity(by_severity):
    """Return total count and per-severity counts."""
    counts = {s: len(items) for s, items in by_severity.items()}
    counts["TOTAL"] = sum(counts.values())
    return counts


def format_summary_section(vuln_counts, secret_count, misconfig_count):
    """Format the summary table for the markdown report."""
    lines = ["## Summary\n"]
    lines.append("| Severity | Vulnerabilities |")
    lines.append("|----------|-----------------|")
    for sev in SEVERITY_ORDER:
        icon = SEVERITY_ICONS.get(sev, "")
        lines.append(f"| {icon} {sev} | {vuln_counts.get(sev, 0)} |")
    lines.append(f"| **TOTAL** | **{vuln_counts.get('TOTAL', 0)}** |")
    lines.append("")
    lines.append(f"- 🔑 **Secrets detected**: {secret_count}")
    lines.append(f"- ⚙️  **Misconfigurations**: {misconfig_count}")
    lines.append("")
    return "\n".join(lines) + "\n"


def format_status_section(vuln_counts, secret_count, misconfig_count):
    """Format overall status line."""
    high_critical = vuln_counts.get("CRITICAL", 0) + vuln_counts.get("HIGH", 0)
    if high_critical > 0 or secret_count > 0:
        return f"## ⚠️ Security Status\n\nFound {high_critical} HIGH/CRITICAL vulnerability/ies and {secret_count} secret(s). Please review and remediate.\n\n"
    return "## ✅ Security Status\n\nNo HIGH/CRITICAL vulnerabilities or secrets detected.\n\n"


def format_vulnerabilities_section(by_severity):
    """Format the vulnerability details section."""
    total = sum(len(v) for v in by_severity.values())
    if total == 0:
        return ""

    result = "## Vulnerability Details\n\n"
    for sev in SEVERITY_ORDER:
        items = by_severity[sev]
        if not items:
            continue
        icon = SEVERITY_ICONS.get(sev, "")
        result += f"### {icon} {sev} ({len(items)})\n\n"
        result += "| ID | Package | Installed | Fixed | Title |\n"
        result += "|----|---------|-----------|-------|-------|\n"
        for v in items:
            fixed = v["fixed"] if v["fixed"] else "—"
            title = v["title"][:60] + "…" if len(v["title"]) > 60 else v["title"]
            result += f"| `{v['vuln_id']}` | {v['pkg']} | {v['installed']} | {fixed} | {title} |\n"
        result += "\n"
    return result


def format_secrets_section(secrets):
    """Format the secrets section."""
    if not secrets:
        return ""

    result = "## 🔑 Detected Secrets\n\n"
    result += "| File | Rule | Category | Severity |\n"
    result += "|------|------|----------|----------|\n"
    for s in secrets:
        icon = SEVERITY_ICONS.get(s["severity"], "⚪")
        result += f"| `{s['target']}` | {s['rule_id']} | {s['category']} | {icon} {s['severity']} |\n"
    result += "\n"
    return result


def format_misconfigurations_section(misconfigs):
    """Format the misconfigurations section."""
    if not misconfigs:
        return ""

    result = "## ⚙️ Misconfigurations\n\n"
    result += "| File | ID | Severity | Title |\n"
    result += "|------|----|----------|-------|\n"
    for m in misconfigs:
        icon = SEVERITY_ICONS.get(m["severity"], "⚪")
        title = m["title"][:60] + "…" if len(m["title"]) > 60 else m["title"]
        result += f"| `{m['target']}` | {m['id']} | {icon} {m['severity']} | {title} |\n"
    result += "\n"
    return result


def build_markdown_report(data):
    """Build the complete markdown report from Trivy JSON data."""
    by_severity = extract_vulnerabilities(data)
    secrets = extract_secrets(data)
    misconfigs = extract_misconfigurations(data)

    vuln_counts = count_by_severity(by_severity)
    secret_count = len(secrets)
    misconfig_count = len(misconfigs)

    md_content = "# Security Scan Report (Trivy)\n\n"
    md_content += f"**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"

    md_content += format_status_section(vuln_counts, secret_count, misconfig_count)
    md_content += format_summary_section(vuln_counts, secret_count, misconfig_count)
    md_content += format_vulnerabilities_section(by_severity)
    md_content += format_secrets_section(secrets)
    md_content += format_misconfigurations_section(misconfigs)

    md_content += "## Guidelines\n\n"
    md_content += "- **CRITICAL/HIGH**: Must be fixed before merging\n"
    md_content += "- **MEDIUM**: Should be reviewed and addressed\n"
    md_content += "- **LOW**: Monitor and fix when possible\n\n"
    md_content += "## More Information\n\n"
    md_content += "- Generated by [Trivy](https://aquasecurity.github.io/trivy/)\n"
    md_content += "- Reports location: `.trivy-reports/`\n"
    md_content += "  - `trivy-report.md` (this file)\n"
    md_content += "  - `trivy-report.json` (machine-readable)\n"

    return md_content


def write_report(report_path, content):
    """Write markdown report to file."""
    try:
        with open(report_path, "w") as f:
            f.write(content)
    except Exception as e:
        raise RuntimeError(f"Failed to write markdown report: {e}") from e


def main():
    """Generate markdown report from Trivy JSON output."""
    os.makedirs(".trivy-reports", exist_ok=True)

    json_path = ".trivy-reports/trivy-report.json"
    report_path = ".trivy-reports/trivy-report.md"

    data = read_json_report(json_path)
    report_content = build_markdown_report(data)
    write_report(report_path, report_content)

    print("✅ Markdown report generated successfully")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"❌ Error generating markdown report: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
