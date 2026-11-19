import re
import math
from urllib.parse import urlparse
from datetime import datetime, timezone
from typing import List, Tuple
from app.schemas.url import AnalyzeURLResponse, URLIndicator, VerdictLevel

# Known URL shortener services that obscure final destination
KNOWN_SHORTENERS = {
    "bit.ly", "tinyurl.com", "is.gd", "t.co", "cutt.ly", "rebrand.ly",
    "ow.ly", "buff.ly", "shorte.st", "adf.ly", "rb.gy", "tiny.cc"
}

# High-risk / statistically abused Top-Level Domains commonly leveraged in ephemeral phishing campaigns
SUSPICIOUS_TLDS = {
    "top", "xyz", "club", "work", "buzz", "apk", "icu", "loan",
    "cam", "shop", "cfd", "sbs", "rest", "click", "live", "gq",
    "ml", "cf", "ga", "tk"
}

# High-value Indian brands frequently targeted in financial phishing
TARGETED_INDIAN_BRANDS = {
    "sbi": ["sbi.co.in", "onlinesbi.sbi", "sbi.bank"],
    "statebank": ["sbi.co.in", "onlinesbi.sbi"],
    "hdfc": ["hdfcbank.com"],
    "icici": ["icicibank.com"],
    "axis": ["axisbank.com"],
    "pnb": ["pnbindia.in"],
    "paytm": ["paytm.com"],
    "phonepe": ["phonepe.com"],
    "gpay": ["google.com", "pay.google.com"],
    "bhim": ["bhimupi.org.in"],
    "uidai": ["uidai.gov.in"],
    "aadhaar": ["uidai.gov.in"],
    "incometax": ["incometax.gov.in", "incometaxindia.gov.in"],
    "rbi": ["rbi.org.in"],
    "kbc": ["sonyliv.com"],
    "amazon": ["amazon.in", "amazon.com"],
    "flipkart": ["flipkart.com"],
    "jio": ["jio.com"],
    "airtel": ["airtel.in"],
}

# Suspicious security and credential-harvesting tokens in path or query
SUSPICIOUS_PATH_KEYWORDS = {
    "login", "signin", "verify", "kyc", "otp", "account",
    "update", "security", "banking", "pan", "aadhar", "claim",
    "bonus", "payout", "refund", "recharge"
}

# Regex to detect IP literal hosts (e.g. 192.168.1.1 or 103.21.244.2)
IP_LITERAL_REGEX = re.compile(r"^(\d{1,3}\.){3}\d{1,3}(:\d+)?$")

def calculate_shannon_entropy(s: str) -> float:
    """Calculates the Shannon entropy of a string to detect randomized DGA domains."""
    if not s:
        return 0.0
    probabilities = [s.count(c) / len(s) for c in set(s)]
    return -sum(p * math.log2(p) for p in probabilities)

