import React from 'react';
import { ShieldCheck, Heart, AlertCircle, FileText, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '60px',
        borderTop: '1px solid rgba(37, 43, 69, 0.08)',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(10px)',
        padding: '40px 24px 30px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '30px',
        }}
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#252B45' }}>
              👻 Phantom Guard
            </span>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#777B91', maxWidth: '340px' }}>
            See the red flags. Outsmart the scams. Designed to protect everyday internet users across India from WhatsApp frauds, fake KYC, and deceptive links.
          </p>
          <div style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', background: '#FFE8EF', color: '#B23D69', padding: '4px 10px', borderRadius: '999px', fontWeight: 600 }}>
            <span>Target: SLAY HACKS 2026</span>
          </div>
        </div>

        {/* Responsible AI Disclaimer */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#252B45', fontWeight: 600, fontSize: '0.98rem' }}>
            <AlertCircle size={18} color="#FFD166" />
            <span>Responsible AI Commitment</span>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#777B91', lineHeight: 1.55 }}>
            Phantom Guard produces probabilistic risk indicators based on syntactic patterns and trained models. It does not provide legal or financial advice. Always verify suspicious communications independently with your financial institution or official authorities.
          </p>
        </div>

        {/* Privacy Note */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#252B45', fontWeight: 600, fontSize: '0.98rem' }}>
            <ShieldCheck size={18} color="#B8E8CF" />
            <span>Privacy Guardrails</span>
          </div>
          <p style={{ fontSize: '0.86rem', color: '#777B91', lineHeight: 1.55 }}>
            User messages and images are processed in-memory and are never permanently stored or logged. The community threat ledger records only client-side SHA-256 fingerprints.
          </p>
          <div style={{ marginTop: '10px', display: 'flex', gap: '14px', fontSize: '0.84rem' }}>
            <a href="#threat-model" style={{ color: '#2B70C9', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileText size={14} /> Threat Model
            </a>
            <a href="https://github.com/swastika02-git/phantom-guard" target="_blank" rel="noreferrer" style={{ color: '#2B70C9', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Code2 size={14} /> GitHub Repo
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid rgba(37, 43, 69, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#A6AABF',
        }}
      >
        <div>© 2026 Phantom Guard. Licensed under MIT.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Crafted with <Heart size={14} color="#F4A6C1" fill="#F4A6C1" /> for digital safety in India
        </div>
      </div>
    </footer>
  );
};
