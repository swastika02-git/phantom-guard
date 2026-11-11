import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Lock, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PipMascot } from '../components/mascot/PipMascot';

interface LandingPageProps {
  onStartScanning: () => void;
  language: 'en' | 'hi';
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartScanning,
  language,
}) => {
  const features = [
    {
      icon: <Sparkles size={24} color="#F4A6C1" />,
      bg: '#FFE8EF',
      title: 'Hinglish & Multilingual AI',
      desc: 'Built specifically for Indian conversational nuances. Understands Hindi, English, and Romanized Hinglish like "account block hone wala hai".',
    },
    {
      icon: <Eye size={24} color="#8A56E2" />,
      bg: '#F5F0FF',
      title: '6 Friendly Threat Ghosts',
      desc: 'Replaces confusing cyber terminology with memorable cartoon ghosts explaining the exact scam technique in plain language.',
    },
    {
      icon: <Lock size={24} color="#4A90E2" />,
      bg: '#F0F7FF',
      title: 'Zero-Contact URL Inspection',
      desc: 'Analyzes suspicious domains, homoglyphs, and punycode strictly offline. Never requests or opens user-submitted links (SSRF-proof).',
    },
    {
      icon: <Shield size={24} color="#2E855D" />,
      bg: '#EEFBF4',
      title: 'Privacy-First Ledger',
      desc: 'Raw messages are never stored. Optional community reporting uses client-side SHA-256 fingerprints with tamper-evident cryptographic verification.',
    },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 0 60px 0' }}>
      {/* Hero Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          padding: '40px 0 60px 0',
        }}
      >
        {/* Left Column: Expressive Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                backgroundColor: '#FFE8EF',
                color: '#B23D69',
                fontSize: '0.86rem',
                fontWeight: 700,
                marginBottom: '16px',
                border: '1px solid #F4A6C1',
              }}
            >
              <Sparkles size={16} />
              <span>{language === 'hi' ? 'भारतीय यूज़र्स के लिए AI सुरक्षा' : 'AI-Powered Digital Safety Companion'}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#252B45',
                marginBottom: '20px',
                letterSpacing: '-0.8px',
              }}
            >
              {language === 'hi'
                ? 'हर संदेश भरोसे के लायक नहीं होता।'
                : 'Not every message deserves your trust.'}
            </h1>

            <p
              style={{
                fontSize: '1.18rem',
                color: '#5E6282',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '520px',
              }}
            >
              {language === 'hi'
                ? 'पिप्प से मिलिए — आपका दोस्ताना AI शील्ड जो व्हाट्सएप, फर्जी बैंक KYC और पोंजी इन्वेस्टमेंट स्कैम को पहचानकर आपको सुरक्षित रखता है।'
                : 'Meet Pip — your friendly AI-powered shield against WhatsApp frauds, fake banking KYC, and deceitful links before you become a victim.'}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={onStartScanning}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 36px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #F4A6C1 0%, #F28B82 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.12rem',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(244, 166, 193, 0.5)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(244, 166, 193, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 166, 193, 0.5)';
                }}
              >
                <span>{language === 'hi' ? 'संदेश स्कैन करें' : 'Scan a message now'}</span>
                <ArrowRight size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#777B91' }}>
                <CheckCircle2 size={16} color="#2E855D" />
                <span>100% Free & No Sign-up</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Pip Guardian */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ textAlign: 'center' }}
          >
            {/* Pip Mascot with Calm/Welcoming Expression */}
            <PipMascot state="calm" size={260} />
            
            {/* Friendly Mascot Speech Bubble */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '16px',
                padding: '10px 20px',
                borderRadius: '999px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 8px 20px rgba(37, 43, 69, 0.08)',
                border: '1.5px solid #A9D6F5',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#252B45',
              }}
            >
              <span>👋 Hi, I&apos;m Pip! Paste any suspicious message above.</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ marginTop: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2.1rem', marginBottom: '10px', color: '#252B45' }}>
            Why Everyday Users Need Phantom Guard
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem', color: '#777B91' }}>
            Traditional scam detectors only look for formal English phrasing. Scammers in India leverage WhatsApp, Romanized Hinglish, and urgency tricks.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              className="glass-card"
              style={{
                padding: '28px',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
              }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: feat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: '#252B45' }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#5E6282', lineHeight: 1.55 }}>
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3-Step Walkthrough */}
      <div
        className="glass-card"
        style={{
          marginTop: '60px',
          padding: '40px 32px',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#B23D69', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Simple Workflow
          </span>
          <h2 style={{ fontSize: '1.9rem', color: '#252B45', marginTop: '4px' }}>
            How Phantom Guard Shields You in Seconds
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          <div style={{ padding: '20px', borderRadius: '18px', backgroundColor: '#FFFDFB', border: '1px solid rgba(37, 43, 69, 0.06)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFE8EF', color: '#B23D69', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              1
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Submit Content</h4>
            <p style={{ fontSize: '0.88rem', color: '#777B91', margin: 0 }}>
              Paste a suspicious SMS, WhatsApp forward, screenshot, or website link into the scanner.
            </p>
          </div>

          <div style={{ padding: '20px', borderRadius: '18px', backgroundColor: '#FFFDFB', border: '1px solid rgba(37, 43, 69, 0.06)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#A9D6F5', color: '#1A4D7A', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              2
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Hybrid AI Analysis</h4>
            <p style={{ fontSize: '0.88rem', color: '#777B91', margin: 0 }}>
              The engine matches syntactic rules and n-gram linguistic features to calculate a risk score.
            </p>
          </div>

          <div style={{ padding: '20px', borderRadius: '18px', backgroundColor: '#FFFDFB', border: '1px solid rgba(37, 43, 69, 0.06)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#B8E8CF', color: '#2E855D', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              3
            </div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Understand with Ghosts</h4>
            <p style={{ fontSize: '0.88rem', color: '#777B91', margin: 0 }}>
              Each red flag appears as an animated cartoon ghost with plain-language action guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
