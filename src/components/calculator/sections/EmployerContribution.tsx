import React from 'react';
import NumberInput from '../NumberInput';

export interface EmployerContributionProps {
  employerContribType: 'percent' | 'fixed';
  setEmployerContribType: (v: 'percent' | 'fixed') => void;
  employerContribPercent: string;
  setEmployerContribPercent: (v: string) => void;
  employerContribFixed: string;
  setEmployerContribFixed: (v: string) => void;
  employerNIPassthrough: number;
  setEmployerNIPassthrough: (v: number) => void;
}

export default function EmployerContribution(props: EmployerContributionProps) {
  const { employerContribType, setEmployerContribType, employerContribPercent, setEmployerContribPercent, employerContribFixed, setEmployerContribFixed, employerNIPassthrough, setEmployerNIPassthrough } = props;
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 text-lg">Employer Contribution</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label"><span className="label-text">Base Contribution Type</span></label>
          <select value={employerContribType} onChange={(e) => setEmployerContribType(e.target.value as any)} className="select select-bordered w-full bg-white/5 border-white/20 text-white">
            <option value="percent" className="bg-gray-800 text-white">Percentage of Salary</option>
            <option value="fixed" className="bg-gray-800 text-white">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">{employerContribType === 'percent' ? 'Percentage' : 'Annual Amount'}</span></label>
          <div className="relative">
            {employerContribType === 'percent' ? (
              <>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">%</span>
                <NumberInput value={employerContribPercent} onChange={setEmployerContribPercent} placeholder="3" step="0.1" className="pr-10" />
              </>
            ) : (
              <>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
                <NumberInput value={employerContribFixed} onChange={setEmployerContribFixed} placeholder="1500" className="pl-10" />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <label className="block text-sm mb-2">Employer NI Pass-through (lobby for it!): {employerNIPassthrough}%</label>
        <input type="range" min={0} max={100} value={employerNIPassthrough} className="range range-primary" onChange={(e) => setEmployerNIPassthrough(Number(e.target.value))} />
        <div className="flex justify-between text-xs opacity-70 mt-1"><span>0%</span><span>50%</span><span>100%</span></div>
      </div>
    </section>
  );
}
