"""
Database Models for Fault Prediction System
Using SQLAlchemy ORM with SQLite
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    password_hash = db.Column(db.String(500), nullable=False)
    full_name = db.Column(db.String(200))
    organization = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    settings = db.relationship('Settings', backref='user', lazy=True, uselist=False)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Verify password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'organization': self.organization,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }


class Repository(db.Model):
    """Repository model for storing GitHub repository information"""
    __tablename__ = 'repositories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    owner = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    language = db.Column(db.String(50))
    stars = db.Column(db.Integer, default=0)
    last_commit = db.Column(db.DateTime)
    analyzed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Relationships
    metrics = db.relationship('CodeMetric', backref='repository', lazy=True, cascade='all, delete-orphan')
    predictions = db.relationship('Prediction', backref='repository', lazy=True, cascade='all, delete-orphan')
    bugs = db.relationship('BugReport', backref='repository', lazy=True, cascade='all, delete-orphan')
    tests = db.relationship('TestCase', backref='repository', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'owner': self.owner,
            'url': self.url,
            'description': self.description,
            'language': self.language,
            'stars': self.stars,
            'last_commit': self.last_commit.isoformat() if self.last_commit else None,
            'analyzed': self.analyzed,
            'created_at': self.created_at.isoformat()
        }


class CodeMetric(db.Model):
    """Code metrics for each file in the repository"""
    __tablename__ = 'code_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    repository_id = db.Column(db.Integer, db.ForeignKey('repositories.id'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    lines_of_code = db.Column(db.Integer, default=0)
    cyclomatic_complexity = db.Column(db.Float, default=0.0)
    maintainability_index = db.Column(db.Float, default=0.0)
    code_churn = db.Column(db.Integer, default=0)
    bug_count = db.Column(db.Integer, default=0)
    last_modified = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'repository_id': self.repository_id,
            'file_path': self.file_path,
            'lines_of_code': self.lines_of_code,
            'cyclomatic_complexity': self.cyclomatic_complexity,
            'maintainability_index': self.maintainability_index,
            'code_churn': self.code_churn,
            'bug_count': self.bug_count,
            'last_modified': self.last_modified.isoformat() if self.last_modified else None,
            'created_at': self.created_at.isoformat()
        }


class Prediction(db.Model):
    """ML predictions for fault-prone modules"""
    __tablename__ = 'predictions'
    
    id = db.Column(db.Integer, primary_key=True)
    repository_id = db.Column(db.Integer, db.ForeignKey('repositories.id'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    fault_probability = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(20))  # low, medium, high, critical
    confidence_score = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'repository_id': self.repository_id,
            'file_path': self.file_path,
            'fault_probability': self.fault_probability,
            'risk_level': self.risk_level,
            'confidence_score': self.confidence_score,
            'created_at': self.created_at.isoformat()
        }


class BugReport(db.Model):
    """Historical bug reports"""
    __tablename__ = 'bug_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    repository_id = db.Column(db.Integer, db.ForeignKey('repositories.id'), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    severity = db.Column(db.String(20))  # low, medium, high, critical
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='open')  # open, in_progress, resolved
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'repository_id': self.repository_id,
            'file_path': self.file_path,
            'severity': self.severity,
            'description': self.description,
            'status': self.status,
            'reported_at': self.reported_at.isoformat(),
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None
        }


class TestCase(db.Model):
    """Test cases with prioritization"""
    __tablename__ = 'test_cases'
    
    id = db.Column(db.Integer, primary_key=True)
    repository_id = db.Column(db.Integer, db.ForeignKey('repositories.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(500))
    priority_score = db.Column(db.Float, default=0.0)
    execution_order = db.Column(db.Integer)
    execution_time = db.Column(db.Float)  # in seconds
    last_failure = db.Column(db.DateTime)
    failure_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'repository_id': self.repository_id,
            'name': self.name,
            'file_path': self.file_path,
            'priority_score': self.priority_score,
            'execution_order': self.execution_order,
            'execution_time': self.execution_time,
            'last_failure': self.last_failure.isoformat() if self.last_failure else None,
            'failure_count': self.failure_count,
            'created_at': self.created_at.isoformat()
        }


class Settings(db.Model):
    """Application settings per user"""
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    # Integration Settings
    github_token = db.Column(db.String(500))
    gitlab_token = db.Column(db.String(500))
    webhook_url = db.Column(db.String(500))
    
    # Notification Preferences
    email_notifications = db.Column(db.Boolean, default=False)
    high_risk_alerts = db.Column(db.Boolean, default=True)
    weekly_summary = db.Column(db.Boolean, default=True)
    slack_webhook = db.Column(db.String(500))
    
    # Analysis Configuration
    complexity_threshold = db.Column(db.Integer, default=30)
    churn_threshold = db.Column(db.Float, default=0.5)
    complexity_weight = db.Column(db.Float, default=0.4)
    bug_history_weight = db.Column(db.Float, default=0.3)
    
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'github_token': self.github_token,
            'gitlab_token': self.gitlab_token,
            'webhook_url': self.webhook_url,
            'email_notifications': self.email_notifications,
            'high_risk_alerts': self.high_risk_alerts,
            'weekly_summary': self.weekly_summary,
            'slack_webhook': self.slack_webhook,
            'complexity_threshold': self.complexity_threshold,
            'churn_threshold': self.churn_threshold,
            'complexity_weight': self.complexity_weight,
            'bug_history_weight': self.bug_history_weight,
            'updated_at': self.updated_at.isoformat()
        }