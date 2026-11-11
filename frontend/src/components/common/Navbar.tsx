import React, { useState } from 'react';
import { Shield, Sparkles, Globe, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  language,
  onToggleLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'scanner', label: language === 'hi' ? 'स्कैनर' : 'Scan' },
    { id: 'intel', label: language === 'hi' ? 'कम्युनिटी अलर्ट' : 'Community Threats' },
    { id: 'ledger', label: language === 'hi' ? 'लेजर एक्सप्लोरर' : 'Ledger Explorer' },
    { id: 'about', label: language === 'hi' ? 'ज़िम्मेदार AI' : 'Responsible AI' },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(255, 253, 251, 0.88)',
        borderBottom: '1px solid rgba(37, 43, 69, 0.08)',
        padding: '14px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logo */}
        <button
          onClick={() => onSelectTab('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FFE8EF 0%, #F4A6C1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(244, 166, 193, 0.4)',
              border: '1.5px solid #FFFFFF',
            }}
          >
            <Shield size={22} color="#252B45" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: '#252B45', letterSpacing: '-0.3px' }}>
                Phantom Guard
              </span>
              <Sparkles size={16} color="#F4A6C1" />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#777B91', fontWeight: 500, letterSpacing: '0.2px' }}>
              AI Scam Shield • India
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.94rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#252B45' : '#777B91',
                  backgroundColor: isActive ? '#FFE8EF' : 'transparent',
                  border: isActive ? '1px solid #F4A6C1' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </button>
            );
          })}

          {/* Language Toggle (EN | हिन्दी) */}
          <button
            onClick={onToggleLanguage}
            style={{
              marginLeft: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1.5px solid #A9D6F5',
              backgroundColor: '#F0F7FF',
              color: '#252B45',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
            title="Toggle Language: English / Hindi"
            aria-label="Toggle language"
          >
            <Globe size={15} color="#2B70C9" />
            <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            padding: '8px',
            borderRadius: '8px',
            color: '#252B45',
          }}
          className="mobile-hamburger"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '16px 0 8px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              style={{
                textAlign: 'left',
                padding: '10px 16px',
                borderRadius: '12px',
                backgroundColor: activeTab === item.id ? '#FFE8EF' : 'transparent',
                fontWeight: 600,
                color: '#252B45',
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onToggleLanguage();
              setMobileMenuOpen(false);
            }}
            style={{
              textAlign: 'left',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#2B70C9',
              fontWeight: 600,
            }}
          >
            <Globe size={16} />
            <span>Switch to {language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
