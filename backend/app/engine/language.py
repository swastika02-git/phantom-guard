import re
from typing import Literal

LanguageType = Literal["en", "hi", "hinglish"]

# Comprehensive phonetic keywords commonly observed in Indian Romanized text
HINGLISH_KEYWORDS = {
    "aapka", "apka", "aap", "hum", "tum", "mera", "meri", "karo", "karein",
    "kijiye", "hone", "wala", "wali", "wale", "hai", "hain", "tha", "thi",
    "the", "paisa", "paise", "paishe", "pesa", "turant", "jaldi", "khata",
    "band", "block", "rok", "dhoka", "bhejo", "bhejiye", "bhej", "inaam",
    "muft", "laabh", "kamao", "kamaein", "kamaye", "rozana", "daily",
    "bhai", "janaab", "sahab", "crore", "lakh", "hazar", "rupaya", "rupaye",
    "dekh", "dekho", "kholo", "link", "gpay", "phonepe", "paytm"
}

# Devanagari Unicode Range: U+0900 to U+097F
DEVANAGARI_REGEX = re.compile(r'[\u0900-\u097F]')

def identify_language(text: str) -> LanguageType:
    """
    Identifies if the input text is primarily Devanagari Hindi, Romanized Hinglish, or English.
    
    1. Checks for significant presence of Devanagari script characters.
    2. Tokenizes Roman characters and calculates Hinglish keyword density.
    3. Defaults to standard English.
    """
    if not text or not text.strip():
        return "en"

    # Count Devanagari characters
    devanagari_chars = len(DEVANAGARI_REGEX.findall(text))
    total_alpha_chars = len(re.findall(r'[a-zA-Z\u0900-\u097F]', text))

    if total_alpha_chars > 0 and (devanagari_chars / total_alpha_chars) >= 0.25:
        return "hi"

    # Tokenize words for Hinglish detection
    words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
    if not words:
        return "en"

    hinglish_matches = sum(1 for w in words if w in HINGLISH_KEYWORDS)
    # If 2 or more distinct Hinglish keywords or >= 12% keyword density, tag as Hinglish
    if hinglish_matches >= 2 or (len(words) >= 3 and (hinglish_matches / len(words)) >= 0.12):
        return "hinglish"

    return "en"
