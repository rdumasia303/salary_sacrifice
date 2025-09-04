import React from 'react';
import { Sparkles, PoundSterling } from 'lucide-react';
import NumberInput from '../NumberInput';

export interface CycleToWorkProps {
  cycleEnabled: boolean;
  setCycleEnabled: (v: boolean) => void;
  cycleAnnualCost: string;
  setCycleAnnualCost: (v: string) => void;
  cycleNIPassthrough: number;
  setCycleNIPassthrough: (v: number) => void;
  results?: any;
}

export default function CycleToWork({ cycleEnabled, setCycleEnabled, cycleAnnualCost, setCycleAnnualCost, cycleNIPassthrough, setCycleNIPassthrough, results }: CycleToWorkProps) {
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 flex items-center gap-3 text-lg">
        <div className="p-2 bg-accent/20 rounded-lg"><Sparkles size={20} className="text-accent" /></div>
        Cycle to Work Scheme
      </h3>
      <div className="flex items-center gap-3 mb-3">
        <input type="checkbox" className="toggle toggle-accent" checked={cycleEnabled} onChange={(e) => setCycleEnabled(e.target.checked)} />
        <span className="text-sm">Enable Cycle to Work</span>
      </div>
      {cycleEnabled && (
        <div className="grid md:grid-cols-2 gap-5 animate-fadeIn">
          <div>
            <label className="label"><span className="label-text">Cycle Gross Annual Deduction</span></label>
            <div className="relative">
              <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <NumberInput value={cycleAnnualCost} onChange={setCycleAnnualCost} placeholder="1200" className="pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Employer NI Pass-through: {cycleNIPassthrough}%</label>
            <input type="range" min={0} max={100} value={cycleNIPassthrough} className="range range-accent" onChange={(e) => setCycleNIPassthrough(Number(e.target.value))} />
            <div className="flex justify-between text-xs opacity-70 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
          </div>
        </div>
      )}
      {cycleEnabled && results && (
        <div className="mt-3 text-sm text-white/80 block-stable">
          <div className="flex justify-between"><span>Annual Cycle Gross</span><span className="font-medium">£{Math.round(results.schemes.cycle.gross).toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Employer NI Passthrough</span><span className="font-medium text-accent">-£{Math.round(results.schemes.cycle.employerPassthrough).toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Annual Salary Deduction (net)</span><span className="font-semibold">£{Math.round(results.schemes.cycle.net).toLocaleString()}</span></div>
        </div>
      )}
    </section>
  );
}
