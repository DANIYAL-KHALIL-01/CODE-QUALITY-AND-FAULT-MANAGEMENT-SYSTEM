"""
Model Training Module
Trains ML model for fault prediction
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import os
from typing import Tuple, Dict, Any
from .features import FeatureExtractor


class ModelTrainer:
    """Train and evaluate fault prediction models"""
    
    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        self.model = None
        self.scaler = StandardScaler()
        self.model_type = 'random_forest'
    
    def prepare_training_data(self, metrics: list, labels: list) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare training data from metrics and labels
        
        Args:
            metrics: List of CodeMetric objects
            labels: List of binary labels (0 or 1)
            
        Returns:
            Tuple of (features, labels)
        """
        features = self.feature_extractor.extract_features(metrics)
        labels = np.array(labels)
        
        return features, labels
    
    def generate_synthetic_data(self, n_samples: int = 1000) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generate synthetic training data for initial model
        
        Args:
            n_samples: Number of samples to generate
            
        Returns:
            Tuple of (features, labels)
        """
        np.random.seed(42)
        
        # Generate features with realistic distributions
        features = np.zeros((n_samples, 5))
        
        # LOC: 50-2000 lines
        features[:, 0] = np.random.lognormal(6, 1, n_samples)
        features[:, 0] = np.clip(features[:, 0], 50, 2000)
        
        # Complexity: 1-50
        features[:, 1] = np.random.gamma(2, 5, n_samples)
        features[:, 1] = np.clip(features[:, 1], 1, 50)
        
        # Maintainability: 0-100 (higher is better)
        features[:, 2] = np.random.beta(5, 2, n_samples) * 100
        
        # Churn: 0-100 commits
        features[:, 3] = np.random.exponential(10, n_samples)
        features[:, 3] = np.clip(features[:, 3], 0, 100)
        
        # Bugs: 0-20
        features[:, 4] = np.random.poisson(2, n_samples)
        features[:, 4] = np.clip(features[:, 4], 0, 20)
        
        # Generate labels based on heuristics
        # High complexity + low maintainability + high churn + bugs = faulty
        labels = np.zeros(n_samples)
        
        for i in range(n_samples):
            risk_score = (
                (features[i, 1] / 50) * 0.3 +           # Complexity
                (1 - features[i, 2] / 100) * 0.25 +     # Low maintainability
                (features[i, 3] / 100) * 0.25 +         # Churn
                (features[i, 4] / 20) * 0.2             # Bugs
            )
            
            # Add some randomness
            risk_score += np.random.normal(0, 0.1)
            
            # Label as faulty if risk score > threshold
            labels[i] = 1 if risk_score > 0.5 else 0
        
        return features, labels
    
    def train(self, X: np.ndarray, y: np.ndarray, model_type: str = 'random_forest') -> Dict[str, Any]:
        """
        Train the model
        
        Args:
            X: Feature matrix
            y: Labels
            model_type: Type of model ('random_forest' or 'gradient_boosting')
            
        Returns:
            Dictionary with training metrics
        """
        self.model_type = model_type
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Initialize model
        if model_type == 'random_forest':
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42,
                class_weight='balanced'
            )
        elif model_type == 'gradient_boosting':
            self.model = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                random_state=42
            )
        else:
            raise ValueError(f"Unknown model type: {model_type}")
        
        # Train model
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X_train_scaled, y_train, cv=5)
        
        # Predictions
        y_pred = self.model.predict(X_test_scaled)
        y_pred_proba = self.model.predict_proba(X_test_scaled)[:, 1]
        
        # Metrics
        metrics = {
            'train_accuracy': float(train_score),
            'test_accuracy': float(test_score),
            'cv_mean': float(cv_scores.mean()),
            'cv_std': float(cv_scores.std()),
            'roc_auc': float(roc_auc_score(y_test, y_pred_proba)),
            'classification_report': classification_report(y_test, y_pred),
            'confusion_matrix': confusion_matrix(y_test, y_pred).tolist(),
            'feature_importance': self.feature_extractor.get_feature_importance(self.model)
        }
        
        return metrics
    
    def save_model(self, model_path: str):
        """
        Save trained model to file
        
        Args:
            model_path: Path to save model
        """
        if not self.model:
            raise ValueError("No model to save. Train a model first.")
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        
        # Save model and scaler together
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'model_type': self.model_type,
            'feature_names': self.feature_extractor.feature_names
        }
        
        joblib.dump(model_data, model_path)
        print(f"✅ Model saved to {model_path}")
    
    def load_model(self, model_path: str):
        """
        Load trained model from file
        
        Args:
            model_path: Path to model file
        """
        model_data = joblib.load(model_path)
        
        if isinstance(model_data, dict):
            self.model = model_data.get('model')
            self.scaler = model_data.get('scaler')
            self.model_type = model_data.get('model_type', 'random_forest')
        else:
            self.model = model_data
        
        print(f"✅ Model loaded from {model_path}")


def train_default_model(save_path: str = None):
    """
    Train a default model with synthetic data
    
    Args:
        save_path: Path to save the trained model
    """
    print("🔄 Training default fault prediction model...")
    
    trainer = ModelTrainer()
    
    # Generate synthetic data
    X, y = trainer.generate_synthetic_data(n_samples=2000)
    
    # Train model
    metrics = trainer.train(X, y, model_type='random_forest')
    
    print("\n📊 Training Metrics:")
    print(f"  Train Accuracy: {metrics['train_accuracy']:.3f}")
    print(f"  Test Accuracy: {metrics['test_accuracy']:.3f}")
    print(f"  CV Mean: {metrics['cv_mean']:.3f} (±{metrics['cv_std']:.3f})")
    print(f"  ROC AUC: {metrics['roc_auc']:.3f}")
    
    print("\n📈 Feature Importance:")
    for feature, importance in metrics['feature_importance'].items():
        print(f"  {feature}: {importance:.3f}")
    
    # Save model
    if save_path:
        trainer.save_model(save_path)
    
    return trainer, metrics


if __name__ == '__main__':
    # Train and save default model
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    train_default_model(save_path=model_path)