"""
Prediction Module
Makes fault predictions using trained ML model
"""

import numpy as np
import joblib
import os
from typing import List, Dict, Any, Tuple
from .features import FeatureExtractor


class FaultPredictor:
    """Predict fault-prone modules using ML model"""
    
    def __init__(self, model_path: str = None):
        """
        Initialize predictor
        
        Args:
            model_path: Path to saved model file
        """
        self.feature_extractor = FeatureExtractor()
        self.model = None
        self.scaler = None
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
    
    def load_model(self, model_path: str) -> bool:
        """
        Load trained model from file
        
        Args:
            model_path: Path to model file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            model_data = joblib.load(model_path)
            
            if isinstance(model_data, dict):
                self.model = model_data.get('model')
                self.scaler = model_data.get('scaler')
            else:
                self.model = model_data
            
            return True
        except Exception as e:
            print(f"Failed to load model: {str(e)}")
            return False
    
    def predict(self, metrics: List[Any]) -> List[Dict[str, Any]]:
        """
        Predict fault probability for code metrics
        
        Args:
            metrics: List of CodeMetric objects
            
        Returns:
            List of predictions with file_path, probability, and risk_level
        """
        if not self.model:
            raise ValueError("Model not loaded. Train or load a model first.")
        
        # Extract features
        features = self.feature_extractor.extract_features(metrics)
        
        # Scale features if scaler is available
        if self.scaler:
            features = self.scaler.transform(features)
        
        # Make predictions
        probabilities = self.model.predict_proba(features)[:, 1]
        
        # Create prediction results
        predictions = []
        for i, metric in enumerate(metrics):
            prob = float(probabilities[i])
            predictions.append({
                'file_path': metric.file_path,
                'fault_probability': prob,
                'risk_level': self._get_risk_level(prob),
                'confidence_score': self._calculate_confidence(prob)
            })
        
        return predictions
    
    def predict_single(self, metric: Any) -> Dict[str, Any]:
        """
        Predict fault probability for a single metric
        
        Args:
            metric: Single CodeMetric object
            
        Returns:
            Prediction dictionary
        """
        predictions = self.predict([metric])
        return predictions[0] if predictions else None
    
    def predict_batch(self, features: np.ndarray) -> np.ndarray:
        """
        Predict fault probabilities for feature array
        
        Args:
            features: Feature array (n_samples, n_features)
            
        Returns:
            Array of fault probabilities
        """
        if not self.model:
            raise ValueError("Model not loaded")
        
        if self.scaler:
            features = self.scaler.transform(features)
        
        return self.model.predict_proba(features)[:, 1]
    
    def _get_risk_level(self, probability: float) -> str:
        """
        Convert probability to risk level
        
        Args:
            probability: Fault probability (0-1)
            
        Returns:
            Risk level string
        """
        if probability >= 0.75:
            return 'critical'
        elif probability >= 0.5:
            return 'high'
        elif probability >= 0.25:
            return 'medium'
        else:
            return 'low'
    
    def _calculate_confidence(self, probability: float) -> float:
        """
        Calculate confidence score for prediction
        
        Args:
            probability: Fault probability
            
        Returns:
            Confidence score (0-1)
        """
        # Confidence is higher when probability is closer to 0 or 1
        return abs(probability - 0.5) * 2
    
    def get_top_risky_modules(self, predictions: List[Dict[str, Any]], top_n: int = 10) -> List[Dict[str, Any]]:
        """
        Get top N most risky modules
        
        Args:
            predictions: List of prediction dictionaries
            top_n: Number of top modules to return
            
        Returns:
            List of top risky modules sorted by probability
        """
        sorted_predictions = sorted(
            predictions,
            key=lambda x: x['fault_probability'],
            reverse=True
        )
        
        return sorted_predictions[:top_n]
    
    def calculate_module_risk_distribution(self, predictions: List[Dict[str, Any]]) -> Dict[str, int]:
        """
        Calculate distribution of risk levels
        
        Args:
            predictions: List of prediction dictionaries
            
        Returns:
            Dictionary with counts for each risk level
        """
        distribution = {
            'low': 0,
            'medium': 0,
            'high': 0,
            'critical': 0
        }
        
        for pred in predictions:
            risk_level = pred.get('risk_level', 'low')
            distribution[risk_level] = distribution.get(risk_level, 0) + 1
        
        return distribution