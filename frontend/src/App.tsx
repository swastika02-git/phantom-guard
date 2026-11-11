import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { ScannerTab } from './components/scanner/ScannerTab';
import { ResultsView } from './components/results/ResultsView';
import { IntelPage } from './pages/IntelPage';
import { LedgerPage } from './pages/LedgerPage';
import { AboutPage } from './pages/AboutPage';
import type { AnalysisResult } from './types/analysis';
import './styles/main.css';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [activeResult, setActiveResult] = useState<AnalysisResult | null>(null);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleStartScanning = () => {
    setActiveResult(null);
    setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyzeComplete = (result: AnalysisResult) => {
    setActiveResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetScan = () => {
    setActiveResult(null);
  };

  const handleNavigateToLedger = (_fingerprint: string) => {
    setActiveTab('ledger');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="phantom-guard-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background Animated Ambient Blobs */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="ambient-blob ambient-blob-1" />
        <div className="ambient-blob ambient-blob-2" />
        <div className="ambient-blob ambient-blob-3" />
      </div>

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'scanner') {
            setActiveResult(null);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '30px 24px', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                onStartScanning={handleStartScanning}
                language={language}
              />
            </motion.div>
          )}

          {activeTab === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {activeResult ? (
                <ResultsView
                  result={activeResult}
                  onReset={handleResetScan}
                  onNavigateToLedger={handleNavigateToLedger}
                />
              ) : (
                <ScannerTab
                  onAnalyzeStart={() => {}}
                  onAnalyzeComplete={handleAnalyzeComplete}
                  language={language}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'intel' && (
            <motion.div
              key="intel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <IntelPage />
            </motion.div>
          )}

          {activeTab === 'ledger' && (
            <motion.div
              key="ledger"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LedgerPage />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AboutPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
