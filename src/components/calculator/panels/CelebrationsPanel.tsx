import React from 'react';

interface CelebrationItem {
  icon: React.ReactNode;
  message: string;
}

export default function CelebrationsPanel({ items }: { items: CelebrationItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="glass rounded-xl p-5 neon-secondary">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-accent/20 rounded-lg"></div>
        <h3 className="font-semibold">Nice moves! The tax gremlins are confused. Keep it that way. 😎</h3>
      </div>
      <ul className="space-y-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-3 alert-stable">
            <div className="p-2 bg-white/10 rounded-lg">{c.icon}</div>
            <span className="text-success font-semibold">{c.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
