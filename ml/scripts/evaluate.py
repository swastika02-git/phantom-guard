import os
import json
import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def evaluate_per_language():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    processed_dir = os.path.join(current_dir, "..", "data", "processed")
    models_dir = os.path.join(current_dir, "..", "models")

    test_path = os.path.join(processed_dir, "test.csv")
    vec_path = os.path.join(models_dir, "vectorizer.joblib")
    clf_path = os.path.join(models_dir, "classifier.joblib")

    if not os.path.exists(test_path) or not os.path.exists(vec_path) or not os.path.exists(clf_path):
        raise FileNotFoundError("Trained model or test set not found. Run train.py first!")

    test_df = pd.read_csv(test_path)
    vectorizer = joblib.load(vec_path)
    classifier = joblib.load(clf_path)

    X_test_vec = vectorizer.transform(test_df["text"])
    test_df["pred"] = classifier.predict(X_test_vec)
    test_df["prob"] = classifier.predict_proba(X_test_vec)[:, 1]

    # Global Metrics
    global_acc = accuracy_score(test_df["label"], test_df["pred"])
    global_prec = precision_score(test_df["label"], test_df["pred"], zero_division=0)
    global_rec = recall_score(test_df["label"], test_df["pred"], zero_division=0)
    global_f1 = f1_score(test_df["label"], test_df["pred"], zero_division=0)
    global_cm = confusion_matrix(test_df["label"], test_df["pred"]).tolist()

    print("\n" + "=" * 65)
    print("PHANTOM GUARD HELD-OUT EVALUATION REPORT")
    print("=" * 65)
    print(f"Total Test Samples: {len(test_df)}")
    print(f"Overall Accuracy:   {global_acc:.4f} ({global_acc * 100:.1f}%)")
    print(f"Overall Precision:  {global_prec:.4f}")
    print(f"Overall Recall:     {global_rec:.4f}")
    print(f"Overall F1-Score:   {global_f1:.4f}")
    print(f"Overall Confusion Matrix [[TN, FP], [FN, TP]]: {global_cm}")

    # Per-Language Breakdown
    print("\n--- PER-LANGUAGE PERFORMANCE BREAKDOWN ---")
    per_language_results = {}

    for lang in ["en", "hi", "hinglish"]:
        sub_df = test_df[test_df["language"] == lang]
        if len(sub_df) == 0:
            continue

        l_acc = accuracy_score(sub_df["label"], sub_df["pred"])
        l_prec = precision_score(sub_df["label"], sub_df["pred"], zero_division=0)
        l_rec = recall_score(sub_df["label"], sub_df["pred"], zero_division=0)
        l_f1 = f1_score(sub_df["label"], sub_df["pred"], zero_division=0)
        l_cm = confusion_matrix(sub_df["label"], sub_df["pred"]).tolist()

        lang_label = {"en": "English", "hi": "Hindi (Devanagari)", "hinglish": "Hinglish (Romanized)"}[lang]
        print(f"\nLanguage: {lang_label} (N = {len(sub_df)})")
        print(f"  Accuracy:  {l_acc:.4f}")
        print(f"  Precision: {l_prec:.4f}")
        print(f"  Recall:    {l_rec:.4f}")
        print(f"  F1-Score:  {l_f1:.4f}")
        print(f"  Confusion Matrix: {l_cm}")

        per_language_results[lang] = {
            "samples": len(sub_df),
            "accuracy": float(round(l_acc, 4)),
            "precision": float(round(l_prec, 4)),
            "recall": float(round(l_rec, 4)),
            "f1_score": float(round(l_f1, 4)),
            "confusion_matrix": l_cm
        }

    # Save evaluation metrics to JSON
    report_path = os.path.join(models_dir, "evaluation_report.json")
    report_data = {
        "global": {
            "test_samples": len(test_df),
            "accuracy": float(round(global_acc, 4)),
            "precision": float(round(global_prec, 4)),
            "recall": float(round(global_rec, 4)),
            "f1_score": float(round(global_f1, 4)),
            "confusion_matrix": global_cm
        },
        "per_language": per_language_results
    }

    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)

    print(f"\nFull evaluation report saved to: {report_path}")
    return report_data

if __name__ == "__main__":
    evaluate_per_language()
