import React from 'react';
import { Info } from 'lucide-react';
import { formatCurrency, formatChange } from '../utils';

interface NetValueDetailsItem {
  label: string;
  before: number;
  after: number;
}

interface TotalNetValuePanelProps {
  headlineBefore: number;
  headlineAfter: number;
  headlineDelta: number;
  details: NetValueDetailsItem[];
}

export default function TotalNetValuePanel({ headlineBefore, headlineAfter, headlineDelta, details }: TotalNetValuePanelProps) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-base">Total Net Value</h3>
        <div className="text-xs text-gray-300/80 flex items-center gap-2"><Info size={14} />You keep more of the value of your labour.</div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-gray-400">Category</div>
          <div className="text-right text-gray-400">Before</div>
          <div className="text-right text-gray-400">After</div>
          {details.map((row) => (
            <React.Fragment key={row.label}>
              <div className="text-white/90">{row.label}</div>
              <div className="text-right">{formatCurrency(row.before)}</div>
              <div className="text-right">{formatCurrency(row.after)}</div>
            </React.Fragment>
          ))}
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex items-center justify-between text-base font-semibold">
          <div className="text-white/90">Headline total</div>
          <div className="text-right space-y-1">
            <div className="text-sm text-gray-300">Before: {formatCurrency(headlineBefore)}</div>
            <div>After: {formatCurrency(headlineAfter)}</div>
            <div className={`text-sm ${headlineDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>Delta: {formatChange(headlineDelta)}</div>
          </div>
        </div>

        <p className="text-xs text-gray-400">Net value adds together pocket cash, pension value, P11D benefits, EV & cycle savings, Child Benefit, free childcare, and UC.</p>
      </div>
    </div>
  );
}
