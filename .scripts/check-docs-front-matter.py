#!/usr/bin/env python3

"""
Documentation Front Matter Validator

Validates that all markdown files under docs/ contain valid YAML front matter
with the required fields: title and description.

Generates a JSON report at .docs-reports/docs-front-matter-report.json.
"""

import json
import re
import sys
from pathlib import Path

REQUIRED_FIELDS = ["title", "description"]


def extract_front_matter(content):
    """Extract YAML front matter from markdown content.

    Returns the raw front matter string if found, otherwise None.
    """
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n", content, re.DOTALL)
    if match:
        return match.group(1)
    return None


def parse_front_matter_fields(raw):
    """Parse simple key: value pairs from raw YAML front matter.

    Returns a dict of found field names to their values.
    Does not support nested YAML — only top-level scalar fields are required.
    """
    fields = {}
    for line in raw.splitlines():
        m = re.match(r'^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)', line)
        if m:
            fields[m.group(1)] = m.group(2).strip()
    return fields


def check_file(md_path):
    """Check a single markdown file for valid front matter.

    Returns a list of issue dicts (empty list means the file is clean).
    """
    issues = []
    content = md_path.read_text(encoding="utf-8")
    raw = extract_front_matter(content)

    if raw is None:
        issues.append({
            "type": "missing_front_matter",
            "file": str(md_path),
            "message": f"No front matter found in {md_path}",
        })
        return issues

    fields = parse_front_matter_fields(raw)
    for field in REQUIRED_FIELDS:
        if field not in fields or not fields[field]:
            issues.append({
                "type": "missing_field",
                "file": str(md_path),
                "field": field,
                "message": f"Required front matter field '{field}' missing or empty in {md_path}",
            })

    return issues


def main():
    print("🔍 Checking documentation front matter…")

    docs_path = Path("docs")
    if not docs_path.is_dir():
        print("❌ docs/ directory not found")
        sys.exit(1)

    all_issues = []
    for md_file in sorted(docs_path.rglob("*.md")):
        all_issues.extend(check_file(md_file))

    Path(".docs-reports").mkdir(exist_ok=True)
    report = {
        "issues": all_issues,
        "issue_count": len(all_issues),
        "clean": len(all_issues) == 0,
    }
    with open(".docs-reports/docs-front-matter-report.json", "w") as f:
        json.dump(report, f, indent=2)

    if all_issues:
        print(f"❌ Found {len(all_issues)} front matter issue(s)")
        for issue in all_issues:
            print(f"  {issue['file']} — {issue['message']}")
        sys.exit(1)
    else:
        print("✅ All documentation front matter checks passed")


if __name__ == "__main__":
    main()
