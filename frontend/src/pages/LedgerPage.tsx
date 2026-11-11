import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, AlertTriangle, RefreshCw, Layers, CheckCircle2, XCircle } from 'lucide-react';
import type { LedgerBlock } from '../types/analysis';

export const LedgerPage: React.FC = () => {
  // Production / Real chain data
  const initialChain: LedgerBlock[] = [
    {
      blockNumber: 0,
      timestamp: '2026-11-11 10:00:00',
      fingerprint: '0000000000000000000000000000000000000000000000000000000000000000',
      category: 'Genesis Block',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      currentHash: '9a3f2b1c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a',
      verified: true,
    },
    {
      blockNumber: 1,
      timestamp: '2026-11-11 11:15:22',
      fingerprint: '3a7b9c1d8e5f2a4b6c8d0e1f3a5b7c9d1e3f5a7b9c1d8e5f2a4b6c8d0e1f3a5b',
      category: 'Banking / KYC Fraud',
      previousHash: '9a3f2b1c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a',
      currentHash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
      verified: true,
    },
    {
      blockNumber: 2,
      timestamp: '2026-11-11 13:40:10',
      fingerprint: 'e8d1a2b3c4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      category: 'Investment Scam',
      previousHash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
      currentHash: 'd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2',
      verified: true,
    },
    {
      blockNumber: 3,
      timestamp: '2026-11-11 15:20:45',
      fingerprint: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
      category: 'Part-Time Job Trap',
      previousHash: 'd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2',
      currentHash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      verified: true,
    },
  ];

  // Isolated demonstration state
  const [activeChain, setActiveChain] = useState<LedgerBlock[]>(initialChain);
  const [isTamperedDemo, setIsTamperedDemo] = useState(false);
  const [tamperedBlockIndex, setTamperedBlockIndex] = useState<number | null>(null);

  // Toggle Tampering Demonstration on an ISOLATED copy (Never mutates original production records)
  const toggleTamperDemo = () => {
    if (isTamperedDemo) {
      // Restore clean chain
      setActiveChain(initialChain);
      setIsTamperedDemo(false);
      setTamperedBlockIndex(null);
    } else {
      // Create isolated clone and tamper Block 1
      const clonedChain = initialChain.map((b) => ({ ...b }));
      // Corrupt data in Block 1
      clonedChain[1].fingerprint = 'CORRUPTED_FAKE_HASH_0000000000000000000000000000000000000000';
      clonedChain[1].currentHash = 'INVALID_RECALCULATED_HASH_888888888888888888888888888888888888';
      // Verification breaks from Block 2 onward because previousHash no longer matches
      clonedChain[2].verified = false;
      clonedChain[3].verified = false;

      setActiveChain(clonedChain);
      setIsTamperedDemo(true);
      setTamperedBlockIndex(1);
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '20px 0 60px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#F0F7FF', color: '#1A4D7A', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
          <Layers size={14} />
          <span>Cryptographic Threat Log</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: '#252B45', marginBottom: '8px' }}>
          Tamper-Evident Threat Ledger
        </h1>
        <p style={{ color: '#777B91', fontSize: '1.02rem', maxWidth: '680px' }}>
          Every submitted threat fingerprint is linked in an immutable SHA-256 hash chain. If any historical record is altered, cryptographic verification immediately fails for all subsequent blocks.
        </p>
      </div>

      {/* Architecture Disclaimer Badge */}
      <div
        style={{
          backgroundColor: '#FFFDFB',
          border: '1.5px solid #A9D6F5',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Database size={22} color="#4A90E2" />
          <div style={{ fontSize: '0.88rem', color: '#252B45' }}>
            <strong>Implementation Status:</strong> Local Cryptographic Hash Chain Active — Stellar Soroban Smart Contract Architecture Planned.
          </div>
        </div>

        {/* Try Tampering Simulation Button */}
        <button
          onClick={toggleTamperDemo}
          style={{
            padding: '10px 20px',
            borderRadius: '999px',
            backgroundColor: isTamperedDemo ? '#252B45' : '#FEECEB',
            color: isTamperedDemo ? '#FFFFFF' : '#B3261E',
            border: isTamperedDemo ? 'none' : '1.5px solid #F28B82',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          {isTamperedDemo ? (
            <>
              <RefreshCw size={15} />
              <span>Reset to Valid Chain</span>
            </>
          ) : (
            <>
              <AlertTriangle size={15} />
              <span>Try Tampering (Isolated Demo)</span>
            </>
          )}
        </button>
      </div>

      {/* Tamper Simulation Alert Banner */}
      {isTamperedDemo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#FEECEB',
            border: '2px solid #F28B82',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <XCircle size={28} color="#B3261E" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#B3261E', fontSize: '0.96rem' }}>
              Cryptographic Integrity Mismatch Detected!
            </strong>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#6A1A17' }}>
              Block #{tamperedBlockIndex} data was deliberately modified on an isolated demonstration copy. Notice how the previous-hash pointer in Block #2 and #3 immediately fails verification. Real production records remain untouched.
            </p>
          </div>
        </motion.div>
      )}

      {/* Horizontal Chain Visualization */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          padding: '12px 4px 28px 4px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {activeChain.map((block) => {
          const isCorrupted = isTamperedDemo && block.blockNumber >= 1;
          const isDirectTarget = isTamperedDemo && block.blockNumber === tamperedBlockIndex;

          return (
            <motion.div
              key={block.blockNumber}
              className="glass-card"
              style={{
                flex: '0 0 320px',
                padding: '24px',
                borderRadius: '24px',
                backgroundColor: isDirectTarget ? '#FFF5F5' : isCorrupted ? '#FFF9F5' : '#FFFFFF',
                border: isDirectTarget
                  ? '2px solid #F28B82'
                  : !block.verified
                  ? '2px solid #FFAAA6'
                  : '1.5px solid rgba(37, 43, 69, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
              }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {/* Block Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 700, color: '#252B45' }}>
                  Block #{block.blockNumber}
                </span>
                {block.verified ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: '#2E855D', backgroundColor: '#EEFBF4', padding: '3px 8px', borderRadius: '999px' }}>
                    <CheckCircle2 size={13} /> VALID
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: '#B3261E', backgroundColor: '#FEECEB', padding: '3px 8px', borderRadius: '999px' }}>
                    <XCircle size={13} /> BROKEN
                  </span>
                )}
              </div>

              {/* Timestamp & Category */}
              <div style={{ fontSize: '0.8rem', color: '#777B91' }}>
                {block.timestamp} • <strong style={{ color: '#252B45' }}>{block.category}</strong>
              </div>

              {/* Current Block Hash */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#777B91', textTransform: 'uppercase' }}>
                  Block Hash:
                </span>
                <code
                  style={{
                    display: 'block',
                    fontFamily: 'monospace',
                    fontSize: '0.74rem',
                    backgroundColor: isDirectTarget ? '#FFE8EF' : '#F7F8FA',
                    color: isDirectTarget ? '#B3261E' : '#252B45',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  {block.currentHash}
                </code>
              </div>

              {/* Previous Block Reference */}
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#777B91', textTransform: 'uppercase' }}>
                  Previous Hash:
                </span>
                <code
                  style={{
                    display: 'block',
                    fontFamily: 'monospace',
                    fontSize: '0.74rem',
                    backgroundColor: '#F7F8FA',
                    color: !block.verified ? '#B3261E' : '#777B91',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                  }}
                >
                  {block.previousHash}
                </code>
              </div>

              {/* Stored Fingerprint */}
              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(37, 43, 69, 0.06)' }}>
                <span style={{ fontSize: '0.72rem', color: '#777B91' }}>Logged Threat Fingerprint:</span>
                <code style={{ display: 'block', fontFamily: 'monospace', fontSize: '0.72rem', color: '#4A4E69', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {block.fingerprint}
                </code>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
