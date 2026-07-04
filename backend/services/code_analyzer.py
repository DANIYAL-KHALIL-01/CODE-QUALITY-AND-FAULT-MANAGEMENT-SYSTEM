"""
Code Analysis Service
Calculates code complexity metrics using Radon and Lizard
"""

import os
import re
import subprocess
from radon.complexity import cc_visit
from radon.metrics import mi_visit, h_visit
from radon.raw import analyze
import lizard


class CodeAnalyzer:
    """Service for analyzing code complexity and quality"""
    
    def __init__(self):
        self.supported_extensions = [
            '.py', '.java', '.js', '.jsx', '.ts', '.tsx', 
            '.cpp', '.c', '.cs', '.html', '.css', '.php', 
            '.rb', '.go', '.swift', '.kt', '.vue', '.scss',
            '.sass', '.less', '.xml', '.txt'
        ]
        self.churn_cache = {}
    
    def analyze_repository(self, repo_path, include_all_dirs=False):
        """Analyze all code files in repository (optimized)"""
        results = {}
        files_to_analyze = []
        
        print(f"[CodeAnalyzer] Scanning repository: {repo_path}")
        
        # Extract commit churn data once for the entire repo (with limit for speed)
        print(f"[CodeAnalyzer] Extracting commit churn data (last 1000 commits)...")
        self.churn_cache = self._extract_churn_data(repo_path)
        
        # First pass: collect all code files to analyze
        for root, dirs, files in os.walk(repo_path):
            # Skip only .git when include_all_dirs=True, otherwise use standard exclusions
            if include_all_dirs:
                skip_dirs = {'.git'}
            else:
                skip_dirs = {'README.md',
                    '.git', 'node_modules', '__pycache__', 'venv', '.venv',
                    'build', 'dist', '.next', 'vendor', 'target',
                    'bin', 'obj', 'out', 'coverage', '.pytest_cache', '.tox',
                    '.idea', '.vscode', '.egg-info', 'htmlcov', 'site-packages',
                    'lib64', 'share', 'eggs', '.gradle', '.maven','package.json','package-lock.json', 'yarn.lock'
                }

            dirs[:] = [d for d in dirs if d.lower() not in {s.lower() for s in skip_dirs}]
            
            for file in files:
                # Skip large binary/compiled files immediately
                if file.endswith(('.json', '.pyc', '.o', '.so', '.dylib', '.dll', '.exe', '.class', '.jar', '.war', '.zip', '.tar', '.gz')):
                    continue
                
                file_path = os.path.join(root, file)
                ext = os.path.splitext(file)[1].lower()
                
                # Also analyze files without extensions if they look like code
                if not ext and file.lower() in ['readme', 'makefile', 'dockerfile', 'license']:
                    ext = '.txt'
                
                if ext in self.supported_extensions:
                    files_to_analyze.append(file_path)
        
        print(f"[CodeAnalyzer] Found {len(files_to_analyze)} files to analyze")
        
        # Second pass: analyze files (prioritize important files)
        # Analyze smaller files first for faster initial results
        files_to_analyze.sort(key=lambda x: os.path.getsize(x))
        
        for file_path in files_to_analyze:
            try:
                relative_path = os.path.relpath(file_path, repo_path).replace(os.sep, '/')
                metrics = self.analyze_file(file_path, relative_path)
                if metrics:  # Only add if metrics were successfully calculated
                    results[relative_path] = metrics
                    print(f"[CodeAnalyzer] ✓ {relative_path}: LOC={metrics['loc']}, Complexity={metrics['complexity']}")
                else:
                    print(f"[CodeAnalyzer] ✗ Skipped {relative_path} (too small or failed)")
            except Exception as e:
                print(f"[CodeAnalyzer] Warning: Failed to analyze {relative_path}: {str(e)}")
        
        print(f"[CodeAnalyzer] Analysis complete: {len(results)} files analyzed")
        return results
    
    def _extract_churn_data(self, repo_path):
        """Extract commit churn data using git log (optimized for performance)"""
        churn_data = {}
        try:
            # Limit to last 500 commits for performance on large repos
            # This captures recent churn patterns without scanning entire history
            result = subprocess.run(
                ['git', 'log', '--pretty=', '--numstat', '-500'],
                cwd=repo_path,
                capture_output=True,
                text=True,
                timeout=15  # Reduced timeout
            )
            
            if result.returncode == 0:
                line_count = 0
                for line in result.stdout.strip().split('\n'):
                    if line.strip():
                        parts = line.split('\t')
                        if len(parts) >= 3:
                            try:
                                added = int(parts[0]) if parts[0] != '-' else 0
                                removed = int(parts[1]) if parts[1] != '-' else 0
                                file_path = parts[2]
                                
                                if file_path not in churn_data:
                                    churn_data[file_path] = {'added': 0, 'removed': 0}
                                
                                churn_data[file_path]['added'] += added
                                churn_data[file_path]['removed'] += removed
                                line_count += 1
                            except (ValueError, IndexError):
                                continue
                
                print(f"[CodeAnalyzer] Extracted churn for {len(churn_data)} files ({line_count} changes)")
            else:
                print(f"[CodeAnalyzer] Warning: git log failed, proceeding without churn data")
        except subprocess.TimeoutExpired:
            print(f"[CodeAnalyzer] Warning: Git churn extraction timed out, proceeding without churn data")
        except Exception as e:
            print(f"[CodeAnalyzer] Warning: Failed to extract churn data: {str(e)}")
        
        return churn_data
    
    def analyze_file(self, file_path, relative_path=None):
        """Analyze a single code file"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                code = f.read()
            
            ext = os.path.splitext(file_path)[1].lower()
            
            # Get basic metrics
            loc = self._count_lines(code)
            
            # Skip empty or very small files (but be more lenient)
            if loc < 3:
                return None
            
            # Get complexity metrics based on file type
            if ext in ['.html', '.css', '.scss', '.sass', '.less']:
                complexity = self._analyze_html_css(code, ext)
            elif ext in ['.md', '.txt', '.json', '.xml']:
                # For documentation/config files, use simple metrics
                complexity = min(loc / 50, 10.0)  # Simple complexity based on size
            else:
                complexity = self._calculate_complexity(file_path, code)
            
            # Get maintainability index (only for supported languages)
            if ext == '.py':
                maintainability = self._calculate_maintainability(code)
            else:
                # Estimate maintainability based on LOC and complexity
                maintainability = max(0, 100 - (loc / 50) - (complexity * 2))
            
            # Get code churn from git history
            churn = 0
            if relative_path and relative_path in self.churn_cache:
                churn_info = self.churn_cache[relative_path]
                # Churn is total lines changed (added + removed)
                churn = churn_info['added'] + churn_info['removed']
            
            # Bug count will be updated from BugReport records after analysis
            bugs = 0
            
            return {
                'loc': loc,
                'complexity': round(complexity, 2),
                'maintainability': round(maintainability, 2),
                'churn': churn,
                'bugs': bugs
            }
        except Exception as e:
            print(f"[CodeAnalyzer] Error analyzing file {file_path}: {str(e)}")
            return None
    
    def _count_lines(self, code):
        """Count lines of code (excluding blank lines and comments)"""
        lines = code.split('\n')
        loc = 0
        
        in_multiline_comment = False
        
        for line in lines:
            stripped = line.strip()
            
            # Skip empty lines
            if not stripped:
                continue
            
            # Handle multi-line comments
            if '/*' in stripped:
                in_multiline_comment = True
            if '*/' in stripped:
                in_multiline_comment = False
                continue
            
            if in_multiline_comment:
                continue
            
            # Skip single-line comments
            if stripped.startswith(('#', '//', '<!--', '*', '//')):
                continue
            
            loc += 1
        
        return loc
    
    def _analyze_html_css(self, code, ext):
        """Analyze HTML/CSS files for complexity"""
        if ext == '.html':
            # Count HTML elements, nested structures, and scripts
            elements = len(re.findall(r'<[a-zA-Z][^>]*>', code))
            nested_divs = len(re.findall(r'<div[^>]*>.*?<div', code, re.DOTALL))
            scripts = len(re.findall(r'<script', code))
            forms = len(re.findall(r'<form', code))
            
            # Complexity based on structure
            complexity = (elements / 20) + (nested_divs / 5) + (scripts * 2) + (forms * 1.5)
            return max(1.0, min(complexity, 50.0))
        
        elif ext in ['.css', '.scss', '.sass', '.less']:
            # Count selectors, media queries, and nested rules
            selectors = len(re.findall(r'[^{}]+\{', code))
            media_queries = len(re.findall(r'@media', code))
            nested = len(re.findall(r'\{[^}]*\{', code))
            
            # Complexity based on CSS structure
            complexity = (selectors / 15) + (media_queries * 2) + (nested / 3)
            return max(1.0, min(complexity, 50.0))
        
        return 1.0
    
    def _calculate_complexity(self, file_path, code):
        """Calculate cyclomatic complexity"""
        try:
            ext = os.path.splitext(file_path)[1].lower()
            
            if ext == '.py':
                # Use Radon for Python
                complexity_list = cc_visit(code)
                if complexity_list:
                    total = sum(item.complexity for item in complexity_list)
                    return total / len(complexity_list)
            elif ext in ['.js', '.jsx', '.ts', '.tsx', '.java', '.c', '.cpp', '.cs', '.php', '.rb', '.go', '.swift', '.kt']:
                # Use Lizard for other languages
                try:
                    analysis = lizard.analyze_file.analyze_source_code(file_path, code)
                    if analysis.function_list:
                        total = sum(func.cyclomatic_complexity for func in analysis.function_list)
                        return total / len(analysis.function_list)
                except Exception as e:
                    print(f"[CodeAnalyzer] Lizard failed for {file_path}, using fallback: {str(e)}")
                    # Fallback: simple complexity based on control structures
                    control_keywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', 'try']
                    complexity = sum(code.lower().count(keyword) for keyword in control_keywords)
                    return max(1.0, min(complexity / 5, 20.0))
            
            return 1.0  # Default complexity
        except Exception as e:
            print(f"[CodeAnalyzer] Complexity calculation failed for {file_path}: {str(e)}")
            return 1.0
    
    def _calculate_maintainability(self, code):
        """Calculate maintainability index (0-100, higher is better)"""
        try:
            mi = mi_visit(code, multi=True)
            return mi if mi else 50.0
        except Exception:
            return 50.0  # Default maintainability
    
    def get_file_statistics(self, file_path):
        """Get detailed statistics for a file"""
        try:
            analysis = lizard.analyze_file(file_path)
            
            return {
                'nloc': analysis.nloc,
                'function_count': len(analysis.function_list),
                'token_count': analysis.token_count,
                'average_nloc': analysis.average_nloc,
                'average_complexity': analysis.average_cyclomatic_complexity,
                'max_complexity': max([f.cyclomatic_complexity for f in analysis.function_list]) if analysis.function_list else 0
            }
        except Exception as e:
            return None