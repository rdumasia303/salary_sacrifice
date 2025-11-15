import React from 'react';
import { Calculator } from 'lucide-react';

export interface StudentLoansProps {
  studentUGPlan: 'none' | 'plan1' | 'plan2' | 'plan4';
  setStudentUGPlan: (v: 'none' | 'plan1' | 'plan2' | 'plan4') => void;
  hasPGL: boolean;
  setHasPGL: (v: boolean) => void;
}

export default function StudentLoans({ studentUGPlan, setStudentUGPlan, hasPGL, setHasPGL }: StudentLoansProps) {
  return (
    <section className="glass-deep rounded-xl p-5 corner-accent neon-secondary">
      <h3 className="font-semibold mb-4 flex items-center gap-3 text-lg">
        <div className="p-2 bg-white/10 rounded-lg"><Calculator size={20} className="text-primary" /></div>
        Student Loans (2025/26)
      </h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="form-control">
          <label className="label"><span className="label-text">Undergraduate plan</span></label>
          <select value={studentUGPlan} onChange={(e) => setStudentUGPlan(e.target.value as any)} className="select select-bordered w-full bg-white/5 border-white/20 text-white">
            <option value="none" className="bg-gray-800 text-white">None</option>
            <option value="plan1" className="bg-gray-800 text-white">Plan 1 (older loans)</option>
            <option value="plan2" className="bg-gray-800 text-white">Plan 2 (England/Wales)</option>
            <option value="plan4" className="bg-gray-800 text-white">Plan 4 (Scotland)</option>
          </select>
        </div>
        <div className="form-control justify-end">
          <label className="label cursor-pointer justify-start gap-3">
            <input type="checkbox" checked={hasPGL} onChange={(e) => setHasPGL(e.target.checked)} className="checkbox checkbox-primary" />
            <span className="label-text">Postgraduate Loan (PGL)</span>
          </label>
        </div>
      </div>
      <p className="text-xs opacity-70 mt-3">We apply HMRC per‑period rounding rules and base repayments on NICable pay. Salary sacrifice reduces repayments; personal (non‑sacrifice) pension contributions do not.</p>
    </section>
  );
}
