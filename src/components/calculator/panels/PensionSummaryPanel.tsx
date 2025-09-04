import React from 'react';
import clsx from 'clsx';
import { formatCurrency } from '../utils';

interface PensionSummaryPanelProps {
  amount: number;
  employerBase: number;
  employerPassthrough: number;
  totalFunding: number;
  remainingAllowance: number;
}

export default function PensionSummaryPanel({ amount, employerBase, employerPassthrough, totalFunding, remainingAllowance }: PensionSummaryPanelProps) {
  return (
    <div className="glass rounded-xl overflow-hidden neon-secondary">
      <div className="bg-white/10 px-5 py-3 border-b border-white/10">
        <h3 className="font-semibold text-base">Pension Summary</h3>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">Your Sacrifice:</span>
          <span className="font-semibold text-primary">{formatCurrency(amount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">Employer Base Contribution:</span>
          <span className="font-semibold text-secondary">{formatCurrency(employerBase)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">Employer NI Passthrough:</span>
          <span className="font-semibold text-success">{formatCurrency(employerPassthrough)}</span>
        </div>
        <div className="flex justify-between items-center py-3 bg-white/10 rounded-lg px-4 font-semibold">
          <span className="text-sm">Total Annual Funding:</span>
          <span className="text-lg text-secondary">{formatCurrency(totalFunding)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-80">Annual Allowance Remaining:</span>
          <span className={clsx('font-semibold', { 'text-success': remainingAllowance > 0, 'text-error': remainingAllowance <= 0 })}>
            {formatCurrency(remainingAllowance)}
          </span>
        </div>
      </div>
    </div>
  );
}
