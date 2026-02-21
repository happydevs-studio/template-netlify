"""Tests for the Trivy report generation script."""

import os
import sys
import json
import tempfile
import shutil
import subprocess
from pathlib import Path

SCRIPT_PATH = str(Path(__file__).parent.parent / ".scripts" / "generate-trivy-md.py")


def setup_test_env():
    """Create a temporary directory for test files."""
    original_dir = os.getcwd()
    tmpdir = tempfile.mkdtemp()
    os.chdir(tmpdir)
    os.makedirs(".trivy-reports", exist_ok=True)
    return tmpdir, original_dir


def teardown_test_env(tmpdir, original_dir):
    """Clean up temporary test directory."""
    os.chdir(original_dir)
    shutil.rmtree(tmpdir, ignore_errors=True)


def write_json_report(data):
    """Write a Trivy JSON report to the expected path."""
    with open(".trivy-reports/trivy-report.json", "w") as f:
        json.dump(data, f)


def run_script(tmpdir):
    return subprocess.run(
        ["python3", SCRIPT_PATH],
        capture_output=True,
        text=True,
        cwd=tmpdir,
    )


def test_missing_json_fails():
    """Test that script fails when JSON report is missing."""
    tmpdir, original_dir = setup_test_env()
    try:
        result = run_script(tmpdir)

        assert result.returncode != 0, "Script should fail when JSON is missing"
        assert "JSON report not found" in result.stderr, "Should report missing JSON"
        assert not os.path.exists(".trivy-reports/trivy-report.md"), \
            "Should not generate report on error"

        print("✅ test_missing_json_fails passed")
    finally:
        teardown_test_env(tmpdir, original_dir)


def test_generates_report_with_no_vulnerabilities():
    """Test that script generates a clean report when no vulns are found."""
    tmpdir, original_dir = setup_test_env()
    try:
        write_json_report({"Results": []})

        result = run_script(tmpdir)

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"
        assert os.path.exists(".trivy-reports/trivy-report.md"), \
            "Should generate markdown report"

        with open(".trivy-reports/trivy-report.md") as f:
            content = f.read()

        assert "Security Scan Report (Trivy)" in content, "Should have title"
        assert "✅ Security Status" in content, "Should show clean status"
        assert "No HIGH/CRITICAL" in content, "Should indicate clean status"

        print("✅ test_generates_report_with_no_vulnerabilities passed")
    finally:
        teardown_test_env(tmpdir, original_dir)


def test_identifies_high_critical_vulnerabilities():
    """Test that script identifies HIGH/CRITICAL vulnerabilities."""
    tmpdir, original_dir = setup_test_env()
    try:
        data = {
            "Results": [
                {
                    "Target": "package-lock.json",
                    "Type": "npm",
                    "Vulnerabilities": [
                        {
                            "VulnerabilityID": "CVE-2024-1234",
                            "PkgName": "example-pkg",
                            "InstalledVersion": "1.0.0",
                            "FixedVersion": "1.0.1",
                            "Severity": "CRITICAL",
                            "Title": "Critical vulnerability in example-pkg",
                        },
                        {
                            "VulnerabilityID": "CVE-2024-5678",
                            "PkgName": "another-pkg",
                            "InstalledVersion": "2.0.0",
                            "FixedVersion": "",
                            "Severity": "HIGH",
                            "Title": "High severity issue",
                        },
                        {
                            "VulnerabilityID": "CVE-2024-9999",
                            "PkgName": "low-pkg",
                            "InstalledVersion": "3.0.0",
                            "FixedVersion": "3.0.1",
                            "Severity": "LOW",
                            "Title": "Low severity issue",
                        },
                    ],
                }
            ]
        }
        write_json_report(data)

        result = run_script(tmpdir)

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"

        with open(".trivy-reports/trivy-report.md") as f:
            content = f.read()

        assert "⚠️ Security Status" in content, "Should show warning status"
        assert "CVE-2024-1234" in content, "Should list critical CVE"
        assert "CVE-2024-5678" in content, "Should list high CVE"
        assert "CRITICAL" in content, "Should show CRITICAL severity"
        assert "HIGH" in content, "Should show HIGH severity"
        assert "example-pkg" in content, "Should show package name"

        print("✅ test_identifies_high_critical_vulnerabilities passed")
    finally:
        teardown_test_env(tmpdir, original_dir)


def test_detects_secrets():
    """Test that script surfaces detected secrets."""
    tmpdir, original_dir = setup_test_env()
    try:
        data = {
            "Results": [
                {
                    "Target": "config.yml",
                    "Type": "yaml",
                    "Secrets": [
                        {
                            "RuleID": "aws-access-key-id",
                            "Category": "AWS",
                            "Title": "AWS Access Key ID",
                            "Severity": "CRITICAL",
                        }
                    ],
                }
            ]
        }
        write_json_report(data)

        result = run_script(tmpdir)

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"

        with open(".trivy-reports/trivy-report.md") as f:
            content = f.read()

        assert "Detected Secrets" in content, "Should have secrets section"
        assert "aws-access-key-id" in content, "Should list the secret rule"
        assert "⚠️ Security Status" in content, "Should show warning when secrets found"

        print("✅ test_detects_secrets passed")
    finally:
        teardown_test_env(tmpdir, original_dir)


def test_report_includes_guidelines():
    """Test that report includes remediation guidelines."""
    tmpdir, original_dir = setup_test_env()
    try:
        write_json_report({"Results": []})

        result = run_script(tmpdir)

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"

        with open(".trivy-reports/trivy-report.md") as f:
            content = f.read()

        assert "Guidelines" in content, "Should include guidelines"
        assert "CRITICAL/HIGH" in content, "Should mention CRITICAL/HIGH"
        assert "Generated by [Trivy]" in content, "Should credit Trivy"

        print("✅ test_report_includes_guidelines passed")
    finally:
        teardown_test_env(tmpdir, original_dir)


if __name__ == "__main__":
    print("\n🧪 Running Trivy report script tests...\n")

    try:
        test_missing_json_fails()
        test_generates_report_with_no_vulnerabilities()
        test_identifies_high_critical_vulnerabilities()
        test_detects_secrets()
        test_report_includes_guidelines()

        print("\n✅ All tests passed!\n")
        sys.exit(0)
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}\n")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)
