import os
import logging
from typing import Optional, List, Tuple
import joblib

logger = logging.getLogger("phantom_guard.ml")

class ScamMLClassifier:
    def __init__(self):
        self.vectorizer = None
        self.classifier = None
        self.is_loaded = False
        self._load_model()

    def _load_model(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        # Location in ml/models/ relative to backend/app/engine/ml
        models_dir = os.path.abspath(os.path.join(current_dir, "..", "..", "..", "..", "ml", "models"))
        vec_path = os.path.join(models_dir, "vectorizer.joblib")
        clf_path = os.path.join(models_dir, "classifier.joblib")

        if os.path.exists(vec_path) and os.path.exists(clf_path):
            try:
                self.vectorizer = joblib.load(vec_path)
                self.classifier = joblib.load(clf_path)
                self.is_loaded = True
                logger.info(f"Loaded ML model successfully from {models_dir}")
            except Exception as e:
                logger.error(f"Failed to load ML model artifacts: {e}")
                self.is_loaded = False
        else:
            logger.warning(f"ML model artifacts not found at {models_dir}. Running in rule-only mode.")
            self.is_loaded = False

    def predict_scam_probability(self, text: str) -> Optional[float]:
        """
        Returns the calibrated probability P(Scam | text) in [0.0, 1.0].
        Returns None if ML model artifacts are not loaded.
        """
        if not self.is_loaded or self.vectorizer is None or self.classifier is None:
            return None

        try:
            vec = self.vectorizer.transform([text])
            prob = self.classifier.predict_proba(vec)[0, 1]
            return float(prob)
        except Exception as e:
            logger.error(f"Error during ML inference: {e}")
            return None

# Singleton ML classifier instance
ml_classifier = ScamMLClassifier()
