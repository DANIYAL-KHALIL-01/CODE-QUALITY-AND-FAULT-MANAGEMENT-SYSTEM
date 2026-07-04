"""
Main Flask Application for Fault Prediction Backend
Runs locally on port 5000
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from functools import wraps
import os
from datetime import datetime, timedelta

from services.github_service import GitHubService
from services.code_analyzer import CodeAnalyzer
from services.ml_service import MLService
from database.models import db, User, Repository, CodeMetric, Prediction, BugReport, TestCase, Settings

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
db_path = os.path.join(os.path.dirname(__file__), 'data', 'app.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Enable CORS for frontend connection
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://localhost:5174'])

# Initialize database
db.init_app(app)

# Initialize services
code_analyzer = CodeAnalyzer()
ml_service = MLService()

# Create tables if they don't exist
with app.app_context():
    db.create_all()


# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function


# Get current user's GitHub token
def get_user_github_token():
    """Get GitHub token from user's settings"""
    if 'user_id' not in session:
        return None
    
    settings = Settings.query.filter_by(user_id=session['user_id']).first()
    if settings and settings.github_token:
        return settings.github_token
    
    # Fallback to environment variable
    return os.getenv('GITHUB_TOKEN')


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Backend is running',
        'version': '1.0.0'
    })


# ==================== Authentication Endpoints ====================

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User registration"""
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        organization = data.get('organization', '')
        
        if not username or not email or not password:
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=username,
            email=email,
            full_name=full_name,
            organization=organization
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Create default settings for user
        settings = Settings(user_id=user.id)
        db.session.add(settings)
        db.session.commit()
        
        # Log user in
        session['user_id'] = user.id
        session.permanent = True
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create session
        session['user_id'] = user.id
        session.permanent = True
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """User logout"""
    session.clear()
    return jsonify({'message': 'Logout successful'})


@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user"""
    try:
        user = User.Session.get(session['user_id'])
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== Repository Endpoints ====================

