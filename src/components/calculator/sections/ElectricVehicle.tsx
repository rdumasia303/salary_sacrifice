import React from 'react';
import { Sparkles, PoundSterling } from 'lucide-react';
import NumberInput from '../NumberInput';

export interface ElectricVehicleProps {
  evEnabled: boolean;
  setEvEnabled: (v: boolean) => void;
  evMonthlyCost: string;
  setEvMonthlyCost: (v: string) => void;
  evNIPassthrough: number;
  setEvNIPassthrough: (v: number) => void;
  results?: any;
}

export default function ElectricVehicle({ evEnabled, setEvEnabled, evMonthlyCost, setEvMonthlyCost, evNIPassthrough, setEvNIPassthrough, results }: ElectricVehicleProps) {
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 flex items-center gap-3 text-lg">
        <div className="p-2 bg-secondary/20 rounded-lg"><Sparkles size={20} className="text-secondary" /></div>
        Electric Vehicle (EV) Scheme
      </h3>
      <div className="flex items-center gap-3 mb-3">
        <input type="checkbox" className="toggle toggle-secondary" checked={evEnabled} onChange={(e) => setEvEnabled(e.target.checked)} />
        <span className="text-sm">Enable EV salary sacrifice</span>
      </div>
      {evEnabled && (
        <div className="grid md:grid-cols-2 gap-5 animate-fadeIn">
          <div>
            <label className="label"><span className="label-text">EV Gross Monthly Deduction</span></label>
            <div className="relative">
              <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <NumberInput value={evMonthlyCost} onChange={setEvMonthlyCost} placeholder="450" className="pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">Employer NI Pass-through: {evNIPassthrough}%</label>
            <input type="range" min={0} max={100} value={evNIPassthrough} className="range range-secondary" onChange={(e) => setEvNIPassthrough(Number(e.target.value))} />
            <div className="flex justify-between text-xs opacity-70 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
          </div>
        </div>
      )}
      {evEnabled && results && (
        <div className="mt-3 text-sm text-white/80 block-stable">
          <div className="flex justify-between"><span>Annual EV Gross</span><span className="font-medium">£{Math.round(results.schemes.ev.gross).toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Employer NI Passthrough</span><span className="font-medium text-secondary">-£{Math.round(results.schemes.ev.employerPassthrough).toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Annual Salary Deduction (net)</span><span className="font-semibold">£{Math.round(results.schemes.ev.net).toLocaleString()}</span></div>
        </div>
      )}
    </section>
  );
}
