import type { AnalysisResult } from '../types/analysis';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function analyzeTextAPI(content: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      source_hint: 'web_scanner',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error (${response.status})`);
  }

  const data = await response.json();

  // Map backend response into frontend AnalysisResult format
  return {
    score: data.score,
    verdict: data.verdict,
    verdictLevel: data.verdict_level,
    language: data.language,
    confidence: data.confidence,
    modelVersion: data.model_version,
    flags: (data.flags || []).map((f: any) => ({
      id: f.id,
      ghostId: f.ghost_id,
      ghostName: f.ghost_name,
      title: f.name,
      explanation: f.explanation,
      severity: f.severity,
      evidenceSpan: f.evidence_span,
      startOffset: f.start_offset,
      endOffset: f.end_offset,
    })),
    recommendations: data.recommendations || [],
    disclaimer: data.disclaimer,
    analysisType: 'text',
    submittedContentSnippet: content.slice(0, 160),
    timestamp: new Date().toLocaleTimeString(),
  };
}

export async function analyzeURLAPI(url: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/analyze/url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error (${response.status})`);
  }

  const data = await response.json();

  const getGhostForType = (type: string): { ghostId: 'urgency' | 'returns' | 'authority' | 'payment' | 'secrecy' | 'gremlin'; ghostName: string } => {
    if (type.includes('brand') || type.includes('punycode')) {
      return { ghostId: 'authority', ghostName: 'Fake-Authority Phantom' };
    }
    if (type.includes('shortener') || type.includes('ip_literal')) {
      return { ghostId: 'secrecy', ghostName: 'Secrecy Spook' };
    }
    return { ghostId: 'gremlin', ghostName: 'Shouting Gremlin' };
  };

  return {
    score: data.score,
    verdict: data.verdict,
    verdictLevel: data.verdict_level,
    language: 'en',
    confidence: 0.95,
    modelVersion: 'url-heuristics-v1 (offline)',
    flags: (data.indicators || []).map((ind: any) => {
      const ghost = getGhostForType(ind.type);
      return {
        id: ind.type,
        ghostId: ghost.ghostId,
        ghostName: ghost.ghostName,
        title: ind.name,
        explanation: ind.description,
        severity: ind.severity,
        evidenceSpan: ind.evidence,
      };
    }),
    recommendations: data.score > 30
      ? [
          'Do not enter credentials, debit card info, or OTPs on this address.',
          'Verify official domains directly via official apps or verified search results.',
          'Never authorize UPI transactions or download APK files prompted by this site.',
        ]
      : [
          'No known deceptive domain patterns or homoglyphs were detected.',
          'Always verify browser SSL certificates and address bar spelling before submitting sensitive details.',
        ],
    disclaimer: data.safe_inspection_note,
    analysisType: 'url',
    submittedContentSnippet: data.url,
    timestamp: new Date().toLocaleTimeString(),
  };
}

export interface ImageAnalysisResponse {
  status: 'success' | 'ocr_unavailable' | 'no_text_detected' | 'invalid_image';
  extractedText?: string;
  result?: AnalysisResult;
  message: string;
  tesseractDetected: boolean;
}

export async function analyzeImageAPI(file: File): Promise<ImageAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/analyze/image`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server error (${response.status})`);
  }

  const data = await response.json();

  let mappedResult: AnalysisResult | undefined;
  if (data.analysis_result) {
    const ar = data.analysis_result;
    mappedResult = {
      score: ar.score,
      verdict: ar.verdict,
      verdictLevel: ar.verdict_level,
      language: ar.language,
      confidence: ar.confidence,
      modelVersion: ar.model_version,
      flags: (ar.flags || []).map((f: any) => ({
        id: f.id,
        ghostId: f.ghost_id,
        ghostName: f.ghost_name,
        title: f.name,
        explanation: f.explanation,
        severity: f.severity,
        evidenceSpan: f.evidence_span,
        startOffset: f.start_offset,
        endOffset: f.end_offset,
      })),
      recommendations: ar.recommendations || [],
      disclaimer: ar.disclaimer,
      analysisType: 'screenshot',
      submittedContentSnippet: (data.extracted_text || '').slice(0, 160),
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  return {
    status: data.status,
    extractedText: data.extracted_text,
    result: mappedResult,
    message: data.message,
    tesseractDetected: data.tesseract_detected,
  };
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

