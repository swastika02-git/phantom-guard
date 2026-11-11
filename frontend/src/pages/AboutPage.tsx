import React from 'react';
import { ShieldCheck, HeartHandshake, Eye, AlertOctagon, FileCheck2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const principles = [
    {
      icon: <Eye size={24} color="#8A56E2" />,
      title: 'Explainable Over Black-Box',
      text: 'Instead of an arbitrary danger score, Phantom Guard surfaces specific semantic red flags as friendly cartoon ghosts. Every warning cites exact textual evidence so users understand the psychological tactics employed.',
    },
    {
      icon: <HeartHandshake size={24} color="#F4A6C1" />,
      title: 'Assistive, Never Authoritarian',
      text: 'We empower users to make informed decisions rather than forcibly blocking messages. Technology should be a transparent companion that educates users on identifying future scams.',
    },
    {
      icon: <ShieldCheck size={24} color="#2E855D" />,
      title: 'Privacy Through Ephemerality',
      text: 'Your confidential personal conversations, banking SMS, and OTP notifications must never be retained by a security scanner. All inputs are evaluated in memory and discarded upon request completion.',
    },
    {
      icon: <AlertOctagon size={24} color="#B37D00" />,
      title: 'Probabilistic, Not Definitive',
      text: 'No automated heuristic or machine learning model is 100% infallible. Our risk scores reflect mathematical suspicion indices, not legal determinations. Users are guided to verify with their bank directly.',
    },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px 0 60px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', backgroundColor: '#FFE8EF', color: '#B23D69', fontSize: '0.84rem', fontWeight: 700, marginBottom: '12px' }}>
          <FileCheck2 size={15} />
          <span>Transparent & Ethical Cybersecurity</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', color: '#252B45', marginBottom: '12px' }}>
          Responsible AI Framework
        </h1>
        <p style={{ color: '#777B91', fontSize: '1.08rem', maxWidth: '640px', margin: '0 auto' }}>
          How Phantom Guard safeguards trust, respects user privacy, and ensures human agency while analyzing digital deception.
        </p>
      </div>

      {/* Principles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}
      >
        {principles.map((p, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '28px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#FFFDFB',
                border: '1.5px solid rgba(37, 43, 69, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              {p.icon}
            </div>
            <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: '#252B45' }}>
              {p.title}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#5E6282', lineHeight: 1.55 }}>
              {p.text}
            </p>
          </div>
        ))}
      </div>

      {/* Critical Limitations & Disclaimers Accordion / Card */}
      <div
        className="glass-card"
        style={{
          padding: '32px',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          marginBottom: '32px',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#252B45' }}>
          Critical Limitations & User Protections
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '1.02rem', color: '#252B45', marginBottom: '4px' }}>
              1. Understanding False Positives & Hard Negatives
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#777B91', margin: 0 }}>
              Genuine bank debit alerts and courier deliveries frequently contain urgent keywords like &ldquo;OTP&rdquo; or &ldquo;SMS immediately&rdquo;. We deliberately include hard negative benchmark filters to avoid creating unnecessary panic over legitimate communications.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.02rem', color: '#252B45', marginBottom: '4px' }}>
              2. Linguistic Nuances of Hinglish
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#777B91', margin: 0 }}>
              Hinglish varies significantly across Indian regions, dialects, and slang. While our character n-gram approach captures phonetic variations (*paisa*, *paise*, *paishe*), no model has universal dialect coverage.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1.02rem', color: '#252B45', marginBottom: '4px' }}>
              3. Legal and Financial Advice Exclusion
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#777B91', margin: 0 }}>
              Phantom Guard is a heuristic software tool for scam awareness. It does not replace reporting to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or calling 1930.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
