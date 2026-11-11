export type VerdictLevel = 'calm' | 'warning' | 'danger';

export type LanguageCode = 'en' | 'hi' | 'hinglish';

export interface ThreatFlag {
  id: string;
  ghostId: 'urgency' | 'returns' | 'authority' | 'payment' | 'secrecy' | 'gremlin';
  ghostName: string;
  title: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidenceSpan: string;
  startOffset?: number;
  endOffset?: number;
}

export interface URLIndicator {
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnalysisResult {
  score: number; // 0 - 100
  verdict: string;
  verdictLevel: VerdictLevel;
  language: LanguageCode;
  confidence: number;
  modelVersion: string;
  flags: ThreatFlag[];
  recommendations: string[];
  disclaimer: string;
  analysisType: 'text' | 'url' | 'screenshot';
  submittedContentSnippet?: string;
  timestamp: string;
}

export interface LedgerBlock {
  blockNumber: number;
  timestamp: string;
  fingerprint: string;
  category: string;
  previousHash: string;
  currentHash: string;
  verified: boolean;
  isSimulatedDemo?: boolean;
}
