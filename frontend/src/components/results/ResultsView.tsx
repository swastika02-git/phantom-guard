import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowLeft, CheckCircle2, Copy, Database } from 'lucide-react';
import type { AnalysisResult } from '../../types/analysis';
import { PipMascot } from '../mascot/PipMascot';
import { GhostCard } from '../ghosts/GhostCard';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
  onNavigateToLedger: (fingerprint: string) => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onReset,
  onNavigateToLedger,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);
  const [clientFingerprint, setClientFingerprint] = useState('');

  // Count upward animation for the score
  useEffect(() => {
    let current = 0;
    const target = result.score;
    const duration = 1000; // 1s
    const steps = 40;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result.score]);

  // Compute Client-Side SHA-256 for the ledger without sending raw content
  useEffect(() => {
    const computeHash = async () => {
      const textToHash = (result.submittedContentSnippet || 'sample content')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
      const msgUint8 = new TextEncoder().encode(textToHash);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setClientFingerprint(hashHex);
    };
    computeHash();
  }, [result.submittedContentSnippet]);

  // Visual status config
  const statusConfig = {
    calm: {
      color: '#2E855D',
      bg: '#EEFBF4',
      border: '#B8E8CF',
      barColor: 'linear-gradient(90deg, #B8E8CF 0%, #7FD8AB 100%)',
      badgeText: 'Looks calm (Low Risk)',
      icon: <ShieldCheck size={28} color="#2E855D" />,
    },
    warning: {
      color: '#9E7400',
      bg: '#FFF9E6',
      border: '#FFD166',
      barColor: 'linear-gradient(90deg, #FFE69A 0%, #FFD166 100%)',
      badgeText: 'Be careful (Suspicious)',
      icon: <AlertTriangle size={28} color="#9E7400" />,
    },
    danger: {
      color: '#B3261E',
      bg: '#FEECEB',
      border: '#F28B82',
      barColor: 'linear-gradient(90deg, #F4A6C1 0%, #F28B82 100%)',
      badgeText: 'Likely a scam (High Risk)',
      icon: <ShieldAlert size={28} color="#B3261E" />,
    },
  }[result.verdictLevel];

  const handleCopyFingerprint = () => {
    if (clientFingerprint) {
      navigator.clipboard.writeText(clientFingerprint);
      setCopiedFingerprint(true);
      setTimeout(() => setCopiedFingerprint(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ maxWidth: '900px', margin: '0 auto' }}
    >
      {/* Top Bar with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={onReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '999px',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(37, 43, 69, 0.1)',
            color: '#252B45',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          <span>Scan Another</span>
        </button>

        <span style={{ fontSize: '0.8rem', color: '#777B91' }}>
          Analyzed at {result.timestamp}
        </span>
      </div>

      {/* Hero Result Banner */}
      <div
        className="glass-card"
        style={{
          padding: '32px',
          marginBottom: '28px',
          border: `2px solid ${statusConfig.border}`,
          backgroundColor: '#FFFFFF',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Mascot Column */}
        <div style={{ textAlign: 'center' }}>
          <PipMascot state={result.verdictLevel} size={150} />
          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#777B91', fontWeight: 500 }}>
            Pip&apos;s Reaction: <span style={{ textTransform: 'capitalize', fontWeight: 700, color: statusConfig.color }}>{result.verdictLevel}</span>
          </div>
        </div>

        {/* Score & Verdict Column */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', backgroundColor: statusConfig.bg, border: `1px solid ${statusConfig.border}`, marginBottom: '12px' }}>
            {statusConfig.icon}
            <span style={{ fontWeight: 700, color: statusConfig.color, fontSize: '0.95rem' }}>
              {statusConfig.badgeText}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3.6rem', fontWeight: 700, color: '#252B45', lineHeight: 1 }}>
              {animatedScore}
            </span>
            <span style={{ fontSize: '1.2rem', color: '#777B91', fontWeight: 600 }}>/ 100</span>
            <span style={{ marginLeft: '12px', fontSize: '0.85rem', padding: '4px 10px', borderRadius: '999px', backgroundColor: '#F0F7FF', color: '#2B70C9', fontWeight: 600 }}>
              Lang: {result.language.toUpperCase()}
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div style={{ width: '100%', height: '14px', borderRadius: '999px', backgroundColor: '#F0F2F5', overflow: 'hidden', marginBottom: '12px' }}>
            <motion.div
              style={{
                height: '100%',
                borderRadius: '999px',
                background: statusConfig.barColor,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${result.score}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>

          <p style={{ fontSize: '0.86rem', color: '#777B91', margin: 0 }}>
            {result.disclaimer}
          </p>
        </div>
      </div>

      {/* Detected Ghosts Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: '#252B45' }}>
            👻 Detected Red Flags ({result.flags.length})
          </span>
        </div>

        {result.flags.length === 0 ? (
          <div
            style={{
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: '#EEFBF4',
              border: '1.5px solid #B8E8CF',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <CheckCircle2 size={32} color="#2E855D" />
            <div>
              <div style={{ fontWeight: 600, color: '#2E855D', fontSize: '1.02rem' }}>
                No active scam ghosts detected!
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#4A7C59' }}>
                This message does not exhibit known high-pressure, fake authority, or fraudulent investment indicators.
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {result.flags.map((flag, idx) => (
              <GhostCard key={flag.id} flag={flag} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Action Checklist */}
      <div
        className="glass-card"
        style={{
          padding: '24px 28px',
          marginBottom: '28px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <h4 style={{ fontSize: '1.1rem', marginBottom: '14px', color: '#252B45' }}>
          🛡️ Recommended Next Steps
        </h4>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {result.recommendations.map((rec, i) => (
            <li key={i} style={{ fontSize: '0.92rem', color: '#4A4E69' }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Privacy-Preserving Ledger Verification Box */}
      <div
        style={{
          backgroundColor: '#F9FAFC',
          border: '1px solid rgba(37, 43, 69, 0.1)',
          borderRadius: '20px',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#252B45', fontSize: '0.94rem' }}>
            <Database size={16} color="#A9D6F5" />
            <span>Client-Computed SHA-256 Fingerprint:</span>
          </div>
          <code
            style={{
              display: 'inline-block',
              marginTop: '4px',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: '#5E6282',
              backgroundColor: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid #EAEAEA',
              maxWidth: '380px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {clientFingerprint || 'Generating hash...'}
          </code>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCopyFingerprint}
            style={{
              padding: '8px 14px',
              borderRadius: '999px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(37, 43, 69, 0.12)',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Copy size={14} />
            <span>{copiedFingerprint ? 'Copied!' : 'Copy Hash'}</span>
          </button>

          <button
            onClick={() => onNavigateToLedger(clientFingerprint)}
            style={{
              padding: '8px 16px',
              borderRadius: '999px',
              backgroundColor: '#A9D6F5',
              color: '#1A4D7A',
              fontSize: '0.84rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Verify in Ledger</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
