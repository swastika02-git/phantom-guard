import os
import json
import time
from datetime import datetime, timezone
import pandas as pd
import joblib
from sklearn.pipeline import FeatureUnion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def train_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    processed_dir = os.path.join(current_dir, "..", "data", "processed")
    models_dir = os.path.join(current_dir, "..", "models")
    os.makedirs(models_dir, exist_ok=True)

    train_path = os.path.join(processed_dir, "train.csv")
    test_path = os.path.join(processed_dir, "test.csv")

    if not os.path.exists(train_path) or not os.path.exists(test_path):
        raise FileNotFoundError("Processed train/test files not found. Run prepare_data.py first!")

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    X_train = train_df["text"]
    y_train = train_df["label"]
    X_test = test_df["text"]
    y_test = test_df["label"]

    print("=" * 60)
    print("PHANTOM GUARD ML TRAINING: N-Gram TF-IDF + Logistic Regression")
    print(f"Training samples: {len(X_train)} | Testing samples: {len(X_test)}")
    print("=" * 60)

    # 1. Feature Extraction: Dual Word & Character N-Gram TF-IDF
    # Word n-grams capture phrases ('guaranteed return', 'double ho jayega')
    # Char-wb n-grams capture phonetic Hinglish variations ('paisa', 'paise', 'paishe')
    vectorizer = FeatureUnion([
        ("word_tfidf", TfidfVectorizer(
            analyzer="word",
            ngram_range=(1, 2),
            sublinear_tf=True,
            lowercase=True
        )),
        ("char_tfidf", TfidfVectorizer(
            analyzer="char_wb",
            ngram_range=(3, 5),
            sublinear_tf=True,
            lowercase=True
        ))
    ])

    start_train_time = time.time()
    X_train_vec = vectorizer.fit_transform(X_train)
    fit_transform_time = time.time() - start_train_time

    total_features = X_train_vec.shape[1]
    print(f"Extracted {total_features} total n-gram features in {fit_transform_time:.3f}s.")

    # 2. Classifier: Regularized Logistic Regression
    classifier = LogisticRegression(
        C=1.0,
        max_iter=1000,
        random_state=42,
        solver="lbfgs"
    )

    classifier.fit(X_train_vec, y_train)
    train_duration = time.time() - start_train_time
    print(f"Model trained in {train_duration:.3f}s.")

    # 3. Model Evaluation on Held-Out Test Set
    X_test_vec = vectorizer.transform(X_test)
    y_pred = classifier.predict(X_test_vec)
    y_prob = classifier.predict_proba(X_test_vec)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    cm = confusion_matrix(y_test, y_pred).tolist()

    print("\n--- HELD-OUT TEST EVALUATION RESULTS ---")
    print(f"Accuracy:  {acc:.4f} ({acc * 100:.1f}%)")
    print(f"Precision: {prec:.4f}")
    print(f"Recall:    {rec:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print("Confusion Matrix [[TN, FP], [FN, TP]]:", cm)
    print("\nFull Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Legitimate (0)", "Scam (1)"]))

    # 4. Serialize Model Artifacts
    vec_path = os.path.join(models_dir, "vectorizer.joblib")
    clf_path = os.path.join(models_dir, "classifier.joblib")
    meta_path = os.path.join(models_dir, "model_metadata.json")

    joblib.dump(vectorizer, vec_path)
    joblib.dump(classifier, clf_path)

    metadata = {
        "model_version": "baseline-v1.0",
        "algorithm": "FeatureUnion(Word_TFIDF + Char_TFIDF) + LogisticRegression",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "train_samples": int(len(X_train)),
        "test_samples": int(len(X_test)),
        "num_features": int(total_features),
        "test_metrics": {
            "accuracy": float(round(acc, 4)),
            "precision": float(round(prec, 4)),
            "recall": float(round(rec, 4)),
            "f1_score": float(round(f1, 4)),
            "confusion_matrix": cm
        }
    }

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model saved to: {models_dir}")
    print(f" - Vectorizer: {vec_path}")
    print(f" - Classifier: {clf_path}")
    print(f" - Metadata:   {meta_path}")

if __name__ == "__main__":
    train_model()
