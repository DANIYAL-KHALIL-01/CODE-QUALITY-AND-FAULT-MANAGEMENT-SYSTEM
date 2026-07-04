"""
Machine Learning Service
Handles fault prediction and test prioritization
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os


class MLService:
    """Service for ML-based fault prediction"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = os.path.join(os.path.dirname(__file__), '../ml/model.pkl')
        self.scaler_path = os.path.join(os.path.dirname(__file__), '../ml/scaler.pkl')
        self._load_or_train_model()
    
    def _load_or_train_model(self):
        """Load existing model or train a new one"""
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            try:
                self.model = joblib.load(self.model_path)
                self.scaler = joblib.load(self.scaler_path)
                print("✅ ML model and scaler loaded successfully")
            except Exception as e:
                print(f"⚠️ Failed to load model: {str(e)}")
                self._train_default_model()
        else:
            self._train_default_model()
    
    def _train_default_model(self):
        """Train a default model with synthetic data"""
        print("🔄 Training default ML model...")
        
        # Create synthetic training data
        # Features: [loc, complexity, maintainability, churn, bugs]
        # Label: is_faulty (0 or 1)
        
        np.random.seed(42)
        n_samples = 1000
        
        # Generate features
        X = np.random.rand(n_samples, 5)
        
        # Scale features to realistic ranges
        X[:, 0] = X[:, 0] * 1000  # LOC: 0-1000
        X[:, 1] = X[:, 1] * 20    # Complexity: 0-20
        X[:, 2] = X[:, 2] * 100   # Maintainability: 0-100
        X[:, 3] = X[:, 3] * 50    # Churn: 0-50
        X[:, 4] = X[:, 4] * 10    # Bugs: 0-10
        
        # Generate labels based on heuristics
        # High complexity + low maintainability + high churn = more likely faulty
        y = np.zeros(n_samples)
        for i in range(n_samples):
            score = (X[i, 1] / 20) + (1 - X[i, 2] / 100) + (X[i, 3] / 50) + (X[i, 4] / 10)
            y[i] = 1 if score > 1.5 else 0
        
        # Train scaler and model
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_scaled, y)
        
        # Save both model and scaler
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        
        print("✅ Default ML model and scaler trained and saved")
    
    def predict_faults(self, metrics, bug_reports=None):
        """Predict fault probability for code modules"""
        predictions = {}
        
        # Build bug lookup if provided
        bug_lookup = {}
        if bug_reports:
            for bug in bug_reports:
                if bug.file_path not in bug_lookup:
                    bug_lookup[bug.file_path] = 0
                bug_lookup[bug.file_path] += 1
        
        for metric in metrics:
            # Extract features
            bug_count = bug_lookup.get(metric.file_path, 0)
            
            features = np.array([[
                metric.lines_of_code,
                metric.cyclomatic_complexity,
                metric.maintainability_index,
                metric.code_churn,
                bug_count  # Use actual bug count instead of 0
            ]])
            
            # Scale features
            features_scaled = self.scaler.transform(features)
            
            # Predict probability
            prob = self.model.predict_proba(features_scaled)[0][1]
            
            predictions[metric.file_path] = float(prob)
        
        return predictions
    
    def get_risk_level(self, fault_probability):
        """Convert fault probability to risk level"""
        if fault_probability >= 0.75:
            return 'critical'
        elif fault_probability >= 0.5:
            return 'high'
        elif fault_probability >= 0.25:
            return 'medium'
        else:
            return 'low'
    
    def prioritize_tests(self, test_cases, predictions):
        """Prioritize test cases based on fault predictions"""
        # Create prediction lookup
        pred_dict = {pred.file_path: pred.fault_probability for pred in predictions}
        
        prioritized = []
        
        for test in test_cases:
            file_path = test.get('file_path', '')
            
            # Calculate priority score
            fault_prob = pred_dict.get(file_path, 0.5)
            execution_time = test.get('execution_time', 1.0)
            failure_count = test.get('failure_count', 0)
            
            # Priority formula: weighted combination of factors
            priority_score = (
                fault_prob * 0.5 +           # 50% weight on fault probability
                (failure_count / 10) * 0.3 + # 30% weight on historical failures
                (1 / execution_time) * 0.2   # 20% weight on execution speed
            )
            
            prioritized.append({
                'name': test.get('name'),
                'file_path': file_path,
                'priority_score': float(priority_score),
                'fault_probability': float(fault_prob),
                'execution_time': execution_time
            })
        
        # Sort by priority score (descending)
        prioritized.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return prioritized
    
    def retrain_model(self, training_data):
        """Retrain model with new data"""
        try:
            X = np.array([d['features'] for d in training_data])
            y = np.array([d['label'] for d in training_data])
            
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            
            joblib.dump(self.model, self.model_path)
            joblib.dump(self.scaler, self.scaler_path)
            
            return True
        except Exception as e:
            print(f"Failed to retrain model: {str(e)}")
            return False