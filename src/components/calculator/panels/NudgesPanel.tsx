import React from 'react';

interface NudgeItem {
  icon: React.ReactNode;
  text: string;
}

export default function NudgesPanel({ items }: { items: NudgeItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="glass rounded-xl p-5 neon-secondary">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white/10 rounded-lg"></div>
        <h3 className="font-semibold">Cheeky nudges (not advice)</h3>
      </div>
      <ul className="space-y-2">
        {items.map((s, i) => (
          <li key={i} className="flex items-center gap-3 alert-stable">
            <div className="p-2 bg-white/10 rounded-lg">{s.icon}</div>
            <span>{s.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
