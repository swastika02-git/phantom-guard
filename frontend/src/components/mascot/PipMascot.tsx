import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { VerdictLevel } from '../../types/analysis';

export type PipState = VerdictLevel | 'scanning' | 'idle';

interface PipMascotProps {
  state?: PipState;
  size?: number;
  interactiveEyes?: boolean;
  className?: string;
}

export const PipMascot: React.FC<PipMascotProps> = ({
  state = 'idle',
  size = 200,
  interactiveEyes = true,
  className = '',
}) => {
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  // Mouse tracking for expressive pupil motion
  useEffect(() => {
    if (!interactiveEyes) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate angle and distance to cursor from center of window
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      // Clamp eye movement within gentle bounds (-6 to +6 px)
      setPupilOffset({
        x: Math.max(-6, Math.min(6, dx * 6)),
        y: Math.max(-5, Math.min(5, dy * 5)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactiveEyes]);

  // Color mappings based on Pip state
  const colors = {
    calm: {
      body: '#EAF7F0',
      stroke: '#B8E8CF',
      cheeks: '#FFC8D6',
      badge: '#B8E8CF',
      badgeBorder: '#2E855D',
      shadow: 'rgba(184, 232, 207, 0.45)',
    },
    idle: {
      body: '#F0F7FF',
      stroke: '#A9D6F5',
      cheeks: '#F4A6C1',
      badge: '#A9D6F5',
      badgeBorder: '#4A90E2',
      shadow: 'rgba(169, 214, 245, 0.4)',
    },
    scanning: {
      body: '#F5F0FF',
      stroke: '#D3C4F8',
      cheeks: '#F4A6C1',
      badge: '#FFE69A',
      badgeBorder: '#E0A800',
      shadow: 'rgba(211, 196, 248, 0.5)',
    },
    warning: {
      body: '#FFFCEB',
      stroke: '#FFD166',
      cheeks: '#FFAAA6',
      badge: '#FFD166',
      badgeBorder: '#B37D00',
      shadow: 'rgba(255, 209, 102, 0.5)',
    },
    danger: {
      body: '#FFF0F0',
      stroke: '#F28B82',
      cheeks: '#E57373',
      badge: '#F28B82',
      badgeBorder: '#C62828',
      shadow: 'rgba(242, 139, 130, 0.55)',
    },
  }[state];

  // Motion variants
  const floatVariants = {
    calm: {
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    idle: {
      y: [0, -8, 0],
      rotate: [0, 1.5, -1.5, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
    },
    scanning: {
      y: [0, -5, 0],
      scale: [1, 1.04, 1],
      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
    warning: {
      y: [0, -7, 0],
      rotate: [0, -3, 3, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    danger: {
      x: [0, -3, 3, -2, 2, 0],
      y: [0, -3, 0],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1.5 },
    },
  };

  return (
    <motion.div
      className={`pip-mascot-wrapper ${className}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size * 1.15,
        filter: `drop-shadow(0 14px 20px ${colors.shadow})`,
      }}
      variants={floatVariants}
      animate={state}
      aria-label={`Pip the mascot in ${state} state`}
      role="img"
    >
      <svg
        viewBox="0 0 200 230"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle 3D gradient for body */}
          <linearGradient id={`pipGrad-${state}`} x1="30" y1="20" x2="170" y2="210" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.75" stopColor={colors.body} />
            <stop offset="1" stopColor={colors.stroke} stopOpacity="0.4" />
          </linearGradient>

          {/* Shield gradient */}
          <linearGradient id={`shieldGrad-${state}`} x1="85" y1="135" x2="115" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor={colors.badge} />
          </linearGradient>
        </defs>

        {/* Floating Ghost Body with Bottom Waves */}
        <path
          d="M100 24
             C50 24 35 68 35 115
             C35 160 30 195 44 195
             C55 195 62 182 72 182
             C82 182 88 195 100 195
             C112 195 118 182 128 182
             C138 182 145 195 156 195
             C170 195 165 160 165 115
             C165 68 150 24 100 24 Z"
          fill={`url(#pipGrad-${state})`}
          stroke={colors.stroke}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Small Left Arm */}
        <path
          d="M40 120 C26 126 22 138 32 144 C40 148 48 138 46 128"
          fill={colors.body}
          stroke={colors.stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Small Right Arm */}
        <path
          d="M160 120 C174 126 178 138 168 144 C160 148 152 138 154 128"
          fill={colors.body}
          stroke={colors.stroke}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Cheeks */}
        <ellipse cx="68" cy="115" rx="8" ry="5" fill={colors.cheeks} opacity="0.65" />
        <ellipse cx="132" cy="115" rx="8" ry="5" fill={colors.cheeks} opacity="0.65" />

        {/* Eyebrows for warning / danger */}
        {state === 'warning' && (
          <>
            <path d="M68 84 Q78 80 86 86" stroke="#4A4E69" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M114 86 Q122 80 132 84" stroke="#4A4E69" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}
        {state === 'danger' && (
          <>
            <path d="M70 82 Q80 87 88 84" stroke="#B3261E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M112 84 Q120 87 130 82" stroke="#B3261E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* EYES */}
        {state === 'calm' ? (
          // Happy curved eyes for Calm
          <>
            <path d="M68 96 Q78 85 88 96" stroke="#252B45" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M112 96 Q122 85 132 96" stroke="#252B45" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : state === 'danger' ? (
          // Wide surprised alert eyes for Danger
          <>
            <circle cx="78" cy="98" r="11" fill="#FFFFFF" stroke="#B3261E" strokeWidth="2" />
            <circle cx="78 + pupilOffset.x" cy="98 + pupilOffset.y" r="6" fill="#252B45" />
            <circle cx="76" cy="95" r="2.5" fill="#FFFFFF" />

            <circle cx="122" cy="98" r="11" fill="#FFFFFF" stroke="#B3261E" strokeWidth="2" />
            <circle cx="122 + pupilOffset.x" cy="98 + pupilOffset.y" r="6" fill="#252B45" />
            <circle cx="120" cy="95" r="2.5" fill="#FFFFFF" />
          </>
        ) : (
          // Expressive tracked pupil eyes for Idle, Warning & Scanning
          <>
            {/* Left Eye */}
            <circle cx="78" cy="98" r="9" fill="#252B45" />
            <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
              <circle cx="79" cy="97" r="3.2" fill="#FFFFFF" />
              <circle cx="76" cy="100" r="1.5" fill="#FFFFFF" />
            </g>

            {/* Right Eye */}
            <circle cx="122" cy="98" r="9" fill="#252B45" />
            <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
              <circle cx="123" cy="97" r="3.2" fill="#FFFFFF" />
              <circle cx="120" cy="100" r="1.5" fill="#FFFFFF" />
            </g>
          </>
        )}

        {/* MOUTH */}
        {state === 'calm' && (
          <path d="M92 112 Q100 120 108 112" stroke="#252B45" strokeWidth="3" strokeLinecap="round" fill="none" />
        )}
        {(state === 'idle' || state === 'scanning') && (
          <path d="M94 114 Q100 120 106 114" stroke="#252B45" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        )}
        {state === 'warning' && (
          <ellipse cx="100" cy="116" rx="4" ry="5" fill="#252B45" />
        )}
        {state === 'danger' && (
          <ellipse cx="100" cy="118" rx="6" ry="8" fill="#B3261E" />
        )}

        {/* PROTECTIVE SHIELD BADGE ON CHEST */}
        <g transform="translate(85, 136)">
          <path
            d="M15 2 L27 8 V18 C27 26 15 32 15 32 C15 32 3 26 3 18 V8 L15 2 Z"
            fill={`url(#shieldGrad-${state})`}
            stroke={colors.badgeBorder}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Star / Lock icon in center of shield */}
          <path
            d="M15 9 L17 13 L21 13.5 L18 16.5 L19 21 L15 18.5 L11 21 L12 16.5 L9 13.5 L13 13 L15 9 Z"
            fill={colors.badgeBorder}
            opacity="0.85"
          />
        </g>
      </svg>
    </motion.div>
  );
};
