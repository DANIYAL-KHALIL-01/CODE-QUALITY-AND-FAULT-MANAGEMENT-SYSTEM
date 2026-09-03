"""
Test Discovery Service
Finds actual test files in the repository and maps them to source modules
"""

import os
import re
from typing import List, Dict, Any


class TestDiscovery:
    """Service for discovering test files and mapping them to source modules"""
    
    def __init__(self):
        self.test_patterns = {
            '.py': [r'^test_\w+\.py$', r'^\w+_test\.py$', r'^tests\.py$'],
            '.js': [r'^.*\.test\.js$', r'^.*\.spec\.js$'],
            '.ts': [r'^.*\.test\.ts$', r'^.*\.spec\.ts$'],
            '.tsx': [r'^.*\.test\.tsx$', r'^.*\.spec\.tsx$'],
            '.jsx': [r'^.*\.test\.jsx$', r'^.*\.spec\.jsx$'],
            '.java': [r'^.*Test\.java$', r'^.*Tests\.java$']
        }
        
        self.source_extensions = {'.py', '.js', '.ts', '.tsx', '.jsx', '.java'}
    
    def discover_tests(self, repo_path: str) -> List[Dict[str, Any]]:
        """Discover all test files in the repository"""
        tests = []
        
        for root, dirs, files in os.walk(repo_path):
            # Skip common non-test directories
            skip_dirs = {
                '.git', 'node_modules', '__pycache__', 'venv', '.venv',
                'build', 'dist', '.next', 'vendor', 'target',
                'bin', 'obj', 'out', 'coverage', '.pytest_cache', '.tox'
            }
            dirs[:] = [d for d in dirs if d.lower() not in {s.lower() for s in skip_dirs}]
            
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, repo_path).replace(os.sep, '/')
                
                if self._is_test_file(file):
                    file_size = os.path.getsize(file_path)
                    tests.append({
                        'name': file,
                        'path': relative_path,
                        'absolute_path': file_path,
                        'size': file_size,
                        'ext': os.path.splitext(file)[1].lower(),
                        'covered_modules': self._find_covered_modules(file_path, repo_path)
                    })
        
        return tests
    
    def _is_test_file(self, filename: str) -> bool:
        """Check if a file is a test file based on naming conventions"""
        _, ext = os.path.splitext(filename)
        ext = ext.lower()
        
        if ext not in self.test_patterns:
            return False
        
        for pattern in self.test_patterns[ext]:
            if re.match(pattern, filename):
                return True
        
        return False
    
    def _find_covered_modules(self, test_file_path: str, repo_path: str) -> List[str]:
        """Extract which source modules this test file covers"""
        covered = []
        
        try:
            with open(test_file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Extract imports/requires
            test_ext = os.path.splitext(test_file_path)[1].lower()
            test_name = os.path.splitext(os.path.basename(test_file_path))[0]
            
            if test_ext in ['.py']:
                covered.extend(self._extract_python_imports(content))
                covered.append(self._guess_module_from_test_name(test_name, repo_path, '.py'))
            
            elif test_ext in ['.js', '.ts', '.tsx', '.jsx']:
                covered.extend(self._extract_js_imports(content))
                covered.append(self._guess_module_from_test_name(test_name, repo_path, test_ext))
            
            elif test_ext == '.java':
                covered.extend(self._extract_java_imports(content))
            
            # Remove duplicates and None values
            covered = list(set(filter(None, covered)))
        
        except Exception as e:
            print(f"[TestDiscovery] Warning: Failed to analyze {test_file_path}: {str(e)}")
        
        return covered
    
    def _extract_python_imports(self, content: str) -> List[str]:
        """Extract Python module imports"""
        modules = []
        
        # from module import X
        from_imports = re.findall(r'^\s*from\s+([a-zA-Z0-9_.]+)\s+import', content, re.MULTILINE)
        modules.extend(from_imports)
        
        # import module
        direct_imports = re.findall(r'^\s*import\s+([a-zA-Z0-9_.]+)', content, re.MULTILINE)
        modules.extend(direct_imports)
        
        return [m.replace('.', '/') + '.py' if '.' in m else m + '.py' for m in modules]
    
    def _extract_js_imports(self, content: str) -> List[str]:
        """Extract JavaScript/TypeScript imports"""
        modules = []
        
        # import X from './path'
        import_patterns = re.findall(r'import\s+.*?\s+from\s+["\']([^"\']+)["\']', content)
        modules.extend(import_patterns)
        
        # require('./path')
        require_patterns = re.findall(r'require\s*\(\s*["\']([^"\']+)["\']\s*\)', content)
        modules.extend(require_patterns)
        
        return modules
    
    def _extract_java_imports(self, content: str) -> List[str]:
        """Extract Java imports"""
        modules = []
        
        # import com.example.MyClass
        imports = re.findall(r'^\s*import\s+([a-zA-Z0-9_.]+);', content, re.MULTILINE)
        modules.extend(imports)
        
        return modules
    
    def _guess_module_from_test_name(self, test_name: str, repo_path: str, ext: str) -> str:
        """Guess the source module based on test name convention"""
        # test_auth.py -> auth.py
        # AuthService.test.ts -> AuthService.ts
        
        if test_name.startswith('test_'):
            module_name = test_name[5:] + ext
        elif test_name.endswith('_test'):
            module_name = test_name[:-5] + ext
        elif '.test' in test_name:
            module_name = test_name.replace('.test', '') + ext
        elif '.spec' in test_name:
            module_name = test_name.replace('.spec', '') + ext
        else:
            module_name = test_name + ext
        
        return module_name
