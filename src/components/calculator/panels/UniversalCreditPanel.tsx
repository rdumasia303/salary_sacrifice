import React from 'react';
import { formatCurrency } from '../utils';

interface UniversalCreditPanelProps {
  scenario: 'before' | 'after';
  maxAward: number;
  standardAllowance: number;
  childElement: number;
  numberOfChildren: number;
  housingElement: number;
  childcareElement: number;
  workAllowance: number;
  householdNetIncome: number;
  countedEarnings: number;
  taperRate: number;
  reduction: number;
  finalAward: number;
}

export default function UniversalCreditPanel(props: UniversalCreditPanelProps) {
  const {
    scenario,
    maxAward,
    standardAllowance,
    childElement,
    numberOfChildren,
    housingElement,
    childcareElement,
    workAllowance,
    householdNetIncome,
    countedEarnings,
    taperRate,
    reduction,
    finalAward
  } = props;

  return (
    <div className="glass rounded-xl overflow-hidden neon-accent">
      <div className="px-5 py-3 border-b border-white/10 bg-white/5">
        <h3 className="font-semibold text-base">Universal Credit Breakdown ({scenario === 'before' ? 'Before' : 'After'} Sacrifice)</h3>
        <p className="text-xs text-white/60 mt-1">Detailed calculation showing how UC is computed</p>
      </div>
      <div className="p-5 space-y-4">
        {/* Maximum Award Calculation */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="font-semibold text-sm text-primary mb-3">1. Maximum Award (monthly)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Standard allowance</span>
              <span className="font-mono">{formatCurrency(standardAllowance)}</span>
            </div>
            {numberOfChildren > 0 && (
              <div className="flex justify-between">
                <span className="text-white/70">Child element ({numberOfChildren} × £{childElement.toFixed(2)})</span>
                <span className="font-mono">{formatCurrency(childElement * numberOfChildren)}</span>
              </div>
            )}
            {housingElement > 0 && (
              <div className="flex justify-between">
                <span className="text-white/70">Housing element</span>
                <span className="font-mono">{formatCurrency(housingElement)}</span>
              </div>
            )}
            {childcareElement > 0 && (
              <div className="flex justify-between">
                <span className="text-white/70">Childcare element</span>
                <span className="font-mono">{formatCurrency(childcareElement)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/20 flex justify-between font-semibold">
              <span>Maximum award</span>
              <span className="font-mono text-primary">{formatCurrency(maxAward)}</span>
            </div>
          </div>
        </div>

        {/* Income Assessment */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="font-semibold text-sm text-secondary mb-3">2. Income Assessment (monthly)</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Household net income</span>
              <span className="font-mono">{formatCurrency(householdNetIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Less: Work allowance</span>
              <span className="font-mono">- {formatCurrency(workAllowance)}</span>
            </div>
            <div className="pt-2 border-t border-white/20 flex justify-between font-semibold">
              <span>Counted earnings</span>
              <span className="font-mono text-warning">{formatCurrency(countedEarnings)}</span>
            </div>
          </div>
        </div>

        {/* Taper Calculation */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <h4 className="font-semibold text-sm text-accent mb-3">3. Taper Reduction</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Counted earnings</span>
              <span className="font-mono">{formatCurrency(countedEarnings)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Taper rate</span>
              <span className="font-mono">{(taperRate * 100).toFixed(0)}%</span>
            </div>
            <div className="pt-2 border-t border-white/20 flex justify-between font-semibold">
              <span>Reduction amount</span>
              <span className="font-mono text-error">- {formatCurrency(reduction)}</span>
            </div>
          </div>
        </div>

        {/* Final Award */}
        <div className="bg-primary/10 rounded-lg p-4 border-2 border-primary/30">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-base">Final UC Award (monthly)</h4>
              <p className="text-xs text-white/60 mt-1">Maximum award minus taper reduction</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary font-mono">{formatCurrency(finalAward)}</div>
              <div className="text-sm text-white/70 mt-1">{formatCurrency(finalAward * 12)}/year</div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="alert alert-info/20 text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-info">ℹ️ UC Income Rules:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70 ml-2">
              <li>UC uses NET employment earnings (after tax, NI, student loans)</li>
              <li>P11D benefits (company car) are EXCLUDED from UC income</li>
              <li>Pension contributions from salary sacrifice reduce UC income</li>
              <li>Non-salary sacrifice pension contributions do NOT reduce UC income</li>
              <li>Work allowance only applies if you have children or limited capability for work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
