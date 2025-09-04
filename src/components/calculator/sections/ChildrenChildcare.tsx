import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import NumberInput from '../NumberInput';
import { formatCurrency, formatChange } from '../utils';

export interface ChildrenChildcareProps {
  numberOfChildren: number;
  setNumberOfChildren: (v: number) => void;
  childrenAtRiskCount: number;
  setChildrenAtRiskCount: (v: number) => void;
  avgHourlyRate: string;
  setAvgHourlyRate: (v: string) => void;
  results?: any;
}

export default function ChildrenChildcare({ numberOfChildren, setNumberOfChildren, childrenAtRiskCount, setChildrenAtRiskCount, avgHourlyRate, setAvgHourlyRate, results }: ChildrenChildcareProps) {
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 flex items-center gap-3 text-lg">
        <div className="p-2 bg-white/10 rounded-lg"><PieIcon size={20} className="text-secondary" /></div>
        Children & Childcare
      </h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="label"><span className="label-text">Number of Children (for Child Benefit & UC)</span></label>
          <input type="number" value={numberOfChildren} onChange={(e) => setNumberOfChildren(Math.max(0, Number(e.target.value) || 0))} className="input input-bordered w-full bg-white/5 border-white/20" />
        </div>
        <div>
          <label className="label"><span className="label-text">Children eligible for free childcare (lost if ANI &gt; £100k)</span></label>
          <input type="number" value={childrenAtRiskCount} onChange={(e) => setChildrenAtRiskCount(Math.max(0, Number(e.target.value) || 0))} className="input input-bordered w-full bg-white/5 border-white/20" />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Avg hourly childcare rate (£)</span></label>
          <NumberInput value={avgHourlyRate} onChange={setAvgHourlyRate} placeholder="8.50" step="0.1" />
        </div>
      </div>
      {results && (
        <div className="mt-4 text-sm text-white/80 grid md:grid-cols-2 gap-3">
          <div className="flex justify-between"><span>Free childcare value (annual)</span><span className="font-medium">{formatCurrency(results.childcare.after.freeChildcareAnnual || 0)}</span></div>
          {childrenAtRiskCount > 0 && (results.childcare.before.freeChildcareAnnual || 0) !== (results.childcare.after.freeChildcareAnnual || 0) && (
            <div className="flex justify-between text-warning"><span>Change in free childcare</span><span className="font-medium">{formatChange((results.childcare.after.freeChildcareAnnual || 0) - (results.childcare.before.freeChildcareAnnual || 0))}</span></div>
          )}
        </div>
      )}
    </section>
  );
}
