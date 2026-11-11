import React, { useState } from 'react';
import { Search, ShieldAlert, Database, Clock } from 'lucide-react';

export const IntelPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const demoThreats = [
    {
      id: 'TH-1029',
      fingerprint: '3a7b9c1d8e5f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d8e5f2a4b6c8d0e1f3a5b',
      category: 'Banking / KYC',
      snippet: 'Aapka SBI account suspend hone wala hai, turant update karein...',
      reportCount: 142,
      firstReported: '2 hours ago',
      severity: 'critical',
      isDemo: true,
    },
    {
      id: 'TH-1028',
      fingerprint: 'e8d1a2b3c4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      category: 'Investment Scam',
      snippet: 'Join Telegram VIP group, 100% guaranteed double returns within 24h...',
      reportCount: 89,
      firstReported: '5 hours ago',
      severity: 'high',
      isDemo: true,
    },
    {
      id: 'TH-1027',
      fingerprint: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      category: 'Fake Job Offer',
      snippet: 'Work from home liking videos, daily payout ₹4000. Send ₹500 fee...',
      reportCount: 63,
      firstReported: '1 day ago',
      severity: 'high',
      isDemo: true,
    },
    {
      id: 'TH-1026',
      fingerprint: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
      category: 'Electricity Bill Fraud',
      snippet: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM...',
      reportCount: 215,
      firstReported: '2 days ago',
      severity: 'critical',
      isDemo: true,
    },
  ];

  const filteredThreats = demoThreats.filter((threat) => {
    const matchesSearch =
      threat.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.fingerprint.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || threat.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '20px 0 60px 0' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#FEECEB', color: '#B3261E', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
          <ShieldAlert size={14} />
          <span>Active Threat Intelligence</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: '#252B45', marginBottom: '8px' }}>
          Community Scam Watch
        </h1>
        <p style={{ color: '#777B91', fontSize: '1.02rem', maxWidth: '640px' }}>
          Real-time aggregated threat patterns flagged by Indian users. View fingerprints, recurring scam vectors, and report frequency.
        </p>
      </div>

      {/* Honest Data Transparency Banner */}
      <div
        style={{
          backgroundColor: '#FFF9E6',
          border: '1.5px solid #FFD166',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Database size={24} color="#B37D00" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.88rem', color: '#664D00' }}>
          <strong>Transparency Notice:</strong> The threat indicators displayed below represent curated Indian scam patterns loaded for Phase 1 verification and demonstration. In Phase 5, this view syncs with the live cryptographic hash chain.
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          alignItems: 'center',
        }}
      >
        {/* Search Bar */}
        <div
          style={{
            flex: '1 1 300px',
            position: 'relative',
          }}
        >
          <Search size={18} color="#777B91" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by keyword, category, or SHA-256 fingerprint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              borderRadius: '999px',
              border: '1.5px solid rgba(37, 43, 69, 0.12)',
              backgroundColor: '#FFFFFF',
              fontSize: '0.92rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'banking', 'investment', 'job', 'electricity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                backgroundColor: selectedCategory === cat ? '#252B45' : '#FFFFFF',
                color: selectedCategory === cat ? '#FFFFFF' : '#777B91',
                border: '1px solid rgba(37, 43, 69, 0.1)',
                transition: 'all 0.2s ease',
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Threat Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            className="glass-card"
            style={{
              padding: '22px 24px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', backgroundColor: threat.severity === 'critical' ? '#FEECEB' : '#FFF9E6', color: threat.severity === 'critical' ? '#B3261E' : '#B37D00' }}>
                  {threat.category}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#777B91', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {threat.firstReported}
                </span>
                <span style={{ fontSize: '0.72rem', backgroundColor: '#F0F7FF', color: '#2B70C9', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                  DEMO DATA
                </span>
              </div>

              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#B3261E' }}>
                {threat.reportCount} reports logged
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.95rem', color: '#252B45', fontWeight: 500 }}>
              &ldquo;{threat.snippet}&rdquo;
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#777B91', overflow: 'hidden' }}>
              <span style={{ fontWeight: 600 }}>SHA-256 Fingerprint:</span>
              <code style={{ fontFamily: 'monospace', backgroundColor: '#F7F8FA', padding: '2px 8px', borderRadius: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {threat.fingerprint}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
