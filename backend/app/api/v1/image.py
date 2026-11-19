import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.schemas.ocr import AnalyzeImageResponse
from app.engine.ocr.service import process_screenshot_in_memory, MAX_IMAGE_BYTES

logger = logging.getLogger("phantom_guard.api")
router = APIRouter(prefix="/analyze", tags=["Image Analysis"])

@router.post(
    "/image",
    response_model=AnalyzeImageResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze suspicious conversation screenshot",
    description="Extracts text from screenshots in-memory using OCR and evaluates threat patterns. Raw images are never stored on disk."
)
async def analyze_image(
    file: UploadFile = File(..., description="Uploaded image file (PNG, JPEG, WEBP)")
) -> AnalyzeImageResponse:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Uploaded file must have a filename."
        )

    # Read bytes safely in chunks up to max limit + 1 to detect overflow
    image_bytes = await file.read(MAX_IMAGE_BYTES + 1024)

    # Discard connection buffer
    await file.close()

    result = process_screenshot_in_memory(image_bytes, file.content_type)

    logger.info(
        f"[AUDIT] Image processed in-memory: bytes={len(image_bytes)}, status={result.status}, tesseract={result.tesseract_detected}"
    )

    return result
