"""
Feature Extraction Module
Extracts features from code metrics for ML model training
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any


class FeatureExtractor:
    """Extract and prepare features for ML model"""
    
    def __init__(self):
        self.feature_names = [
            'lines_of_code',
            'cyclomatic_complexity',
            'maintainability_index',
            'code_churn',
            'bug_count'
        ]
    
    def extract_features(self, metrics: List[Any]) -> np.ndarray:
        """
        Extract features from code metrics
        
        Args:
            metrics: List of CodeMetric objects
            
        Returns:
            numpy array of shape (n_samples, n_features)
        """
        features = []
        
        for metric in metrics:
            feature_vector = [
                metric.lines_of_code,
                metric.cyclomatic_complexity,
                metric.maintainability_index,
                metric.code_churn,
                metric.bug_count
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def extract_features_dict(self, metrics: List[Dict[str, Any]]) -> np.ndarray:
        """
        Extract features from dictionary format
        
        Args:
            metrics: List of metric dictionaries
            
        Returns:
            numpy array of shape (n_samples, n_features)
        """
        features = []
        
        for metric in metrics:
            feature_vector = [
                metric.get('loc', 0),
                metric.get('complexity', 0),
                metric.get('maintainability', 50),
                metric.get('churn', 0),
                metric.get('bugs', 0)
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def create_dataframe(self, metrics: List[Any]) -> pd.DataFrame:
        """
        Create pandas DataFrame from metrics
        
        Args:
            metrics: List of CodeMetric objects
            
        Returns:
            pandas DataFrame with features
        """
        features = self.extract_features(metrics)
        df = pd.DataFrame(features, columns=self.feature_names)
        
        # Add file paths if available
        if hasattr(metrics[0], 'file_path'):
            df['file_path'] = [m.file_path for m in metrics]
        
        return df
    
    def normalize_features(self, features: np.ndarray) -> np.ndarray:
        """
        Normalize features to 0-1 range
        
        Args:
            features: Raw feature array
            
        Returns:
            Normalized feature array
        """
        # Avoid division by zero
        feature_max = np.max(features, axis=0)
        feature_max[feature_max == 0] = 1
        
        return features / feature_max
    
    def calculate_risk_score(self, features: np.ndarray) -> np.ndarray:
        """
        Calculate simple risk score based on features
        
        Args:
            features: Feature array
            
        Returns:
            Risk scores for each sample
        """
        # Normalize features
        normalized = self.normalize_features(features)
        
        # Weighted sum (higher complexity, churn, bugs = higher risk)
        # Lower maintainability = higher risk
        weights = np.array([0.15, 0.30, -0.20, 0.25, 0.30])
        
        risk_scores = np.dot(normalized, weights)
        
        # Normalize to 0-1 range
        risk_scores = (risk_scores - risk_scores.min()) / (risk_scores.max() - risk_scores.min() + 1e-10)
        
        return risk_scores
    
    def get_feature_importance(self, model) -> Dict[str, float]:
        """
        Get feature importance from trained model
        
        Args:
            model: Trained sklearn model with feature_importances_
            
        Returns:
            Dictionary mapping feature names to importance scores
        """
        if not hasattr(model, 'feature_importances_'):
            return {}
        
        importances = model.feature_importances_
        return dict(zip(self.feature_names, importances))