from typing import Optional, Literal
from pydantic import BaseModel, Field
from app.schemas.analysis import AnalyzeTextResponse

OCRStatus = Literal["success", "ocr_unavailable", "no_text_detected", "invalid_image"]

class AnalyzeImageResponse(BaseModel):
    status: OCRStatus = Field(..., description="Outcome of the in-memory OCR evaluation")
    extracted_text: Optional[str] = Field(None, description="Text extracted from image if OCR succeeded")
    analysis_result: Optional[AnalyzeTextResponse] = Field(None, description="Scam analysis result on the extracted text")
    message: str = Field(..., description="User-facing status message")
    tesseract_detected: bool = Field(..., description="Whether native Tesseract executable is present in server environment")
    timestamp: str = Field(..., description="Timestamp of evaluation (ISO 8601)")
