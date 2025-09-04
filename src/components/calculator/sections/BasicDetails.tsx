import React from 'react';
import { Info, PoundSterling } from 'lucide-react';
import NumberInput from '../NumberInput';

export interface BasicDetailsProps {
  region: 'englandWalesNI' | 'scotland';
  setRegion: (r: 'englandWalesNI' | 'scotland') => void;
  ageGroup: 'adult' | 'young' | 'apprentice';
  setAgeGroup: (a: 'adult' | 'young' | 'apprentice') => void;
  annualSalary: string;
  setAnnualSalary: (v: string) => void;
  contractualHours: string;
  setContractualHours: (v: string) => void;
  applyToBonus: boolean;
  setApplyToBonus: (v: boolean) => void;
  bonusAmount: string;
  setBonusAmount: (v: string) => void;
}

export default function BasicDetails(props: BasicDetailsProps) {
  const { region, setRegion, ageGroup, setAgeGroup, annualSalary, setAnnualSalary, contractualHours, setContractualHours, applyToBonus, setApplyToBonus, bonusAmount, setBonusAmount } = props;
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 flex items-center gap-3 text-lg">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Info size={20} className="text-primary" />
        </div>
        Basic Details
      </h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label"><span className="label-text">Tax Region</span></label>
          <select value={region} onChange={(e) => setRegion(e.target.value as any)} className="select select-bordered w-full bg-white/5 border-white/20">
            <option value="englandWalesNI">England, Wales & Northern Ireland</option>
            <option value="scotland">Scotland</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Age Group</span></label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as any)} className="select select-bordered w-full bg-white/5 border-white/20">
            <option value="adult">21+ years (Adult rate)</option>
            <option value="young">18-20 years</option>
            <option value="apprentice">Under 18 / Apprentice</option>
          </select>
        </div>
        <div>
          <label className="label"><span className="label-text">Annual Base Salary</span></label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <NumberInput value={annualSalary} onChange={setAnnualSalary} placeholder="50000" className="pl-10" />
          </div>
        </div>
        <div>
          <label className="label"><span className="label-text">Weekly Contractual Hours</span></label>
          <NumberInput value={contractualHours} onChange={setContractualHours} placeholder="37.5" step="0.1" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <input type="checkbox" className="toggle toggle-primary" checked={applyToBonus} onChange={(e) => setApplyToBonus(e.target.checked)} />
        <span className="text-sm">Include bonus in salary sacrifice</span>
      </div>
      {applyToBonus && (
        <div className="mt-4">
          <label className="label"><span className="label-text">Annual Bonus</span></label>
          <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <NumberInput value={bonusAmount} onChange={setBonusAmount} placeholder="0" className="pl-10" />
          </div>
        </div>
      )}
    </section>
  );
}
