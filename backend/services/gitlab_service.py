"""GitLab integration service for repository and issue history."""

import os
import re
import stat
import shutil
import tempfile

import gitlab
from git import Repo

COMMIT_HISTORY_LIMIT = 100


class GitLabService:
    def __init__(self, token):
        self.token = token.strip() if isinstance(token, str) else ''
        self.client = gitlab.Gitlab('https://gitlab.com', private_token=self.token or None)
        self.temp_dir = tempfile.mkdtemp(prefix='fault_prediction_gitlab_')

    def _get_project(self, owner, name):
        return self.client.projects.get(f'{owner}/{name}')

    def get_repository_info(self, owner, name):
        project = self._get_project(owner, name)
        return {
            'description': project.description,
            'language': None,
            'stars': getattr(project, 'star_count', 0),
            'last_commit': None,
        }

    def clone_repository(self, owner, name, token=None, shallow=False):
        clone_token = token or self.token
        repository_url = f'https://gitlab.com/{owner}/{name}.git'
        url = (
            f'https://oauth2:{clone_token}@gitlab.com/{owner}/{name}.git'
            if clone_token
            else repository_url
        )
        repo_path = os.path.join(self.temp_dir, f'{owner}_{name}'.replace('/', '_'))
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path)
        clone_kwargs = {'depth': 1} if shallow else {}
        Repo.clone_from(url, repo_path, **clone_kwargs)
        return repo_path

    def get_commit_history(self, owner, name):
        project = self._get_project(owner, name)
        return [
            {
                'sha': commit.id,
                'message': commit.message,
                'author': commit.author_name,
                'date': commit.committed_date,
                'files_changed': 0,
            }
            for commit in project.commits.list(page=1, per_page=COMMIT_HISTORY_LIMIT, all=False)
        ]

    def get_bug_fixing_commits(self, owner, name):
        keywords = ('fix', 'bug', 'issue')
        return [
            commit for commit in self.get_commit_history(owner, name)
            if any(keyword in commit['message'].lower() for keyword in keywords)
        ]

    def get_bug_issues(self, owner, name):
        project = self._get_project(owner, name)
        issues = []
        for issue in project.issues.list(labels='bug', state='all', all=True):
            body = issue.description or ''
            labels = issue.labels or []
            files = re.findall(r'([a-zA-Z0-9_/\-]+\.(?:py|js|ts|java|cpp|c|cs|jsx|tsx))', body)
            issues.append({
                'number': issue.iid,
                'title': issue.title,
                'body': body,
                'labels': labels,
                'state': issue.state,
                'files_mentioned': files,
                'url': issue.web_url,
                'created_at': issue.created_at,
                'severity': 'critical' if 'critical' in labels else 'high' if 'high' in labels else 'medium',
            })
        return issues

    def get_file_content(self, owner, name, file_path, ref='main'):
        project = self._get_project(owner, name)
        file_data = project.files.get(file_path=file_path, ref=ref)
        return file_data.decode()

    def cleanup(self):
        if os.path.exists(self.temp_dir):
            def remove_readonly(func, path, _exc_info):
                os.chmod(path, stat.S_IWRITE)
                func(path)

            shutil.rmtree(self.temp_dir, onerror=remove_readonly)