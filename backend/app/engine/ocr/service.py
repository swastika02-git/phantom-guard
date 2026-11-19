import io
import shutil
import logging
from datetime import datetime, timezone
from typing import Tuple, Optional
from PIL import Image
import pytesseract
from app.schemas.ocr import AnalyzeImageResponse, OCRStatus
from app.engine.language import identify_language
from app.engine.rules.evaluator import default_rule_evaluator
from app.engine.aggregator import aggregate_risk_assessment
from app.engine.ml.classifier import ml_classifier

logger = logging.getLogger("phantom_guard.ocr")

ALLOWED_MIME_TYPES = {"image/png", "image/jpeg", "image/jpg", "image/webp"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024  # 5 MB
MAX_PIXEL_DIMENSION = 5000  # Protection against decompression bombs

def is_tesseract_installed() -> bool:
    """Checks if the native Tesseract binary is available in the operating system PATH."""
    try:
        if shutil.which("tesseract") is not None:
            return True
        # Try asking pytesseract
        pytesseract.get_tesseract_version()
        return True
    except Exception:
        return False

def process_screenshot_in_memory(
    image_bytes: bytes,
    content_type: Optional[str] = None
) -> AnalyzeImageResponse:
    """
    Safely processes an uploaded screenshot strictly in memory.
    
    SECURITY GUARANTEES:
    1. Size restricted to 5MB.
    2. Validates image headers using Pillow Image.verify().
    3. Rejects decompression bombs.
    4. Image buffers are discarded immediately after in-memory processing.
    5. Zero disk persistence.
    """
    now_iso = datetime.now(timezone.utc).isoformat()
    tesseract_available = is_tesseract_installed()

    # 1. Size constraint
    if len(image_bytes) > MAX_IMAGE_BYTES:
        return AnalyzeImageResponse(
            status="invalid_image",
            extracted_text=None,
            analysis_result=None,
            message="Uploaded image exceeds 5MB size limit.",
            tesseract_detected=tesseract_available,
            timestamp=now_iso,
        )

    # 2. MIME type check
    if content_type and content_type.lower() not in ALLOWED_MIME_TYPES:
        return AnalyzeImageResponse(
            status="invalid_image",
            extracted_text=None,
            analysis_result=None,
            message=f"Unsupported format '{content_type}'. Please upload PNG, JPEG, or WEBP.",
            tesseract_detected=tesseract_available,
            timestamp=now_iso,
        )

    # 3. Verify image integrity and prevent polyglot / decompression exploits
    try:
        buffer = io.BytesIO(image_bytes)
        with Image.open(buffer) as img_check:
            img_check.verify()

        # Re-open verified image for processing
        buffer.seek(0)
        img = Image.open(buffer)
        width, height = img.size

        if width > MAX_PIXEL_DIMENSION or height > MAX_PIXEL_DIMENSION:
            return AnalyzeImageResponse(
                status="invalid_image",
                extracted_text=None,
                analysis_result=None,
                message=f"Image dimensions ({width}x{height}) exceed maximum allowed {MAX_PIXEL_DIMENSION}px.",
                tesseract_detected=tesseract_available,
                timestamp=now_iso,
            )

    except Exception as e:
        logger.warning(f"Corrupted or invalid image uploaded: {e}")
        return AnalyzeImageResponse(
            status="invalid_image",
            extracted_text=None,
            analysis_result=None,
            message="Corrupted or invalid image data.",
            tesseract_detected=tesseract_available,
            timestamp=now_iso,
        )

    # 4. Check OCR availability (Correction 4: Never simulate fake OCR success)
    if not tesseract_available:
        return AnalyzeImageResponse(
            status="ocr_unavailable",
            extracted_text=None,
            analysis_result=None,
            message="Native Tesseract OCR engine is not detected on this server host. Please paste the conversation text into the text scanner for analysis.",
            tesseract_detected=False,
            timestamp=now_iso,
        )

    # 5. Execute OCR Extraction
    try:
        # Convert to RGB to ensure compatibility
        if img.mode != "RGB":
            img = img.convert("RGB")

        extracted_text = pytesseract.image_to_string(img).strip()

        if not extracted_text:
            return AnalyzeImageResponse(
                status="no_text_detected",
                extracted_text="",
                analysis_result=None,
                message="No legible text was detected in the uploaded image.",
                tesseract_detected=True,
                timestamp=now_iso,
            )

        # 6. Pass extracted text through the hybrid detection engine
        language = identify_language(extracted_text)
        flags, rule_penalty = default_rule_evaluator.evaluate(extracted_text, language)
        ml_prob = ml_classifier.predict_scam_probability(extracted_text)

        analysis_result = aggregate_risk_assessment(
            text=extracted_text,
            language=language,
            flags=flags,
            rule_penalty=rule_penalty,
            ml_probability=ml_prob,
        )

        return AnalyzeImageResponse(
            status="success",
            extracted_text=extracted_text,
            analysis_result=analysis_result,
            message="Text successfully extracted and analyzed.",
            tesseract_detected=True,
            timestamp=now_iso,
        )

    except Exception as e:
        logger.error(f"OCR execution failure: {e}")
        return AnalyzeImageResponse(
            status="ocr_unavailable",
            extracted_text=None,
            analysis_result=None,
            message=f"OCR execution encountered an error: {str(e)}",
            tesseract_detected=True,
            timestamp=now_iso,
        )
