import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';

interface BeforeAfterChartProps {
  data: any[];
}

export default function BeforeAfterChart({ data }: BeforeAfterChartProps) {
  if (!data || data.length === 0) return null;
  return (
    <div className="glass rounded-xl overflow-hidden neon-secondary">
      <div className="px-5 py-3 border-b border-white/10">
        <h3 className="font-semibold text-base">Before vs After</h3>
      </div>
      <div className="p-5 pie-stable">
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 8, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2a37" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" tickFormatter={(v) => `£${(v/1000).toFixed(0)}k`} />
              <Tooltip wrapperStyle={{ background: 'transparent', border: 'none' }} labelStyle={{ color: '#e5e7eb' }} itemStyle={{ color: '#e5e7eb' }} contentStyle={{ background: '#0c1219', border: '1px solid #1f2a37' }} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
              <Legend wrapperStyle={{ background: 'transparent' }} />
              <Bar dataKey="Income Tax" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Employee NIC" stackId="a" fill="#ef4444" />
              <Bar dataKey="Student Loan" stackId="a" fill="#f472b6" />
              <Bar dataKey="Pension (net)" stackId="a" fill="#3b82f6" />
              <Bar dataKey="EV (net)" stackId="a" fill="#06b6d4" />
              <Bar dataKey="Cycle (net)" stackId="a" fill="#8b5cf6" />
              <Bar dataKey="Cash (excl CB/UC)" stackId="a" fill="#10b981" />
              <Bar dataKey="Child Benefit" stackId="a" fill="#16a34a" />
              <Bar dataKey="Universal Credit" stackId="a" fill="#22c55e" />
              <Bar dataKey="Free childcare" stackId="a" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
