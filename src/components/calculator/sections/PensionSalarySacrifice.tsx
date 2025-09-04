import React from 'react';
import { TrendingUp, PoundSterling } from 'lucide-react';
import NumberInput from '../NumberInput';
import { copyToClipboard } from '../utils';

export interface PensionSalarySacrificeProps {
  sacrificeType: 'percent' | 'target';
  setSacrificeType: (v: 'percent' | 'target') => void;
  sacrificePercent: string;
  setSacrificePercent: (v: string) => void;
  targetAmount: string;
  setTargetAmount: (v: string) => void;
  carryForwardAllowance: string;
  setCarryForwardAllowance: (v: string) => void;
  percentNeededForTarget: number;
}

export default function PensionSalarySacrifice(props: PensionSalarySacrificeProps) {
  const { sacrificeType, setSacrificeType, sacrificePercent, setSacrificePercent, targetAmount, setTargetAmount, carryForwardAllowance, setCarryForwardAllowance, percentNeededForTarget } = props;
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 flex items-center gap-3 text-lg">
        <div className="p-2 bg-success/20 rounded-lg"><TrendingUp size={20} className="text-success" /></div>
        Pension Salary Sacrifice
      </h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label"><span className="label-text">Sacrifice Type</span></label>
          <select value={sacrificeType} onChange={(e) => setSacrificeType(e.target.value as any)} className="select select-bordered w-full bg-white/5 border-white/20">
            <option value="percent">Percentage (%)</option>
            <option value="target">Total amount desired into pension plan</option>
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">{sacrificeType === 'percent' ? 'Percentage of Salary' : 'Target Total Pension'}</span></label>
          <div className="relative">
            {sacrificeType === 'percent' ? (
              <>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">%</span>
                <NumberInput value={sacrificePercent} onChange={setSacrificePercent} placeholder="6" step="0.1" className="pr-10" />
              </>
            ) : (
              <>
                <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <NumberInput value={targetAmount} onChange={setTargetAmount} placeholder="6000" className="pl-10" />
              </>
            )}
          </div>
        </div>
      </div>
      {sacrificeType === 'target' && (
        <div className="mt-4 block-stable">
          <div className="alert alert-info glass items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-primary/30 border border-primary/50 text-white text-xs font-semibold uppercase tracking-wide">HR percentage</span>
              <span className="text-sm text-white/90">To hit your target, sacrifice</span>
              <span className="font-bold text-primary text-lg">{percentNeededForTarget.toFixed(2)}%</span>
              <span className="text-sm text-white/90">of salary.</span>
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => copyToClipboard(`${percentNeededForTarget.toFixed(2)}%`)}>
              Copy
            </button>
          </div>
          <p className="text-xs opacity-70 mt-2">Includes employer NI pass-through and base contribution in the maths.</p>
        </div>
      )}
      <div className="mt-5 grid md:grid-cols-2 gap-5">
        <div>
          <label className="label"><span className="label-text">Carry forward allowance available</span></label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <NumberInput value={carryForwardAllowance} onChange={setCarryForwardAllowance} placeholder="0" className="pl-10" />
          </div>
          <p className="text-xs opacity-60 mt-1">If you have unused allowance from prior 3 years, add it here. We include it in the annual limit check.</p>
        </div>
      </div>
    </section>
  );
}
