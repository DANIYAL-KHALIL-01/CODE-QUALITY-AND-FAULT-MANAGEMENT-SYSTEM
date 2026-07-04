"""
Backend Testing Script
Tests all backend functionality to identify issues
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, Repository, CodeMetric, Prediction
from services.github_service import GitHubService
from services.code_analyzer import CodeAnalyzer
from services.ml_service import MLService

def test_database():
    """Test database connection and tables"""
    print("\n=== Testing Database ===")
    with app.app_context():
        try:
            # Check if tables exist
            repos = Repository.query.all()
            print(f"✅ Database connected. Found {len(repos)} repositories")
            return True
        except Exception as e:
            print(f"❌ Database error: {str(e)}")
            return False

def test_github_service():
    """Test GitHub service"""
    print("\n=== Testing GitHub Service ===")
    try:
        github_service = GitHubService(os.getenv('GITHUB_TOKEN'))
        
        # Test with a public repo
        owner = "DANIYAL-KHALIL-01"
        name = "wad-assignment-1"
        
        print(f"Testing with {owner}/{name}...")
        
        # Test get_repository_info
        try:
            repo_info = github_service.get_repository_info(owner, name)
            print(f"✅ GitHub API working: {repo_info}")
        except Exception as e:
            print(f"⚠️ GitHub API failed (this is OK if no token): {str(e)}")
            print("   Continuing without GitHub API...")
        
        # Test clone_repository
        try:
            repo_path = github_service.clone_repository(owner, name)
            print(f"✅ Repository cloned to: {repo_path}")
            
            # Check if files exist
            if os.path.exists(repo_path):
                files = os.listdir(repo_path)
                print(f"   Found {len(files)} items in cloned repo")
                return True, repo_path
            else:
                print(f"❌ Clone path doesn't exist: {repo_path}")
                return False, None
        except Exception as e:
            print(f"❌ Clone failed: {str(e)}")
            return False, None
            
    except Exception as e:
        print(f"❌ GitHub service error: {str(e)}")
        return False, None

def test_code_analyzer(repo_path):
    """Test code analyzer"""
    print("\n=== Testing Code Analyzer ===")
    try:
        analyzer = CodeAnalyzer()
        
        print(f"Analyzing repository at: {repo_path}")
        results = analyzer.analyze_repository(repo_path)
        
        print(f"✅ Analysis complete. Found {len(results)} files")
        
        if results:
            # Show first few results
            for i, (file_path, metrics) in enumerate(list(results.items())[:3]):
                print(f"   File: {file_path}")
                print(f"   - LOC: {metrics['loc']}")
                print(f"   - Complexity: {metrics['complexity']}")
                print(f"   - Maintainability: {metrics['maintainability']}")
        else:
            print("⚠️ No files analyzed")
        
        return True, results
    except Exception as e:
        print(f"❌ Code analyzer error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False, None

def test_ml_service(metrics_data):
    """Test ML service"""
    print("\n=== Testing ML Service ===")
    try:
        ml_service = MLService()
        
        # Create mock CodeMetric objects
        with app.app_context():
            mock_metrics = []
            for file_path, metrics in list(metrics_data.items())[:5]:
                metric = CodeMetric(
                    repository_id=1,
                    file_path=file_path,
                    lines_of_code=metrics['loc'],
                    cyclomatic_complexity=metrics['complexity'],
                    maintainability_index=metrics['maintainability'],
                    code_churn=metrics['churn'],
                    bug_count=metrics['bugs']
                )
                mock_metrics.append(metric)
            
            predictions = ml_service.predict_faults(mock_metrics)
            print(f"✅ ML predictions generated for {len(predictions)} files")
            
            # Show first few predictions
            for file_path, prob in list(predictions.items())[:3]:
                risk = ml_service.get_risk_level(prob)
                print(f"   {file_path}: {prob:.2%} ({risk})")
            
            return True
    except Exception as e:
        print(f"❌ ML service error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def test_full_workflow():
    """Test complete workflow"""
    print("\n=== Testing Full Workflow ===")
    
    with app.app_context():
        try:
            # 1. Create a test repository
            print("\n1. Creating test repository...")
            repo = Repository(
                name="Hello-World",
                owner="octocat",
                url="https://github.com/octocat/Hello-World",
                description="Test repository",
                language="Unknown",
                stars=0
            )
            db.session.add(repo)
            db.session.commit()
            print(f"✅ Repository created with ID: {repo.id}")
            
            # 2. Clone and analyze
            print("\n2. Cloning repository...")
            github_service = GitHubService(os.getenv('GITHUB_TOKEN'))
            repo_path = github_service.clone_repository(repo.owner, repo.name)
            print(f"✅ Cloned to: {repo_path}")
            
            print("\n3. Analyzing code...")
            analyzer = CodeAnalyzer()
            results = analyzer.analyze_repository(repo_path)
            print(f"✅ Analyzed {len(results)} files")
            
            if not results:
                print("❌ No files found to analyze!")
                return False
            
            # 3. Store metrics
            print("\n4. Storing metrics...")
            for file_path, metrics in results.items():
                metric = CodeMetric(
                    repository_id=repo.id,
                    file_path=file_path,
                    lines_of_code=metrics['loc'],
                    cyclomatic_complexity=metrics['complexity'],
                    maintainability_index=metrics['maintainability'],
                    code_churn=metrics['churn'],
                    bug_count=metrics['bugs']
                )
                db.session.add(metric)
            
            repo.analyzed = True
            db.session.commit()
            print(f"✅ Stored {len(results)} metrics")
            
            # 4. Generate predictions
            print("\n5. Generating predictions...")
            ml_service = MLService()
            stored_metrics = CodeMetric.query.filter_by(repository_id=repo.id).all()
            predictions = ml_service.predict_faults(stored_metrics)
            
            for file_path, fault_prob in predictions.items():
                prediction = Prediction(
                    repository_id=repo.id,
                    file_path=file_path,
                    fault_probability=fault_prob,
                    risk_level=ml_service.get_risk_level(fault_prob)
                )
                db.session.add(prediction)
            
            db.session.commit()
            print(f"✅ Stored {len(predictions)} predictions")
            
            # 5. Verify data
            print("\n6. Verifying stored data...")
            metrics_count = CodeMetric.query.filter_by(repository_id=repo.id).count()
            predictions_count = Prediction.query.filter_by(repository_id=repo.id).count()
            
            print(f"✅ Database contains:")
            print(f"   - Repositories: {Repository.query.count()}")
            print(f"   - Metrics: {metrics_count}")
            print(f"   - Predictions: {predictions_count}")
            
            return True
            
        except Exception as e:
            print(f"❌ Workflow error: {str(e)}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

if __name__ == '__main__':
    print("=" * 60)
    print("BACKEND DIAGNOSTIC TEST")
    print("=" * 60)
    
    # Test 1: Database
    db_ok = test_database()
    
    # Test 2: GitHub Service
    github_ok, repo_path = test_github_service()
    
    # Test 3: Code Analyzer
    if github_ok and repo_path:
        analyzer_ok, metrics_data = test_code_analyzer(repo_path)
        
        # Test 4: ML Service
        if analyzer_ok and metrics_data:
            ml_ok = test_ml_service(metrics_data)
    
    # Test 5: Full Workflow
    print("\n" + "=" * 60)
    workflow_ok = test_full_workflow()
    
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Database: {'✅' if db_ok else '❌'}")
    print(f"GitHub Service: {'✅' if github_ok else '❌'}")
    print(f"Full Workflow: {'✅' if workflow_ok else '❌'}")
    print("=" * 60)