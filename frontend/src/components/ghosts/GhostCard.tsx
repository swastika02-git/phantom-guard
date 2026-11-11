import React from 'react';
import { motion } from 'framer-motion';
import type { ThreatFlag } from '../../types/analysis';

interface GhostCardProps {
  flag: ThreatFlag;
  index: number;
}

export const GhostCard: React.FC<GhostCardProps> = ({ flag, index }) => {
  // Pastel themes for each of the 6 ghosts
  const theme = {
    urgency: {
      bg: '#F5F0FF',
      border: '#D8C5FF',
      accent: '#8A56E2',
      badge: '#EDE4FF',
      label: 'Urgency Wraith',
    },
    returns: {
      bg: '#FFFCEB',
      border: '#FFE69A',
      accent: '#C79800',
      badge: '#FFF6D6',
      label: 'Guaranteed-Returns Poltergeist',
    },
    authority: {
      bg: '#F0F7FF',
      border: '#A9D6F5',
      accent: '#2B70C9',
      badge: '#E0F0FC',
      label: 'Fake-Authority Phantom',
    },
    payment: {
      bg: '#FFF0F5',
      border: '#F4A6C1',
      accent: '#C73B6F',
      badge: '#FEE5EE',
      label: 'Payment-Pull Banshee',
    },
    secrecy: {
      bg: '#F4F4FA',
      border: '#C7C9E2',
      accent: '#5E6282',
      badge: '#E6E7F4',
      label: 'Secrecy Spook',
    },
    gremlin: {
      bg: '#FFF2F0',
      border: '#F28B82',
      accent: '#D32F2F',
      badge: '#FFE2DE',
      label: 'Shouting Gremlin',
    },
  }[flag.ghostId] || {
    bg: '#F5F5F5',
    border: '#CCCCCC',
    accent: '#555555',
    badge: '#EAEAEA',
    label: flag.ghostName,
  };

  return (
    <motion.div
      className="ghost-card"
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.45,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        background: theme.bg,
        border: `2px solid ${theme.border}`,
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 8px 20px -4px rgba(37, 43, 69, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header: Ghost Badge & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: `1.5px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
          }}
        >
          <GhostIllustration ghostId={flag.ghostId} accent={theme.accent} />
        </div>
        <div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: theme.accent,
              background: theme.badge,
              padding: '2px 8px',
              borderRadius: '999px',
              letterSpacing: '0.4px',
            }}
          >
            {theme.label}
          </span>
          <h4 style={{ margin: '4px 0 0 0', fontSize: '1.08rem', color: '#252B45' }}>
            {flag.title}
          </h4>
        </div>
      </div>

      {/* Friendly Explanation */}
      <p style={{ margin: 0, fontSize: '0.94rem', color: '#4A4E69', lineHeight: 1.5 }}>
        {flag.explanation}
      </p>

      {/* Detected Evidence Box */}
      {flag.evidenceSpan && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            border: `1px dashed ${theme.border}`,
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '0.88rem',
            color: '#252B45',
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#777B91', textTransform: 'uppercase', marginBottom: '3px' }}>
            Flagged Evidence:
          </div>
          <span style={{ fontWeight: 600, color: theme.accent }}>
            &ldquo;{flag.evidenceSpan}&rdquo;
          </span>
        </div>
      )}
    </motion.div>
  );
};

// Custom Mini SVG illustrations for the 6 ghosts
const GhostIllustration: React.FC<{ ghostId: string; accent: string }> = ({ ghostId, accent }) => {
  switch (ghostId) {
    case 'urgency':
      // Urgency Wraith with tiny stopwatch
      return (
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          <path d="M18 4 C11 4 8 10 8 18 C8 24 7 30 10 30 C13 30 14 27 18 27 C22 27 23 30 26 30 C29 30 28 24 28 18 C28 10 25 4 18 4 Z" fill="#E8E5FA" stroke={accent} strokeWidth="1.5" />
          <circle cx="14" cy="14" r="1.8" fill={accent} />
          <circle cx="22" cy="14" r="1.8" fill={accent} />
          {/* Stopwatch badge */}
          <circle cx="23" cy="22" r="5" fill="#FFFFFF" stroke={accent} strokeWidth="1.2" />
          <path d="M23 19.5 V22 H24.5" stroke={accent} strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case 'returns':
      // Guaranteed-Returns Poltergeist with coin
      return (
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          <path d="M18 4 C11 4 8 10 8 18 C8 24 7 30 10 30 C13 30 14 27 18 27 C22 27 23 30 26 30 C29 30 28 24 28 18 C28 10 25 4 18 4 Z" fill="#FFFCEB" stroke={accent} strokeWidth="1.5" />
          <path d="M13 14 Q15 11 17 14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 14 Q21 11 23 14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          {/* Floating Coin */}
          <circle cx="23" cy="21" r="5" fill="#FFE69A" stroke={accent} strokeWidth="1.2" />
          <path d="M22 19 L24 21 L22 23" stroke={accent} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'authority':
      // Fake-Authority Phantom with crooked inspector hat
      return (
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          {/* Hat */}
          <path d="M11 8 C11 4 25 4 25 8 L28 10 H8 L11 8 Z" fill={accent} opacity="0.85" />
          <path d="M18 10 C11 10 8 14 8 20 C8 25 7 30 10 30 C13 30 14 27 18 27 C22 27 23 30 26 30 C29 30 28 25 28 20 C28 14 25 10 18 10 Z" fill="#F0F7FF" stroke={accent} strokeWidth="1.5" />
          <circle cx="14" cy="17" r="1.8" fill={accent} />
          <circle cx="22" cy="17" r="1.8" fill={accent} />
          <path d="M15 22 Q18 24 21 22" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'payment':
      // Payment-Pull Banshee with rupee pull
      return (
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          <path d="M18 4 C11 4 8 10 8 18 C8 24 7 30 10 30 C13 30 14 27 18 27 C22 27 23 30 26 30 C29 30 28 24 28 18 C28 10 25 4 18 4 Z" fill="#FFF0F5" stroke={accent} strokeWidth="1.5" />
          <circle cx="14" cy="14" r="1.8" fill={accent} />
          <circle cx="22" cy="14" r="1.8" fill={accent} />
          {/* Rupee Coin */}
          <circle cx="23" cy="22" r="5" fill="#FFD1DC" stroke={accent} strokeWidth="1.2" />
          <text x="21" y="25" fontSize="7" fill={accent} fontWeight="bold" fontFamily="sans-serif">₹</text>
        </svg>
      );
    case 'secrecy':
      // Secrecy Spook holding finger to mouth with mini padlock
      return (
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          <path d="M18 4 C11 4 8 10 8 18 C8 24 7 30 10 30 C13 30 14 27 18 27 C22 27 23 30 26 30 C29 30 28 24 28 18 C28 10 25 4 18 4 Z" fill="#F4F4FA" stroke={accent} strokeWidth="1.5" />
          <circle cx="14" cy="14" r="1.8" fill={accent} />
          <circle cx="22" cy="14" r="1.8" fill={accent} />
          {/* Shh finger & padlock */}
          <rect x="20" y="19" width="7" height="6" rx="1.5" fill="#E6E7F4" stroke={accent} strokeWidth="1" />
          <path d="M22 19 V17 C22 15.8 25 15.8 25 17 V19" stroke={accent} strokeWidth="1" />
        </svg>
      );
    case 'gremlin':
      // Shouting Gremlin with wide exclamation mouth
      return (
        <svg viewBox="0 0 36 36" width="36" height="36" fill="none">
          <path d="M18 4 C11 4 8 10 8 18 C8 24 7 30 10 30 C13 30 14 27 18 27 C22 27 23 30 26 30 C29 30 28 24 28 18 C28 10 25 4 18 4 Z" fill="#FFF2F0" stroke={accent} strokeWidth="1.5" />
          <circle cx="13" cy="13" r="2" fill={accent} />
          <circle cx="23" cy="13" r="2" fill={accent} />
          {/* Wide shouting mouth */}
          <ellipse cx="18" cy="20" rx="4.5" ry="5.5" fill={accent} />
        </svg>
      );
    default:
      return null;
  }
};