@app.route('/api/repositories/connect', methods=['POST'])
@login_required
def connect_repository():
    """Connect a GitHub repository"""
    try:
        data = request.json
        repo_url = data.get('url')
        
        if not repo_url:
            return jsonify({'error': 'Repository URL is required'}), 400
        
        # Extract owner and repo name from URL
        parts = repo_url.rstrip('/').split('/')
        owner = parts[-2]
        name = parts[-1].replace('.git', '')
        
        # Check if repository already exists for this user
        existing = Repository.query.filter_by(owner=owner, name=name, user_id=session['user_id']).first()
        if existing:
            return jsonify({'error': 'Repository already connected'}), 400
        
        # Get GitHub token from user settings
        github_token = get_user_github_token()
        github_service = GitHubService(github_token)
        
        # Fetch repository info from GitHub
        repo_info = github_service.get_repository_info(owner, name)
        
        # Create repository record
        repository = Repository(
            name=name,
            owner=owner,
            url=repo_url,
            description=repo_info.get('description', ''),
            language=repo_info.get('language', 'Unknown'),
            stars=repo_info.get('stars', 0),
            last_commit=repo_info.get('last_commit'),
            user_id=session['user_id']
        )
        
        db.session.add(repository)
        db.session.commit()
        
        return jsonify({
            'message': 'Repository connected successfully',
            'repository': repository.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/repositories', methods=['GET'])
@login_required
def list_repositories():
    """List all connected repositories for current user"""
    try:
        repositories = Repository.query.filter_by(user_id=session['user_id']).all()
        return jsonify({
            'repositories': [repo.to_dict() for repo in repositories]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/repositories/<int:repo_id>', methods=['GET'])
@login_required
def get_repository(repo_id):
    """Get repository details"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        return jsonify(repository.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/repositories/<int:repo_id>', methods=['DELETE'])
@login_required
def delete_repository(repo_id):
    """Delete a repository"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        db.session.delete(repository)
        db.session.commit()
        return jsonify({'message': 'Repository deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== Code Analysis Endpoints ====================

@app.route('/api/analyze/<int:repo_id>', methods=['POST'])
@login_required
def analyze_repository(repo_id):
    """Analyze repository code and calculate metrics"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        # Get GitHub token from user settings
        github_token = get_user_github_token()
        github_service = GitHubService(github_token)
        
        # Clone repository locally
        repo_path = github_service.clone_repository(repository.owner, repository.name)
        
        # Analyze code
        analysis_results = code_analyzer.analyze_repository(repo_path)
        
        # Store metrics in database (batch insert for performance)
        metrics_list = []
        for file_path, metrics in analysis_results.items():
            code_metric = CodeMetric(
                repository_id=repo_id,
                file_path=file_path,
                lines_of_code=metrics['loc'],
                cyclomatic_complexity=metrics['complexity'],
                maintainability_index=metrics['maintainability'],
                code_churn=metrics['churn'],
                bug_count=metrics['bugs']
            )
            metrics_list.append(code_metric)
        
        # Batch insert all metrics at once
        if metrics_list:
            db.session.bulk_save_objects(metrics_list)
        
        repository.analyzed = True
        db.session.commit()
        
        return jsonify({
            'message': 'Analysis completed successfully',
            'files_analyzed': len(analysis_results)
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/metrics/<int:repo_id>', methods=['GET'])
@login_required
def get_metrics(repo_id):
    """Get code metrics for a repository"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        metrics = CodeMetric.query.filter_by(repository_id=repo_id).all()
        return jsonify({
            'metrics': [metric.to_dict() for metric in metrics]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== ML Prediction Endpoints ====================

@app.route('/api/predict/<int:repo_id>', methods=['POST'])
@login_required
def predict_faults(repo_id):
    """Predict fault-prone modules using ML"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        if not repository.analyzed:
            return jsonify({'error': 'Repository must be analyzed first'}), 400
        
        # Get code metrics
        metrics = CodeMetric.query.filter_by(repository_id=repo_id).all()
        
        # Get bug reports for this repository
        bug_reports = BugReport.query.filter_by(repository_id=repo_id).all()
        
        # Update bug counts in metrics based on bug reports
        bug_counts = {}
        for bug in bug_reports:
            if bug.file_path not in bug_counts:
                bug_counts[bug.file_path] = 0
            bug_counts[bug.file_path] += 1
        
        # Update CodeMetric with bug counts
        for metric in metrics:
            metric.bug_count = bug_counts.get(metric.file_path, 0)
        db.session.commit()
        
        # Make predictions (passing bug reports for accurate prediction)
        predictions = ml_service.predict_faults(metrics, bug_reports)
        
        # Clear existing predictions for this repository
        Prediction.query.filter_by(repository_id=repo_id).delete()
        
        # Store new predictions (batch insert)
        predictions_list = []
        for file_path, fault_prob in predictions.items():
            prediction = Prediction(
                repository_id=repo_id,
                file_path=file_path,
                fault_probability=fault_prob,
                risk_level=ml_service.get_risk_level(fault_prob)
            )
            predictions_list.append(prediction)
        
        # Batch insert all predictions
        if predictions_list:
            db.session.bulk_save_objects(predictions_list)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Predictions generated successfully',
            'predictions': len(predictions)
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/predictions/<int:repo_id>', methods=['GET'])
@login_required
def get_predictions(repo_id):
    """Get fault predictions for a repository"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        predictions = Prediction.query.filter_by(repository_id=repo_id).all()
        return jsonify({
            'predictions': [pred.to_dict() for pred in predictions]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== Test Prioritization Endpoints ====================

@app.route('/api/tests/prioritize', methods=['POST'])
@login_required
def prioritize_tests():
    """Prioritize test cases based on fault predictions"""
    try:
        data = request.json
        repo_id = data.get('repository_id')
        test_cases = data.get('test_cases', [])
        
        if not repo_id:
            return jsonify({'error': 'Repository ID is required'}), 400
        
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        # Get predictions
        predictions = Prediction.query.filter_by(repository_id=repo_id).all()
        
        # Prioritize tests
        prioritized = ml_service.prioritize_tests(test_cases, predictions)
        
        # Clear existing test cases for this repository
        TestCase.query.filter_by(repository_id=repo_id).delete()
        
        # Store test cases (batch insert)
        test_cases_list = []
        for idx, test in enumerate(prioritized):
            test_case = TestCase(
                repository_id=repo_id,
                name=test['name'],
                file_path=test['file_path'],
                priority_score=test['priority_score'],
                execution_order=idx + 1
            )
            test_cases_list.append(test_case)
        
        # Batch insert all test cases
        if test_cases_list:
            db.session.bulk_save_objects(test_cases_list)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Tests prioritized successfully',
            'prioritized_tests': prioritized
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/tests/<int:repo_id>', methods=['GET'])
@login_required
def get_prioritized_tests(repo_id):
    """Get prioritized test cases"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        tests = TestCase.query.filter_by(repository_id=repo_id).order_by(TestCase.execution_order).all()
        return jsonify({
            'tests': [test.to_dict() for test in tests]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ==================== Bug Report Endpoints ====================

@app.route('/api/bugs', methods=['POST'])
@login_required
def add_bug_report():
    """Add a bug report"""
    try:
        data = request.json
        repo_id = data.get('repository_id')
        
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        bug = BugReport(
            repository_id=repo_id,
            file_path=data.get('file_path'),
            severity=data.get('severity'),
            description=data.get('description'),
            status=data.get('status', 'open')
        )
        
        db.session.add(bug)
        db.session.commit()
        
        return jsonify({
            'message': 'Bug report added successfully',
            'bug': bug.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/bugs/<int:repo_id>', methods=['GET'])
@login_required
def get_bug_reports(repo_id):
    """Get bug reports for a repository"""
    try:
        repository = Repository.query.filter_by(id=repo_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Repository not found'}), 404
        
        bugs = BugReport.query.filter_by(repository_id=repo_id).all()
        return jsonify({
            'bugs': [bug.to_dict() for bug in bugs]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/bugs/<int:bug_id>', methods=['PATCH'])
@login_required
def update_bug_report(bug_id):
    """Update a bug report status"""
    try:
        data = request.json
        bug = BugReport.query.get_or_404(bug_id)
        
        # Verify user owns this bug's repository
        repository = Repository.query.filter_by(id=bug.repository_id, user_id=session['user_id']).first()
        if not repository:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if 'status' in data:
            bug.status = data['status']
        if 'severity' in data:
            bug.severity = data['severity']
        if 'description' in data:
            bug.description = data['description']
            
        db.session.commit()
        
        return jsonify({
            'message': 'Bug report updated successfully',
            'bug': bug.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== Settings Endpoints ====================

@app.route('/api/settings', methods=['GET'])
@login_required
def get_settings():
    """Get application settings for current user"""
    try:
        user = User.session.get(session['user_id'])
        settings = Settings.query.filter_by(user_id=session['user_id']).first()
        
        # Create default settings if none exist
        if not settings:
            settings = Settings(user_id=session['user_id'])
            db.session.add(settings)
            db.session.commit()
        
        # Include user profile data in settings
        settings_dict = settings.to_dict()
        settings_dict['full_name'] = user.full_name
        settings_dict['email'] = user.email
        settings_dict['organization'] = user.organization
        
        return jsonify({
            'settings': settings_dict
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/settings', methods=['PUT'])
@login_required
def update_settings():
    """Update application settings"""
    try:
        data = request.json
        user = User.session.get(session['user_id'])
        settings = Settings.query.filter_by(user_id=session['user_id']).first()
        
        # Create settings if they don't exist
        if not settings:
            settings = Settings(user_id=session['user_id'])
            db.session.add(settings)
        
        # Update integration settings
        if 'github_token' in data:
            settings.github_token = data['github_token']
        if 'gitlab_token' in data:
            settings.gitlab_token = data['gitlab_token']
        if 'webhook_url' in data:
            settings.webhook_url = data['webhook_url']
        
        # Update notification preferences
        if 'email_notifications' in data:
            settings.email_notifications = data['email_notifications']
        if 'high_risk_alerts' in data:
            settings.high_risk_alerts = data['high_risk_alerts']
        if 'weekly_summary' in data:
            settings.weekly_summary = data['weekly_summary']
        if 'slack_webhook' in data:
            settings.slack_webhook = data['slack_webhook']
        
        # Update analysis configuration
        if 'complexity_threshold' in data:
            settings.complexity_threshold = data['complexity_threshold']
        if 'churn_threshold' in data:
            settings.churn_threshold = data['churn_threshold']
        if 'complexity_weight' in data:
            settings.complexity_weight = data['complexity_weight']
        if 'bug_history_weight' in data:
            settings.bug_history_weight = data['bug_history_weight']
        
        # Update user profile
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'email' in data:
            user.email = data['email']
        if 'organization' in data:
            user.organization = data['organization']
        
        db.session.commit()
        
        # Return updated settings with user profile
        settings_dict = settings.to_dict()
        settings_dict['full_name'] = user.full_name
        settings_dict['email'] = user.email
        settings_dict['organization'] = user.organization
        
        return jsonify({
            'message': 'Settings updated successfully',
            'settings': settings_dict
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== Account Deletion ====================

@app.route('/api/auth/delete-account', methods=['DELETE'])
@login_required
def delete_account():
    """Delete user account and all associated data"""
    try:
        user_id = session['user_id']
        user = User.session.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Delete all user-related data
        # Delete repositories and their cascading data (metrics, predictions, bugs, tests)
        Repository.query.filter_by(user_id=user_id).delete()
        
        # Delete settings
        Settings.query.filter_by(user_id=user_id).delete()
        
        # Delete user
        db.session.delete(user)
        db.session.commit()
        
        # Clear session
        session.clear()
        
        return jsonify({
            'message': 'Account deleted successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Starting Fault Prediction Backend...")
    print("📍 Server running at: http://localhost:5000")
    print("📊 Frontend should connect to: http://localhost:5000/api")
    print("\n✅ Backend is ready!")
    app.run(debug=True, port=5000)