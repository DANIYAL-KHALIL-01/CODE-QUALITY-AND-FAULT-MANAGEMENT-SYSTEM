"""
Test Runner Service
Executes prioritized tests for Python, JavaScript/TypeScript, and Java projects.
"""

import json
import os
import re
import subprocess
from typing import List, Dict, Any, Optional


class TestRunner:
    """Service to execute real regression tests and capture pass/fail status."""

    def __init__(self):
        self.supported_test_frameworks = ['pytest', 'vitest', 'jest', 'mvn', 'gradle']

    def detect_test_command(self, repo_path: str, test_path: str) -> str:
        """Detect the right test command for a specific test file."""
        normalized_test_path = test_path.replace('\\', '/')
        extension = os.path.splitext(test_path)[1].lower()

        if extension == '.py':
            if os.path.exists(os.path.join(repo_path, 'pytest.ini')) or os.path.exists(os.path.join(repo_path, 'pyproject.toml')):
                return f'python -m pytest "{normalized_test_path}"'
            return f'pytest "{normalized_test_path}"'

        if extension in {'.js', '.ts', '.tsx', '.jsx'}:
            package_json = os.path.join(repo_path, 'package.json')
            if os.path.exists(package_json):
                try:
                    with open(package_json, 'r', encoding='utf-8') as handle:
                        package_data = json.load(handle)
                    scripts = package_data.get('scripts', {})
                    if 'test' in scripts:
                        test_script = scripts['test']
                        if 'vitest' in test_script:
                            return f'npx vitest run "{normalized_test_path}"'
                        if 'jest' in test_script:
                            return f'npx jest "{normalized_test_path}" --runInBand'
                    return f'npx jest "{normalized_test_path}" --runInBand'
                except Exception:
                    pass
            return f'npx jest "{normalized_test_path}" --runInBand'

        if extension == '.java':
            pom = os.path.join(repo_path, 'pom.xml')
            if os.path.exists(pom):
                return f'mvn test -Dtest="{normalized_test_path}"'
            gradle = os.path.join(repo_path, 'build.gradle')
            if os.path.exists(gradle):
                return f'./gradlew test --tests "{normalized_test_path}"'
            return f'mvn test -Dtest="{normalized_test_path}"'

        return f'python -m pytest "{normalized_test_path}"'

    def run_test(self, repo_path: str, test_path: str) -> Dict[str, Any]:
        """Execute one test file and return pass/fail details."""
        command = self.detect_test_command(repo_path, test_path)
        result = {
            'test_path': test_path,
            'command': command,
            'status': 'failed',
            'passed': False,
            'exit_code': 1,
            'duration_seconds': 0.0,
            'output': '',
            'failed_tests': []
        }

        try:
            completed = subprocess.run(
                command,
                cwd=repo_path,
                shell=True,
                capture_output=True,
                text=True,
                timeout=180
            )
            result['exit_code'] = completed.returncode
            result['output'] = (completed.stdout or '') + (completed.stderr or '')
            result['failed_tests'] = self.extract_failed_tests(result['output'])
            result['passed'] = completed.returncode == 0
            result['status'] = 'passed' if completed.returncode == 0 else 'failed'
            result['duration_seconds'] = self._estimate_duration(result['output'])
        except subprocess.TimeoutExpired:
            result['status'] = 'failed'
            result['passed'] = False
            result['output'] = 'Test execution timed out after 180 seconds.'
            result['failed_tests'] = [test_path]
        except Exception as exc:
            result['status'] = 'failed'
            result['passed'] = False
            result['output'] = str(exc)
            result['failed_tests'] = [test_path]

        return result

    def run_prioritized_tests(self, repo_path: str, tests: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Run a batch of prioritized tests in order."""
        results = []
        for test in tests:
            test_path = test.get('file_path') or test.get('path')
            if not test_path:
                continue
            result = self.run_test(repo_path, test_path)
            results.append({
                'name': test.get('name') or os.path.basename(test_path),
                'path': test_path,
                'status': result['status'],
                'passed': result['passed'],
                'exit_code': result['exit_code'],
                'duration_seconds': result['duration_seconds'],
                'output': result['output'],
                'failed_tests': result['failed_tests']
            })
        return results

    def extract_failed_tests(self, output: str) -> List[str]:
        """Extract failed test references from pytest/jest output."""
        matches = re.findall(r'(?:FAILED|FAIL|ERROR)\s+([^\n]+)', output, flags=re.IGNORECASE)
        if matches:
            return [m.strip() for m in matches if m.strip()]
        
        # pytest nodeid patterns like tests/test_auth.py::test_login
        pytest_matches = re.findall(r'([A-Za-z0-9_./\\-]+\.py::[A-Za-z0-9_\-]+)', output)
        if pytest_matches:
            return pytest_matches

        # jest patterns like FAIL src/example.test.ts
        jest_matches = re.findall(r'(?:FAIL\s+)([^\n]+)', output, flags=re.IGNORECASE)
        return [m.strip() for m in jest_matches if m.strip()]

    def _estimate_duration(self, output: str) -> float:
        """Estimate duration from common test runner output."""
        match = re.search(r'(?:(?:\d+\.\d+|\d+)s(?:\s+)?(?:passed|failed|completed)?)', output, flags=re.IGNORECASE)
        if not match:
            return 0.0
        try:
            return float(re.search(r'(\d+(?:\.\d+)?)', match.group(0)).group(1))
        except Exception:
            return 0.0
