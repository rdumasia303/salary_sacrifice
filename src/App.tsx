import React from 'react';
import UKPensionCalculator from './components/UKPensionCalculator';
import { PiggyBank, ShieldAlert } from 'lucide-react';
import IntroPanel from './components/IntroPanel';

export default function App() {
  return (
    <div className="min-h-screen gradient-aurora text-white relative bg-techgrid">
      {/* Cyberpunk scanline overlay */}
      <div className="scanlines" aria-hidden />

      {/* Disclaimer Ribbon */}
      <div className="w-full bg-warning/20 border-b border-warning/30 text-warning text-center text-xs py-2 tracking-wide font-monoTech">
        <ShieldAlert className="inline mr-1" size={14} /> This is not financial advice. Double-check your numbers and policies with HR/Payroll.
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-base-100/70 backdrop-blur border-b border-primary/30">
        <div className="w-full max-w-none px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/40 neon-primary animate-glowpulse">
              <PiggyBank className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide font-display">Salary Sacrifice Playground</h1>
              <p className="text-s text-white/70 -mt-0.5 font-monoTech">Pensions • EVs • Cycle to Work • Tax Year 2025/26</p>
            </div>
          </div>
          <a
            className="btn btn-sm btn-primary btn-outline"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            Star on GitHub
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="w-full max-w-none px-8 py-8">
        <IntroPanel />
        <div className="corner-accent">
          <UKPensionCalculator />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-white/50 font-monoTech">
        This tool is for illustration only and may be wrong. Speak to a qualified professional. Not financial advice.
      </footer>
    </div>
  );
}
