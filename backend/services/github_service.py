"""
GitHub Integration Service
Handles repository connection, cloning, and data extraction
"""

import os
import tempfile
import shutil
from datetime import datetime
from github import Github, GithubException
from git import Repo


class GitHubService:
    """Service for GitHub API interactions"""
    
    def __init__(self, token=None):
        """Initialize GitHub service with optional token"""
        self.token = token
        self.github = Github(token) if token else Github()
        self.temp_dir = tempfile.mkdtemp(prefix='fault_prediction_')
    
    def get_repository_info(self, owner, name):
        """Get repository information from GitHub"""
        try:
            repo = self.github.get_repo(f"{owner}/{name}")
            
            # Get last commit date
            commits = repo.get_commits()
            last_commit = commits[0].commit.author.date if commits.totalCount > 0 else None
            
            return {
                'description': repo.description,
                'language': repo.language,
                'stars': repo.stargazers_count,
                'last_commit': last_commit
            }
        except GithubException as e:
            raise Exception(f"Failed to fetch repository info: {str(e)}")
    
    def clone_repository(self, owner, name):
        """Clone repository to local temporary directory"""
        try:
            repo_url = f"https://github.com/{owner}/{name}.git"
            repo_path = os.path.join(self.temp_dir, f"{owner}_{name}")
            
            # Remove if already exists
            if os.path.exists(repo_path):
                shutil.rmtree(repo_path)
            
            # Clone repository
            Repo.clone_from(repo_url, repo_path)
            
            return repo_path
        except Exception as e:
            raise Exception(f"Failed to clone repository: {str(e)}")
    
    def get_commit_history(self, owner, name, file_path=None):
        """Get commit history for repository or specific file"""
        try:
            repo = self.github.get_repo(f"{owner}/{name}")
            
            if file_path:
                commits = repo.get_commits(path=file_path)
            else:
                commits = repo.get_commits()
            
            history = []
            for commit in commits:
                history.append({
                    'sha': commit.sha,
                    'message': commit.commit.message,
                    'author': commit.commit.author.name,
                    'date': commit.commit.author.date,
                    'files_changed': len(commit.files) if commit.files else 0
                })
            
            return history
        except GithubException as e:
            raise Exception(f"Failed to fetch commit history: {str(e)}")
    
    def get_file_changes(self, owner, name, file_path):
        """Get number of changes (commits) for a specific file"""
        try:
            commits = self.get_commit_history(owner, name, file_path)
            return len(commits)
        except Exception:
            return 0
    
    def get_bug_fixing_commits(self, owner, name):
        """Identify bug-fixing commits based on commit messages"""
        try:
            repo = self.github.get_repo(f"{owner}/{name}")
            commits = repo.get_commits()
            
            bug_keywords = ['fix', 'bug', 'issue', 'error', 'patch', 'resolve']
            bug_commits = []
            
            for commit in commits:
                message = commit.commit.message.lower()
                if any(keyword in message for keyword in bug_keywords):
                    bug_commits.append({
                        'sha': commit.sha,
                        'message': commit.commit.message,
                        'date': commit.commit.author.date,
                        'files': [f.filename for f in commit.files] if commit.files else []
                    })
            
            return bug_commits
        except GithubException as e:
            raise Exception(f"Failed to fetch bug-fixing commits: {str(e)}")
    
    def cleanup(self):
        """Clean up temporary directory"""
        try:
            if os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
        except Exception as e:
            print(f"Warning: Failed to cleanup temp directory: {str(e)}")