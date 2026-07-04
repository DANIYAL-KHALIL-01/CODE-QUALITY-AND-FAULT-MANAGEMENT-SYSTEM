"""
Test with a real repository that has code files
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import app, db, Repository, CodeMetric, Prediction
from services.github_service import GitHubService
from services.code_analyzer import CodeAnalyzer
from services.ml_service import MLService

def test_with_real_repo():
    """Test with a repository that has actual code"""
    
    # Use a small but real repository with code
    test_repos = [
        ("torvalds", "linux"),  # Too large, skip
        ("facebook", "react"),  # Popular, has code
        ("twbs", "bootstrap"),  # HTML/CSS/JS
        ("django", "django"),   # Python
    ]
    
    # Let's use a smaller repo for testing
    owner = "DANIYAL-KHALIL-01"
    name = "wad-assignment-2"  # A fork-friendly repo
    
    print(f"\n{'='*60}")
    print(f"Testing with {owner}/{name}")
    print(f"{'='*60}\n")
    
    with app.app_context():
        try:
            # Clean up existing test data
            Repository.query.filter_by(owner=owner, name=name).delete()
            db.session.commit()
            
            # 1. Create repository
            print("1. Creating repository record...")
            repo = Repository(
                name=name,
                owner=owner,
                url=f"https://github.com/{owner}/{name}",
                description="Test repository",
                language="Unknown",
                stars=0
            )
            db.session.add(repo)
            db.session.commit()
            print(f"✅ Repository created with ID: {repo.id}")
            
            # 2. Clone repository
            print("\n2. Cloning repository...")
            github_service = GitHubService(os.getenv('GITHUB_TOKEN'))
            repo_path = github_service.clone_repository(owner, name)
            print(f"✅ Cloned to: {repo_path}")
            
            # List files in the repo
            print("\n3. Files in repository:")
            for root, dirs, files in os.walk(repo_path):
                level = root.replace(repo_path, '').count(os.sep)
                indent = ' ' * 2 * level
                print(f"{indent}{os.path.basename(root)}/")
                subindent = ' ' * 2 * (level + 1)
                for file in files[:10]:  # Show first 10 files
                    print(f"{subindent}{file}")
                if len(files) > 10:
                    print(f"{subindent}... and {len(files) - 10} more files")
                break  # Only show top level
            
            # 4. Analyze code
            print("\n4. Analyzing code...")
            analyzer = CodeAnalyzer()
            results = analyzer.analyze_repository(repo_path)
            print(f"\n✅ Analysis complete. Found {len(results)} analyzable files")
            
            if not results:
                print("❌ No files found to analyze!")
                return False
            
            # Show sample results
            print("\nSample analysis results:")
            for i, (file_path, metrics) in enumerate(list(results.items())[:5]):
                print(f"\n  File: {file_path}")
                print(f"    LOC: {metrics['loc']}")
                print(f"    Complexity: {metrics['complexity']}")
                print(f"    Maintainability: {metrics['maintainability']}")
            
            # 5. Store metrics
            print(f"\n5. Storing {len(results)} metrics in database...")
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
            print("✅ Metrics stored successfully")
            
            # 6. Generate predictions
            print("\n6. Generating ML predictions...")
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
            print(f"✅ Generated {len(predictions)} predictions")
            
            # Show sample predictions
            print("\nSample predictions:")
            sorted_predictions = sorted(predictions.items(), key=lambda x: x[1], reverse=True)
            for file_path, prob in sorted_predictions[:5]:
                risk = ml_service.get_risk_level(prob)
                print(f"  {file_path}: {prob:.2%} ({risk})")
            
            # 7. Verify database
            print("\n7. Verifying database contents...")
            total_repos = Repository.query.count()
            total_metrics = CodeMetric.query.count()
            total_predictions = Prediction.query.count()
            
            print(f"✅ Database contains:")
            print(f"   - Repositories: {total_repos}")
            print(f"   - Metrics: {total_metrics}")
            print(f"   - Predictions: {total_predictions}")
            
            print(f"\n{'='*60}")
            print("✅ FULL WORKFLOW SUCCESSFUL!")
            print(f"{'='*60}")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            return False

if __name__ == '__main__':
    success = test_with_real_repo()
    sys.exit(0 if success else 1)