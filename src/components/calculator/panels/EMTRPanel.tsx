import React from 'react';

interface EMTRPanelProps {
  employment: number;
  nonSacPAYE: number;
}

export default function EMTRPanel({ employment, nonSacPAYE }: EMTRPanelProps) {
  return (
    <div className="glass rounded-xl p-5 neon-secondary">
      <h3 className="font-semibold mb-3">Effective Marginal Tax Rate</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between"><span>On an extra £100 of base pay</span><span className="font-semibold">{employment.toFixed(1)}%</span></div>
        <div className="flex justify-between"><span>On an extra £100 of non‑sac PAYE income</span><span className="font-semibold">{nonSacPAYE.toFixed(1)}%</span></div>
      </div>
      <p className="text-xs opacity-70 mt-2">Includes Income Tax, NIC, Child Benefit charge, Personal Allowance taper and UC interactions.</p>
    </div>
  );
}
