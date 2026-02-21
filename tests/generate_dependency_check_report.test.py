"""Tests for the dependency check report generation script."""

import os
import sys
import json
import tempfile
import shutil
import subprocess
from pathlib import Path

# Resolve the path to the script relative to this test file
REPO_ROOT = Path(__file__).parent.parent
SCRIPT_PATH = str(REPO_ROOT / ".scripts" / "generate-dependency-check-md.py")


def setup_test_env():
    """Create a temporary directory for test files."""
    tmpdir = tempfile.mkdtemp()
    os.chdir(tmpdir)
    os.makedirs(".dependency-check-reports", exist_ok=True)
    return tmpdir


def teardown_test_env(tmpdir):
    """Clean up temporary test directory."""
    os.chdir("/")
    shutil.rmtree(tmpdir, ignore_errors=True)


def make_json_report(dependencies=None):
    """Create a minimal valid dependency check JSON report structure."""
    return {
        "reportSchema": "1.1",
        "scanInfo": {"engineVersion": "9.0.9"},
        "projectInfo": {"name": "test-project", "reportDate": "2024-01-01"},
        "dependencies": dependencies or [],
    }


def write_json_report(tmpdir, data):
    """Write JSON report to the expected path."""
    path = os.path.join(tmpdir, ".dependency-check-reports", "dependency-check-report.json")
    with open(path, "w") as f:
        json.dump(data, f)


def test_missing_json_fails():
    """Test that script fails when JSON report is missing."""
    tmpdir = setup_test_env()
    try:
        result = subprocess.run(
            ["python3", SCRIPT_PATH],
            capture_output=True,
            text=True,
            cwd=tmpdir
        )

        assert result.returncode != 0, "Script should fail when JSON is missing"
        assert "JSON report not found" in result.stderr, "Should report missing JSON"
        assert not os.path.exists(".dependency-check-reports/dependency-check-report.md"), \
            "Should not generate report on error"

        print("✅ test_missing_json_fails passed")
    finally:
        teardown_test_env(tmpdir)


def test_generates_report_with_no_vulnerabilities():
    """Test that script generates markdown report when no vulnerabilities found."""
    tmpdir = setup_test_env()
    try:
        write_json_report(tmpdir, make_json_report(dependencies=[
            {"fileName": "package-lock.json", "vulnerabilities": []}
        ]))

        result = subprocess.run(
            ["python3", SCRIPT_PATH],
            capture_output=True,
            text=True,
            cwd=tmpdir
        )

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"
        assert os.path.exists(".dependency-check-reports/dependency-check-report.md"), \
            "Should generate markdown report"

        with open(".dependency-check-reports/dependency-check-report.md", "r") as f:
            content = f.read()

        assert "Dependency Check Report" in content, "Should have title"
        assert "✅ Vulnerability Status" in content, "Should show clean status"
        assert "No vulnerabilities found" in content, "Should indicate no vulnerabilities"

        print("✅ test_generates_report_with_no_vulnerabilities passed")
    finally:
        teardown_test_env(tmpdir)


def test_identifies_critical_high_vulnerabilities():
    """Test that script identifies CRITICAL and HIGH vulnerabilities."""
    tmpdir = setup_test_env()
    try:
        write_json_report(tmpdir, make_json_report(dependencies=[
            {
                "fileName": "lodash-4.17.20.js",
                "vulnerabilities": [
                    {
                        "name": "CVE-2021-23337",
                        "severity": "HIGH",
                        "cvssv3": {"baseScore": 7.2},
                        "description": "Prototype pollution vulnerability in lodash.",
                    },
                    {
                        "name": "CVE-2020-28500",
                        "severity": "MEDIUM",
                        "cvssv3": {"baseScore": 5.3},
                        "description": "ReDoS vulnerability in lodash.",
                    },
                ],
            },
            {
                "fileName": "axios-0.21.0.js",
                "vulnerabilities": [
                    {
                        "name": "CVE-2021-3749",
                        "severity": "CRITICAL",
                        "cvssv3": {"baseScore": 9.1},
                        "description": "SSRF vulnerability in axios.",
                    }
                ],
            },
        ]))

        result = subprocess.run(
            ["python3", SCRIPT_PATH],
            capture_output=True,
            text=True,
            cwd=tmpdir
        )

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"

        with open(".dependency-check-reports/dependency-check-report.md", "r") as f:
            content = f.read()

        assert "CRITICAL Vulnerabilities" in content, "Should identify CRITICAL section"
        assert "HIGH Vulnerabilities" in content, "Should identify HIGH section"
        assert "CVE-2021-3749" in content, "Should list CRITICAL CVE"
        assert "CVE-2021-23337" in content, "Should list HIGH CVE"
        assert "axios-0.21.0.js" in content, "Should list affected dependency"

        print("✅ test_identifies_critical_high_vulnerabilities passed")
    finally:
        teardown_test_env(tmpdir)


def test_summary_counts_are_correct():
    """Test that summary counts in the report are accurate."""
    tmpdir = setup_test_env()
    try:
        write_json_report(tmpdir, make_json_report(dependencies=[
            {
                "fileName": "dep-a.js",
                "vulnerabilities": [
                    {"name": "CVE-A1", "severity": "CRITICAL", "description": "desc"},
                    {"name": "CVE-A2", "severity": "HIGH", "description": "desc"},
                    {"name": "CVE-A3", "severity": "MEDIUM", "description": "desc"},
                    {"name": "CVE-A4", "severity": "LOW", "description": "desc"},
                ],
            }
        ]))

        result = subprocess.run(
            ["python3", SCRIPT_PATH],
            capture_output=True,
            text=True,
            cwd=tmpdir
        )

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"

        with open(".dependency-check-reports/dependency-check-report.md", "r") as f:
            content = f.read()

        assert "Total vulnerabilities**: 4" in content, "Should count 4 total vulnerabilities"
        assert "CRITICAL: 1" in content, "Should count 1 CRITICAL"
        assert "HIGH: 1" in content, "Should count 1 HIGH"
        assert "MEDIUM: 1" in content, "Should count 1 MEDIUM"
        assert "LOW: 1" in content, "Should count 1 LOW"

        print("✅ test_summary_counts_are_correct passed")
    finally:
        teardown_test_env(tmpdir)


def test_report_includes_guidelines():
    """Test that report includes guidelines."""
    tmpdir = setup_test_env()
    try:
        write_json_report(tmpdir, make_json_report())

        result = subprocess.run(
            ["python3", SCRIPT_PATH],
            capture_output=True,
            text=True,
            cwd=tmpdir
        )

        assert result.returncode == 0, f"Script should succeed. stderr: {result.stderr}"

        with open(".dependency-check-reports/dependency-check-report.md", "r") as f:
            content = f.read()

        assert "Guidelines" in content, "Should include guidelines"
        assert "CRITICAL" in content, "Should explain CRITICAL severity"
        assert "HIGH" in content, "Should explain HIGH severity"
        assert "OWASP Dependency-Check" in content, "Should credit OWASP"

        print("✅ test_report_includes_guidelines passed")
    finally:
        teardown_test_env(tmpdir)


if __name__ == "__main__":
    print("\n🧪 Running dependency check script tests...\n")

    try:
        test_missing_json_fails()
        test_generates_report_with_no_vulnerabilities()
        test_identifies_critical_high_vulnerabilities()
        test_summary_counts_are_correct()
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
