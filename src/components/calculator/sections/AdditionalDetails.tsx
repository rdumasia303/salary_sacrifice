import React from 'react';
import NumberInput from '../NumberInput';

export interface AdditionalDetailsProps {
  benefitsInKind: string;
  setBenefitsInKind: (v: string) => void;
  additionalPAYEIncome: string;
  setAdditionalPAYEIncome: (v: string) => void;
  otherPensions: string;
  setOtherPensions: (v: string) => void;
  mpaaTriggered: boolean;
  setMpaaTriggered: (v: boolean) => void;
}

export default function AdditionalDetails({ benefitsInKind, setBenefitsInKind, additionalPAYEIncome, setAdditionalPAYEIncome, otherPensions, setOtherPensions, mpaaTriggered, setMpaaTriggered }: AdditionalDetailsProps) {
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 text-lg">Additional Details</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="label"><span className="label-text">Benefits in Kind (Annual)</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
            <NumberInput value={benefitsInKind} onChange={setBenefitsInKind} placeholder="0" className="pl-10" />
          </div>
        </div>
        <div>
          <label className="label"><span className="label-text">Additional PAYE income (e.g. RSUs) – Annual</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
            <NumberInput value={additionalPAYEIncome} onChange={setAdditionalPAYEIncome} placeholder="0" className="pl-10" />
          </div>
        </div>
        <div>
          <label className="label"><span className="label-text">Other Pension Contributions (Annual)</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
            <NumberInput value={otherPensions} onChange={setOtherPensions} placeholder="0" className="pl-10" />
          </div>
        </div>
        <div className="form-control justify-center">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" checked={mpaaTriggered} onChange={(e) => setMpaaTriggered(e.target.checked)} className="checkbox checkbox-primary" />
            <span className="label-text">MPAA Triggered (£10k limit)</span>
          </label>
        </div>
      </div>
    </section>
  );
}
