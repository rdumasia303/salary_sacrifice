import React from 'react';
import NumberInput from '../NumberInput';
import { HelpCircle } from 'lucide-react';

export interface AdditionalDetailsProps {
  benefitsInKind: string;
  setBenefitsInKind: (v: string) => void;
  additionalPAYEIncome: string;
  setAdditionalPAYEIncome: (v: string) => void;
  otherPensions: string;
  setOtherPensions: (v: string) => void;
  giftAid: string;
  setGiftAid: (v: string) => void;
  mpaaTriggered: boolean;
  setMpaaTriggered: (v: boolean) => void;
}

export default function AdditionalDetails({ benefitsInKind, setBenefitsInKind, additionalPAYEIncome, setAdditionalPAYEIncome, otherPensions, setOtherPensions, giftAid, setGiftAid, mpaaTriggered, setMpaaTriggered }: AdditionalDetailsProps) {
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
          <label className="label">
            <span className="label-text flex items-center gap-2">
              Other Pension Contributions (Net Payment)
              <div className="dropdown dropdown-hover dropdown-end">
                <label tabIndex={0}>
                  <HelpCircle size={16} className="text-info cursor-help" />
                </label>
                <div tabIndex={0} className="dropdown-content z-[1] card compact glass-deep border border-info/30 w-80 p-4 shadow-xl">
                  <p className="text-xs leading-relaxed">
                    Enter the <strong>net amount you pay</strong> into other pensions (e.g., SIPP, personal pension).
                    The basic rate tax relief is added automatically (grossed up to 125%). Higher/additional rate taxpayers
                    can claim extra relief via self-assessment. This reduces your adjusted net income.
                  </p>
                </div>
              </div>
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
            <NumberInput value={otherPensions} onChange={setOtherPensions} placeholder="0" className="pl-10" />
          </div>
        </div>
        <div>
          <label className="label">
            <span className="label-text flex items-center gap-2">
              Gift Aid Donations (Net Donation)
              <div className="dropdown dropdown-hover dropdown-end">
                <label tabIndex={0}>
                  <HelpCircle size={16} className="text-info cursor-help" />
                </label>
                <div tabIndex={0} className="dropdown-content z-[1] card compact glass-deep border border-info/30 w-80 p-4 shadow-xl">
                  <p className="text-xs leading-relaxed">
                    Enter the <strong>net amount you donate</strong> under Gift Aid. The charity claims basic rate tax relief
                    (making your £100 worth £125 to them). Higher/additional rate taxpayers can claim back the difference
                    (20% or 25% of the gross). This reduces your adjusted net income for tax thresholds.
                  </p>
                </div>
              </div>
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
            <NumberInput value={giftAid} onChange={setGiftAid} placeholder="0" className="pl-10" />
          </div>
        </div>
        <div className="form-control justify-center md:col-span-2">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" checked={mpaaTriggered} onChange={(e) => setMpaaTriggered(e.target.checked)} className="checkbox checkbox-primary" />
            <span className="label-text">MPAA Triggered (£10k limit)</span>
          </label>
        </div>
      </div>
    </section>
  );
}
