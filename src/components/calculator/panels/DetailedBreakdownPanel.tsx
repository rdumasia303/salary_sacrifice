import React from 'react';
import { formatCurrency } from '../utils';

interface BreakdownRow {
  label: string;
  before?: number;
  after?: number;
  value?: number;
}

interface DetailedBreakdownPanelProps {
  rows: BreakdownRow[];
}

export default function DetailedBreakdownPanel({ rows }: DetailedBreakdownPanelProps) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/10">
        <h3 className="font-semibold text-base">Detailed breakdown</h3>
      </div>
      <div className="p-5 grid grid-cols-3 gap-3 text-sm">
        <div className="text-gray-400">Item</div>
        <div className="text-right text-gray-400">Before</div>
        <div className="text-right text-gray-400">After</div>
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <div className="text-white/90">{r.label}</div>
            <div className="text-right">{r.before !== undefined ? formatCurrency(r.before) : r.value !== undefined ? formatCurrency(r.value) : '-'}</div>
            <div className="text-right">{r.after !== undefined ? formatCurrency(r.after) : r.value !== undefined ? formatCurrency(r.value) : '-'}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
