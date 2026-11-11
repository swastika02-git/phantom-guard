import os
import json
import unicodedata
import pandas as pd
from sklearn.model_selection import train_test_split

# Standard English baseline samples derived from public SMS benchmarks (UCI SMS Spam Collection subset)
BASELINE_ENGLISH_SPAM = [
    "WINNER!! As a valued network customer you have been selected to receive a £900 prize reward! To claim call 09061701461.",
    "URGENT! You have won a 1 week FREE membership in our £100,000 Prize Draw! Txt the word CLAIM to 81010.",
    "Six chances to win a CASH prize! From 100 to 20,000 pounds txt WAR to 86688.",
    "Had your mobile 11 months or more? Update to the latest camera phone for FREE! Call the Mobile Upgrade line on 08002986030.",
    "FreeMsg: You have been awarded 1000 free ringtones! Reply YES to activate now.",
    "Customer service alert: You have 1 unread message from your financial provider. View at http://mobile-alert.net",
    "URGENT: Your credit card payment is overdue. Settle immediately to avoid legal penalty.",
    "Congratulations! You are the winner of a brand new iPad. Click to confirm shipping address.",
    "Cash prize awaiting collection. Call 09050000301 before 5pm to receive confirmation code.",
    "Privileged customer: Claim your £500 Tesco gift voucher now by replying CLAIM.",
]

BASELINE_ENGLISH_HAM = [
    "Hey, are we still meeting up for dinner tonight at 7?",
    "Can you please send me the notes from today's lecture when you get a chance?",
    "I'll be there in about 15 minutes, caught in a little bit of traffic.",
    "Thanks for the help earlier today, really appreciate it!",
    "Did you remember to buy milk and bread from the grocery store?",
    "The doctor appointment has been rescheduled to Thursday afternoon.",
    "Please find attached the updated project report for your review.",
    "Happy birthday! Wishing you a fantastic year ahead filled with happiness.",
    "Let me know what time works best for the group call tomorrow.",
    "I finished reading that book you recommended, it was really insightful.",
]

def clean_text(text: str) -> str:
    """Normalizes Unicode, strips leading/trailing whitespace, collapses internal whitespace."""
    normalized = unicodedata.normalize("NFKC", text)
    cleaned = " ".join(normalized.split())
    return cleaned

def prepare_dataset():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, "..", "data")
    indian_dir = os.path.join(data_dir, "indian_context")
    processed_dir = os.path.join(data_dir, "processed")
    os.makedirs(processed_dir, exist_ok=True)

    # 1. Load curated Indian context files
    with open(os.path.join(indian_dir, "scam_samples.json"), "r", encoding="utf-8") as f:
        scam_data = json.load(f)

    with open(os.path.join(indian_dir, "legitimate_samples.json"), "r", encoding="utf-8") as f:
        legit_data = json.load(f)

    all_records = []
    for item in scam_data:
        all_records.append({
            "text": clean_text(item["text"]),
            "label": 1,
            "language": item.get("language", "hinglish")
        })

    for item in legit_data:
        all_records.append({
            "text": clean_text(item["text"]),
            "label": 0,
            "language": item.get("language", "hinglish")
        })

    # 2. Add English baseline benchmarks
    for text in BASELINE_ENGLISH_SPAM:
        all_records.append({
            "text": clean_text(text),
            "label": 1,
            "language": "en"
        })

    for text in BASELINE_ENGLISH_HAM:
        all_records.append({
            "text": clean_text(text),
            "label": 0,
            "language": "en"
        })

    df = pd.DataFrame(all_records)

    # 3. Strict Deduplication to prevent data leakage between train and test
    initial_count = len(df)
    df = df.drop_duplicates(subset=["text"]).reset_index(drop=True)
    dedup_count = len(df)

    print(f"Loaded {initial_count} records. After deduplication: {dedup_count} unique records.")
    print("Class breakdown:\n", df["label"].value_counts())
    print("Language breakdown:\n", df["language"].value_counts())

    # 4. Stratified 80/20 train/test split with fixed random seed
    train_df, test_df = train_test_split(
        df,
        test_size=0.20,
        random_state=42,
        stratify=df["label"]
    )

    train_path = os.path.join(processed_dir, "train.csv")
    test_path = os.path.join(processed_dir, "test.csv")

    train_df.to_csv(train_path, index=False, encoding="utf-8")
    test_df.to_csv(test_path, index=False, encoding="utf-8")

    print(f"Dataset prepared successfully!")
    print(f" - Train set: {len(train_df)} samples saved to {train_path}")
    print(f" - Test set:  {len(test_df)} samples saved to {test_path}")

if __name__ == "__main__":
    prepare_dataset()
