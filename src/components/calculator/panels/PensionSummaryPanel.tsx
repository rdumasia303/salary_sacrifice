import React from 'react';
import clsx from 'clsx';
import { formatCurrency } from '../utils';

interface PensionSummaryPanelProps {
  amount: number;
  employerBase: number;
  employerPassthrough: number;
  totalFunding: number;
  otherPensionsNet: number;
  otherPensionsGross: number;
  totalContribs: number;
  remainingAllowance: number;
  marginalRate: number;
}

export default function PensionSummaryPanel({
  amount,
  employerBase,
  employerPassthrough,
  totalFunding,
  otherPensionsNet,
  otherPensionsGross,
  totalContribs,
  remainingAllowance,
  marginalRate
}: PensionSummaryPanelProps) {
  // Calculate additional relief for higher/additional rate taxpayers
  const additionalReliefRate = Math.max(0, marginalRate - 20);
  const additionalRelief = otherPensionsGross * (additionalReliefRate / 100);

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
        <div className="flex justify-between items-center py-2 bg-white/5 rounded-lg px-4">
          <span className="text-sm font-medium">Salary Sacrifice Total:</span>
          <span className="font-semibold text-secondary">{formatCurrency(totalFunding)}</span>
        </div>

        {otherPensionsNet > 0 && (
          <>
            <div className="border-t border-white/10 my-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Other Pensions (net paid):</span>
                <span className="font-semibold">{formatCurrency(otherPensionsNet)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs opacity-60 pl-2">+ Basic rate relief (auto):</span>
                <span className="text-xs opacity-80">+{formatCurrency(otherPensionsGross - otherPensionsNet)}</span>
              </div>
              {additionalRelief > 0.01 && (
                <div className="flex justify-between items-center mt-1 text-success">
                  <span className="text-xs pl-2">+ Extra relief (claim via SA):</span>
                  <span className="text-xs font-semibold">+{formatCurrency(additionalRelief)}</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-1 py-2 bg-white/5 rounded-lg px-2">
                <span className="text-sm font-medium">Other Pensions Gross:</span>
                <span className="font-semibold">{formatCurrency(otherPensionsGross)}</span>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between items-center py-3 bg-white/10 rounded-lg px-4 font-semibold border-t-2 border-primary/30">
          <span className="text-sm">Total Annual Contributions:</span>
          <span className="text-lg text-primary">{formatCurrency(totalContribs)}</span>
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
