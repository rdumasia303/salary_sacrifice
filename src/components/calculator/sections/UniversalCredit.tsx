import React from 'react';
import NumberInput from '../NumberInput';

export interface UniversalCreditProps {
  universalCreditEnabled: boolean;
  setUniversalCreditEnabled: (v: boolean) => void;
  hasPartner: boolean;
  setHasPartner: (v: boolean) => void;
  partnerNetSalary: string;
  setPartnerNetSalary: (v: string) => void;
  wantsHousingElement: boolean;
  setWantsHousingElement: (v: boolean) => void;
  housingAllowance: string;
  setHousingAllowance: (v: string) => void;
  householdCapital: string;
  setHouseholdCapital: (v: string) => void;
  parseNumber: (v: any) => number;
}

export default function UniversalCredit(props: UniversalCreditProps) {
  const { universalCreditEnabled, setUniversalCreditEnabled, hasPartner, setHasPartner, partnerNetSalary, setPartnerNetSalary, wantsHousingElement, setWantsHousingElement, housingAllowance, setHousingAllowance, householdCapital, setHouseholdCapital, parseNumber } = props;
  return (
    <div className="mt-5">
      <label className="label cursor-pointer justify-start gap-3">
        <input type="checkbox" checked={universalCreditEnabled} onChange={(e) => setUniversalCreditEnabled(e.target.checked)} className="checkbox checkbox-primary" />
        <span className="label-text">Estimate Universal Credit eligibility</span>
      </label>

      {universalCreditEnabled && (
        <div className="space-y-5 p-5 glass rounded-xl mt-3">
          <div className="alert alert-info/20 text-info">
            ℹ️ Simplified UC estimate. Excludes disability premiums and subject to capital limits.
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" checked={hasPartner} onChange={(e) => setHasPartner(e.target.checked)} className="checkbox checkbox-primary" />
              <span className="label-text">Have a partner/spouse</span>
            </label>
            {hasPartner && (
              <div>
                <label className="label"><span className="label-text">Partner's Net Monthly Salary</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
                  <NumberInput value={partnerNetSalary} onChange={setPartnerNetSalary} placeholder="0" className="pl-10" />
                </div>
              </div>
            )}
            <label className="label cursor-pointer justify-start gap-3">
              <input type="checkbox" checked={wantsHousingElement} onChange={(e) => setWantsHousingElement(e.target.checked)} className="checkbox checkbox-primary" />
              <span className="label-text">Include housing element</span>
            </label>
            {wantsHousingElement && (
              <div>
                <label className="label"><span className="label-text">Local Housing Allowance (Monthly)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
                  <NumberInput value={housingAllowance} onChange={setHousingAllowance} placeholder="0" className="pl-10" />
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="label"><span className="label-text">Household Capital (excluding primary residence)</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-lg">£</span>
                <input type="number" value={householdCapital} onChange={(e) => setHouseholdCapital(e.target.value)} placeholder="0" className="input input-bordered w-full bg-white/5 border-white/20 pl-10" />
              </div>
              {parseNumber(householdCapital) > 16000 && (
                <p className="text-error text-sm mt-2 p-2 bg-error/10 rounded border border-error/20">Capital over £16,000 makes you ineligible for UC</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
