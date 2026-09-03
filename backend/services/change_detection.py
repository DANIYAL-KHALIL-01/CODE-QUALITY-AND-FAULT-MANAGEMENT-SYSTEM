"""
Change Detection Service
Compares Git commits to identify changed, added, and deleted files
"""

import os
import subprocess
from typing import List, Dict, Any, Tuple


class ChangeDetection:
    """Service for detecting changes between Git commits"""
    
    def __init__(self):
        pass
    
    def get_current_commit(self, repo_path: str) -> str:
        """Get the current HEAD commit SHA"""
        try:
            result = subprocess.run(
                ['git', 'rev-parse', 'HEAD'],
                cwd=repo_path,
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except Exception as e:
            print(f"[ChangeDetection] Warning: Failed to get current commit: {str(e)}")
        
        return None
    
    def get_changed_files(self, repo_path: str, previous_commit: str = None) -> Dict[str, List[str]]:
        """
        Get files that changed between commits.
        Returns: {'added': [...], 'modified': [...], 'deleted': [...]}
        """
        result = {
            'added': [],
            'modified': [],
            'deleted': []
        }
        
        if not previous_commit:
            # First analysis - all files are "new"
            return result
        
        try:
            current_commit = self.get_current_commit(repo_path)
            if not current_commit:
                return result
            
            # Get diff between commits
            diff_result = subprocess.run(
                ['git', 'diff', '--name-status', previous_commit, current_commit],
                cwd=repo_path,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if diff_result.returncode == 0:
                for line in diff_result.stdout.strip().split('\n'):
                    if not line.strip():
                        continue
                    
                    parts = line.split('\t')
                    status = parts[0]
                    file_path = parts[1].replace(os.sep, '/')
                    
                    if status == 'A':  # Added
                        result['added'].append(file_path)
                    elif status == 'M':  # Modified
                        result['modified'].append(file_path)
                    elif status == 'D':  # Deleted
                        result['deleted'].append(file_path)
                    elif status == 'R':  # Renamed
                        # R100  old_name  new_name
                        if len(parts) >= 3:
                            result['added'].append(parts[2].replace(os.sep, '/'))
                            result['deleted'].append(parts[1].replace(os.sep, '/'))
                    elif status == 'T':  # Type changed
                        result['modified'].append(file_path)
        
        except subprocess.TimeoutExpired:
            print(f"[ChangeDetection] Warning: Git diff timed out")
        except Exception as e:
            print(f"[ChangeDetection] Warning: Failed to get changed files: {str(e)}")
        
        return result
    
    def get_changed_modules(self, repo_path: str, previous_commit: str = None) -> List[str]:
        """Get list of changed source files"""
        changes = self.get_changed_files(repo_path, previous_commit)
        changed = []
        
        # Source file extensions
        source_exts = {'.py', '.js', '.ts', '.tsx', '.jsx', '.java', '.cpp', '.c', '.cs'}
        
        for file_list in [changes['added'], changes['modified']]:
            for file_path in file_list:
                _, ext = os.path.splitext(file_path)
                if ext.lower() in source_exts:
                    changed.append(file_path)
        
        return changed
