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

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
