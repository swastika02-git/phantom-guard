import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Link2, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import type { AnalysisResult, LanguageCode } from '../../types/analysis';
import { analyzeTextAPI, analyzeURLAPI, analyzeImageAPI } from '../../services/api';

interface ScannerTabProps {
  onAnalyzeStart: () => void;
  onAnalyzeComplete: (result: AnalysisResult) => void;
  language: 'en' | 'hi';
}

type ScanMode = 'message' | 'link' | 'screenshot';

export const ScannerTab: React.FC<ScannerTabProps> = ({
  onAnalyzeStart,
  onAnalyzeComplete,
  language,
}) => {
  const [mode, setMode] = useState<ScanMode>('message');
  const [textContent, setTextContent] = useState('');
  const [urlContent, setUrlContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [manualOcrText, setManualOcrText] = useState('');
  const [ocrNotice, setOcrNotice] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Quick heuristic language detector for live indicator
  const detectedLanguage = useMemo<LanguageCode>(() => {
    if (!textContent.trim()) return 'en';
    // Check for Devanagari script (Hindi)
    const devanagariRegex = /[\u0900-\u097F]/;
    if (devanagariRegex.test(textContent)) {
      return 'hi';
    }
    // Check for Hinglish romanized markers
    const hinglishKeywords = /\b(aapka|karo|hone|wala|hai|karein|paisa|paise|turant|bhai|sir|crore|lakh|dhoka|khata|janaab)\b/i;
    if (hinglishKeywords.test(textContent)) {
      return 'hinglish';
    }
    return 'en';
  }, [textContent]);

  // Demo scenarios clearly marked
  const demoScenarios = [
    {
      id: 'kyc_scam',
      badge: 'Hinglish Scam',
      title: 'Fake Banking KYC',
      mode: 'message' as const,
      text: 'Congratulations aapka account block hone wala hai KYC immediately complete karo: http://sbi-kyc-verify.top/login.php',
    },
    {
      id: 'investment_scam',
      badge: 'Hinglish Scam',
      title: 'Guaranteed Returns',
      mode: 'message' as const,
      text: 'Sir investment double ho jayega 100% guaranteed return hai! VIP Telegram group join karo aur daily payout lo.',
    },
    {
      id: 'hindi_job_scam',
      badge: 'Hindi Scam',
      title: 'Part-Time Job Trap',
      mode: 'message' as const,
      text: 'घर बैठे यूट्यूब वीडियो लाइक करके रोज़ाना ₹3000 कमाएं। तुरंत व्हाट्सएप पर संपर्क करें और ₹500 रजिस्ट्रेशन फीस भेजें।',
    },
    {
      id: 'url_phishing',
      badge: 'Phishing URL',
      title: 'SBI Lookalike Domain',
      mode: 'link' as const,
      text: 'http://sbi-kyc-verification.top/login.php',
    },
    {
      id: 'genuine_delivery',
      badge: 'Genuine Alert (Hard Negative)',
      title: 'Legitimate Delivery',
      mode: 'message' as const,
      text: 'Bluedart: Your package with AWB 8920194 is out for delivery with agent Ramesh. Provide OTP 4921 only after receiving your package.',
    },
    {
      id: 'genuine_bank',
      badge: 'Genuine Alert (Hard Negative)',
      title: 'Legitimate Bank Alert',
      mode: 'message' as const,
      text: 'HDFC Bank Alert: Rs 450.00 debited from A/c **4921 for Swiggy txn. Not you? SMS BLOCK to 5676712 immediately.',
    },
  ];

  // Perform Analysis (Tries FastAPI backend first, with resilient fallback)
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    onAnalyzeStart();

    // Mode 1: Message
    if (mode === 'message') {
      const inputContent = textContent.trim();
      if (!inputContent) {
        setIsAnalyzing(false);
        return;
      }
      try {
        const liveResult = await analyzeTextAPI(inputContent);
        setIsAnalyzing(false);
        onAnalyzeComplete(liveResult);
        return;
      } catch (err) {
        console.warn('Backend Text API notice, using fallback:', err);
      }
    }

    // Mode 2: Link
    if (mode === 'link') {
      const urlToTest = urlContent.trim();
      if (!urlToTest) {
        setIsAnalyzing(false);
        return;
      }
      try {
        const liveUrlResult = await analyzeURLAPI(urlToTest);
        setIsAnalyzing(false);
        onAnalyzeComplete(liveUrlResult);
        return;
      } catch (err) {
        console.warn('Backend URL API notice, using client evaluation:', err);
      }
    }

    // Mode 3: Screenshot
    if (mode === 'screenshot') {
      if (selectedFile) {
        try {
          const ocrResp = await analyzeImageAPI(selectedFile);
          if (ocrResp.status === 'success' && ocrResp.result) {
            setIsAnalyzing(false);
            onAnalyzeComplete(ocrResp.result);
            return;
          } else if (ocrResp.status === 'ocr_unavailable') {
            setOcrNotice(ocrResp.message);
            // If user provided manual text, analyze that via text API
            if (manualOcrText.trim()) {
              const liveResult = await analyzeTextAPI(manualOcrText.trim());
              setIsAnalyzing(false);
              onAnalyzeComplete({
                ...liveResult,
                analysisType: 'screenshot',
                submittedContentSnippet: `[Screenshot Verification] ${manualOcrText.trim().slice(0, 160)}`,
              });
              return;
            } else {
              setIsAnalyzing(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Backend image OCR notice, using manual text fallback:', err);
        }
      }

      if (manualOcrText.trim()) {
        try {
          const liveResult = await analyzeTextAPI(manualOcrText.trim());
          setIsAnalyzing(false);
          onAnalyzeComplete({
            ...liveResult,
            analysisType: 'screenshot',
            submittedContentSnippet: `[Screenshot Manual Text] ${manualOcrText.trim().slice(0, 160)}`,
          });
          return;
        } catch (err) {
          console.warn('Backend Text API notice:', err);
        }
      }
    }

    // 2. Client-side heuristic fallback
    await new Promise((res) => setTimeout(res, 800));

    const inputContent = mode === 'message' ? textContent : mode === 'link' ? urlContent : manualOcrText;
    const flags = [];
    let score = 12;
    let verdict = 'Looks calm';
    let verdictLevel: 'calm' | 'warning' | 'danger' = 'calm';

    // 1. Urgency rule
    if (/immediately|turant|block hone wala|action required|within 2 hours|jaldi karo/i.test(inputContent)) {
      score += 35;
      flags.push({
        id: 'urgency_rule',
        ghostId: 'urgency' as const,
        ghostName: 'Urgency Wraith',
        title: 'High Pressure & Urgency',
        explanation: 'Creates artificial panic and threatens immediate blockage to force rushed decisions.',
        severity: 'high' as const,
        evidenceSpan: inputContent.match(/immediately|turant|block hone wala|within 2 hours|jaldi karo/i)?.[0] || 'Urgency detected',
      });
    }

    // 2. Guaranteed Returns
    if (/guaranteed|double ho jayega|100%|risk free|daily payout|paisa double/i.test(inputContent)) {
      score += 42;
      flags.push({
        id: 'returns_rule',
        ghostId: 'returns' as const,
        ghostName: 'Guaranteed-Returns Poltergeist',
        title: 'Unrealistic Financial Promises',
        explanation: 'Promises 100% guaranteed profits or doubled investments, a hallmark of illegal Ponzi and Telegram scams.',
        severity: 'critical' as const,
        evidenceSpan: inputContent.match(/guaranteed|double ho jayega|100%|daily payout|paisa double/i)?.[0] || 'Guaranteed return detected',
      });
    }

    // 3. Fake Authority / KYC / Domain lookalike
    if (/kyc|account block|sebi|police|rbi|cbi|income tax|sbi.*\.top|hdfc.*\.site/i.test(inputContent)) {
      score += 30;
      flags.push({
        id: 'authority_rule',
        ghostId: 'authority' as const,
        ghostName: 'Fake-Authority Phantom',
        title: 'Authority & Bank Impersonation',
        explanation: 'Falsely claims association with regulatory bodies, banks, or brands to extract trust and sensitive credentials.',
        severity: 'high' as const,
        evidenceSpan: inputContent.match(/kyc|account block|sebi|police|rbi|sbi|hdfc/i)?.[0] || 'Impersonation detected',
      });
    }

    // 4. Payment / UPI
    if (/रजिस्ट्रेशन फीस|registration fee|send ₹|pay ₹|upi|gpay|paytm/i.test(inputContent)) {
      score += 25;
      flags.push({
        id: 'payment_rule',
        ghostId: 'payment' as const,
        ghostName: 'Payment-Pull Banshee',
        title: 'Suspicious Upfront Fee Request',
        explanation: 'Demands upfront payment or registration fee before providing a job or releasing funds.',
        severity: 'medium' as const,
        evidenceSpan: inputContent.match(/रजिस्ट्रेशन फीस|registration fee|send ₹|pay ₹/i)?.[0] || 'Payment pull detected',
      });
    }

    // Hard negative dampener for legitimate verified formats
    if (/not you\? sms|provide otp.*only after receiving|never share.*with anyone/i.test(inputContent) && !/http|bit\.ly/i.test(inputContent)) {
      score = Math.max(8, score - 35);
    }

    // Score clamp between 0 and 100
    score = Math.min(100, Math.max(0, score));

    if (score > 65) {
      verdict = 'Likely a scam';
      verdictLevel = 'danger';
    } else if (score > 30) {
      verdict = 'Be careful';
      verdictLevel = 'warning';
    } else {
      verdict = 'Looks calm';
      verdictLevel = 'calm';
    }

    const result: AnalysisResult = {
      score,
      verdict,
      verdictLevel,
      language: detectedLanguage,
      confidence: 0.90,
      modelVersion: 'rule-engine-v1.0 (client-fallback)',
      flags,
      recommendations: score > 30
        ? [
            'Do not click any embedded links or dial unverified numbers.',
            'Never share OTPs, UPI PINs, or bank passwords with anyone.',
            'Verify directly through official bank apps or RBI-registered portals.',
          ]
        : [
            'This content does not exhibit known scam triggers.',
            'Continue exercising routine caution with unverified sources.',
          ],
      disclaimer: 'This score is an automated security indicator. Please verify independently before taking financial actions.',
      analysisType: mode === 'message' ? 'text' : mode === 'link' ? 'url' : 'screenshot',
      submittedContentSnippet: inputContent.slice(0, 160),
      timestamp: new Date().toLocaleTimeString(),
    };

    setIsAnalyzing(false);
    onAnalyzeComplete(result);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setOcrNotice(null);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Mode Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#FFFFFF',
          padding: '6px',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
          gap: '6px',
        }}
      >
        <button
          onClick={() => setMode('message')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '18px',
            fontSize: '0.96rem',
            fontWeight: mode === 'message' ? 600 : 500,
            backgroundColor: mode === 'message' ? '#FFE8EF' : 'transparent',
            color: mode === 'message' ? '#B23D69' : '#777B91',
            transition: 'all 0.2s ease',
          }}
        >
          <MessageSquare size={18} />
          <span>{language === 'hi' ? 'संदेश (SMS / WhatsApp)' : 'Message / SMS'}</span>
        </button>

        <button
          onClick={() => setMode('link')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '18px',
            fontSize: '0.96rem',
            fontWeight: mode === 'link' ? 600 : 500,
            backgroundColor: mode === 'link' ? '#FFE8EF' : 'transparent',
            color: mode === 'link' ? '#B23D69' : '#777B91',
            transition: 'all 0.2s ease',
          }}
        >
          <Link2 size={18} />
          <span>{language === 'hi' ? 'वेबसाइट लिंक' : 'Suspicious Link'}</span>
        </button>

        <button
          onClick={() => setMode('screenshot')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 18px',
            borderRadius: '18px',
            fontSize: '0.96rem',
            fontWeight: mode === 'screenshot' ? 600 : 500,
            backgroundColor: mode === 'screenshot' ? '#FFE8EF' : 'transparent',
            color: mode === 'screenshot' ? '#B23D69' : '#777B91',
            transition: 'all 0.2s ease',
          }}
        >
          <ImageIcon size={18} />
          <span>{language === 'hi' ? 'स्क्रीनशॉट' : 'Screenshot'}</span>
        </button>
      </div>

      {/* Main Input Card */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          marginBottom: '28px',
          position: 'relative',
        }}
      >
        {/* Mode 1: Text Message */}
        {mode === 'message' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '0.94rem', fontWeight: 600, color: '#252B45' }}>
                {language === 'hi' ? 'संदेश टेक्स्ट यहाँ पेस्ट करें:' : 'Paste message text (English, Hindi, or Hinglish):'}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: '#F0F7FF',
                    color: '#2B70C9',
                    border: '1px solid #A9D6F5',
                  }}
                >
                  Detected: {detectedLanguage.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#777B91' }}>
                  {textContent.length} / 2000
                </span>
              </div>
            </div>

            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value.slice(0, 2000))}
              placeholder="e.g. Aapka bank account block hone wala hai, KYC turant karein http://sbi-kyc.top..."
              rows={5}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: '1.5px solid rgba(37, 43, 69, 0.12)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                color: '#252B45',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
            />
          </div>
        )}

        {/* Mode 2: Link */}
        {mode === 'link' && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '0.94rem', fontWeight: 600, color: '#252B45' }}>
                Enter website URL to analyze offline:
              </label>
              <p style={{ fontSize: '0.82rem', color: '#777B91', marginTop: '2px' }}>
                🔒 Zero Network Handshake: Phantom Guard inspects the domain syntax, punycode, and homoglyphs offline. It never opens or requests the link.
              </p>
            </div>

            <input
              type="text"
              value={urlContent}
              onChange={(e) => setUrlContent(e.target.value)}
              placeholder="https://sbi-update-online.top/portal"
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '16px',
                border: '1.5px solid rgba(37, 43, 69, 0.12)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                color: '#252B45',
                outline: 'none',
              }}
            />
          </div>
        )}

        {/* Mode 3: Screenshot (With Explicit Honest Fallback) */}
        {mode === 'screenshot' && (
          <div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.94rem', fontWeight: 600, color: '#252B45' }}>
                Upload conversation screenshot:
              </label>
              <p style={{ fontSize: '0.82rem', color: '#777B91', marginTop: '2px' }}>
                Images are processed in memory and never stored permanently.
              </p>
            </div>

            {/* Honest Environment Notice */}
            <div
              style={{
                backgroundColor: '#FFF9E6',
                border: '1px solid #FFD166',
                borderRadius: '14px',
                padding: '12px 16px',
                marginBottom: '16px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
              }}
            >
              <AlertCircle size={20} color="#B37D00" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.85rem', color: '#664D00' }}>
                <strong>Host Environment Transparency:</strong> {ocrNotice || 'Native Tesseract OCR engine is not detected in this host environment. Uploading an image will check server OCR capability; if unavailable, you can review or type the conversation text below to run our full hybrid AI & rule engine.'}
              </div>
            </div>

            <div
              style={{
                border: '2px dashed #A9D6F5',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#F7FBFF',
                cursor: 'pointer',
                marginBottom: '16px',
              }}
              onClick={() => document.getElementById('screenshot-file-input')?.click()}
            >
              <input
                id="screenshot-file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {imagePreviewUrl ? (
                <div>
                  <img
                    src={imagePreviewUrl}
                    alt="Upload Preview"
                    style={{ maxHeight: '140px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  />
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#777B91' }}>
                    Click to choose a different screenshot
                  </div>
                </div>
              ) : (
                <div>
                  <ImageIcon size={36} color="#4A90E2" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontWeight: 600, color: '#252B45' }}>Choose Screenshot or Drop here</div>
                  <div style={{ fontSize: '0.8rem', color: '#777B91', marginTop: '4px' }}>PNG, JPG or WEBP up to 5MB</div>
                </div>
              )}
            </div>

            {/* Manual text verification fallback */}
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: '#252B45', marginBottom: '6px', display: 'block' }}>
                Review / Paste conversation text from image:
              </label>
              <textarea
                value={manualOcrText}
                onChange={(e) => setManualOcrText(e.target.value)}
                placeholder="Type or verify text visible in your screenshot here..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(37, 43, 69, 0.12)',
                  fontSize: '0.94rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            onClick={() => {
              setTextContent('');
              setUrlContent('');
              setManualOcrText('');
              setSelectedFile(null);
              setImagePreviewUrl(null);
              setOcrNotice(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              borderRadius: '999px',
              color: '#777B91',
              fontSize: '0.88rem',
              fontWeight: 500,
            }}
          >
            <RefreshCw size={15} />
            <span>Clear input</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={
              isAnalyzing ||
              (mode === 'message' && !textContent.trim()) ||
              (mode === 'link' && !urlContent.trim()) ||
              (mode === 'screenshot' && !selectedFile && !manualOcrText.trim())
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #F4A6C1 0%, #F28B82 100%)',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 6px 18px rgba(244, 166, 193, 0.45)',
              opacity:
                isAnalyzing ||
                (mode === 'message' && !textContent.trim()) ||
                (mode === 'link' && !urlContent.trim()) ||
                (mode === 'screenshot' && !selectedFile && !manualOcrText.trim())
                  ? 0.6
                  : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw size={18} />
                </motion.div>
                <span>Analyzing threat patterns...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Analyze with Pip</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Demo Scenarios Section */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: 600, color: '#252B45' }}>
            🎯 Try realistic test scenarios (Demonstrations):
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
          }}
        >
          {demoScenarios.map((demo) => (
            <button
              key={demo.id}
              onClick={() => {
                setMode(demo.mode);
                if (demo.mode === 'message') {
                  setTextContent(demo.text);
                } else if (demo.mode === 'link') {
                  setUrlContent(demo.text);
                }
              }}
              style={{
                textAlign: 'left',
                padding: '14px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(37, 43, 69, 0.08)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#F4A6C1';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(37, 43, 69, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#252B45' }}>
                  {demo.title}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '999px',
                    backgroundColor: demo.badge.includes('Genuine') ? '#EEFBF4' : '#FFE8EF',
                    color: demo.badge.includes('Genuine') ? '#2E855D' : '#B23D69',
                  }}
                >
                  {demo.badge}
                </span>
              </div>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#777B91',
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {demo.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
