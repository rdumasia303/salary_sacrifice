import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6'];

interface PensionPieChartProps {
  data: { name: string; value: number; color?: string }[];
}

export default function PensionPieChart({ data }: PensionPieChartProps) {
  if (!data || data.length === 0) return null;
  return (
    <div className="glass rounded-xl overflow-hidden neon-secondary">
      <div className="px-5 py-3 border-b border-white/10">
        <h3 className="font-semibold text-base">Pension Breakdown</h3>
      </div>
      <div className="p-5 pie-stable">
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                {data.map((item, i) => (
                  <Cell key={`cell-${i}`} fill={item.color || COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip wrapperStyle={{ background: 'transparent', border: 'none' }} labelStyle={{ color: '#e5e7eb' }} itemStyle={{ color: '#e5e7eb' }} contentStyle={{ background: '#0c1219', border: '1px solid #1f2a37' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