def analyze_url_offline(raw_url: str) -> AnalyzeURLResponse:
    """
    Evaluates a submitted URL strictly offline using syntactic security heuristics.
    
    SECURITY GUARANTEE:
    This function NEVER executes DNS lookups, TCP handshakes, or HTTP requests.
    It protects backend infrastructure from Server-Side Request Forgery (SSRF)
    and accidental interaction with malicious infrastructure.
    """
    url_to_parse = raw_url.strip()
    # Normalize scheme if missing
    if not (url_to_parse.startswith("http://") or url_to_parse.startswith("https://")):
        url_to_parse = "http://" + url_to_parse

    parsed = urlparse(url_to_parse)
    netloc = parsed.netloc.lower()
    host = netloc.split(":")[0]  # strip port
    path = parsed.path.lower()
    query = parsed.query.lower()

    indicators: List[URLIndicator] = []
    penalty = 0

    # 1. URL Shortener Detection
    if host in KNOWN_SHORTENERS:
        penalty += 35
        indicators.append(URLIndicator(
            type="url_shortener",
            name="URL Shortening Service",
            description="The URL uses a redirect shortener that conceals the ultimate landing destination from the user.",
            severity="high",
            evidence=host
        ))

    # 2. IP Literal Host Detection
    if IP_LITERAL_REGEX.match(host):
        penalty += 45
        indicators.append(URLIndicator(
            type="ip_literal",
            name="Direct IP Address Host",
            description="Legitimate institutions use registered domain names. Direct IP addresses are frequently used in transient phishing kits to bypass domain reputation checks.",
            severity="critical",
            evidence=host
        ))

    # 3. Punycode / IDN Homograph Attack Detection
    if host.startswith("xn--") or ".xn--" in host:
        penalty += 40
        indicators.append(URLIndicator(
            type="punycode_homograph",
            name="Punycode / Homograph Domain",
            description="Uses internationalized encoding (xn--) which can visually mimic Latin brand characters with Cyrillic or Greek lookalikes.",
            severity="critical",
            evidence=host
        ))

    # 4. Suspicious / Abused TLD
    domain_parts = host.split(".")
    tld = domain_parts[-1] if len(domain_parts) > 1 else ""
    if tld in SUSPICIOUS_TLDS:
        penalty += 30
        indicators.append(URLIndicator(
            type="suspicious_tld",
            name=f"High-Risk Top-Level Domain (.{tld})",
            description=f"The top-level domain '.{tld}' has an elevated statistical correlation with disposable, low-cost phishing campaigns.",
            severity="high",
            evidence=f".{tld}"
        ))

    # 5. Excessive Subdomains
    if len(domain_parts) > 3 and not host.endswith(".gov.in") and not host.endswith(".co.in"):
        penalty += 25
        indicators.append(URLIndicator(
            type="excessive_subdomains",
            name="Excessive Subdomain Layering",
            description="Attackers frequently nest multiple subdomains (e.g. sbi.verify.kyc.portal.net) to fool users glancing at mobile address bars.",
            severity="medium",
            evidence=host
        ))

    # 6. Brand Impersonation & Lookalike Detection
    for brand, legit_domains in TARGETED_INDIAN_BRANDS.items():
        if brand in host:
            # Check if this host actually ends with any legitimate official domain
            is_legit = any(host == dom or host.endswith("." + dom) for dom in legit_domains)
            if not is_legit:
                penalty += 50
                indicators.append(URLIndicator(
                    type="brand_lookalike",
                    name=f"Brand Spoofing ({brand.upper()})",
                    description=f"The domain incorporates the brand name '{brand}' but is NOT owned by the official verified domain ({', '.join(legit_domains)}).",
                    severity="critical",
                    evidence=f"Brand '{brand}' found in non-authoritative host: '{host}'"
                ))
                break

    # 7. Suspicious Path & Query Keywords
    matched_path_tokens = [tok for tok in SUSPICIOUS_PATH_KEYWORDS if tok in path or tok in query]
    if matched_path_tokens:
        penalty += 15
        indicators.append(URLIndicator(
            type="suspicious_path_keywords",
            name="Sensitive Action Keywords in URL",
            description="The URL path contains credentials or verification triggers commonly found in phishing landing pages.",
            severity="medium",
            evidence=", ".join(matched_path_tokens)
        ))

    # 8. Unencrypted HTTP with Sensitive Keywords
    if parsed.scheme == "http" and (matched_path_tokens or penalty > 20):
        penalty += 15
        indicators.append(URLIndicator(
            type="protocol_warning",
            name="Unencrypted HTTP Connection",
            description="The URL uses unencrypted plain HTTP for sensitive verification or login actions, exposing traffic to interception.",
            severity="medium",
            evidence="http://"
        ))

    # 9. High Domain Entropy (DGA detection)
    main_domain_label = domain_parts[-2] if len(domain_parts) >= 2 else domain_parts[0]
    entropy = calculate_shannon_entropy(main_domain_label)
    if len(main_domain_label) >= 8 and entropy > 3.8:
        penalty += 20
        indicators.append(URLIndicator(
            type="high_entropy",
            name="High Domain Randomness (DGA Indicator)",
            description="The domain name exhibits high Shannon entropy, suggesting automated or algorithmic domain generation.",
            severity="medium",
            evidence=f"Entropy: {entropy:.2f} for '{main_domain_label}'"
        ))

    # Aggregated Score
    base_score = 5
    raw_score = base_score + penalty
    final_score = int(min(100, max(0, raw_score)))

    if final_score > 65:
        verdict = "Likely Phishing Link"
        verdict_level: VerdictLevel = "danger"
    elif final_score > 30:
        verdict = "Suspicious Link (Be Careful)"
        verdict_level: VerdictLevel = "warning"
    else:
        verdict = "Looks Calm"
        verdict_level: VerdictLevel = "calm"

    return AnalyzeURLResponse(
        url=raw_url,
        score=final_score,
        verdict=verdict,
        verdict_level=verdict_level,
        indicators=indicators,
        safe_inspection_note="This evaluation was executed strictly offline using syntactic security heuristics. The remote host was never contacted.",
        timestamp=datetime.now(timezone.utc).isoformat()
    )
