import React from 'react';

export default function TalesPanel() {
  return (
    <div className="glass rounded-xl overflow-hidden neon-secondary">
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
        <div className="p-2 bg-white/10 rounded-lg"></div>
        <h3 className="font-semibold text-base">Tales from the tax punks</h3>
      </div>
      <div className="p-5 space-y-4 text-sm leading-relaxed">
        <p className="opacity-90"><span className="text-secondary font-semibold">Punk:</span> If your ANI tiptoes under 100k, the Chancellor sighs… then nods: “well played.”</p>
        <p className="opacity-90"><span className="text-primary font-semibold">Employee:</span> So salary sacrifice isn’t magic?</p>
        <p className="opacity-90"><span className="text-secondary font-semibold">Punk:</span> It’s maths with edge. Less taxable pay, more pension. NIC alchemy if your employer plays nice.</p>
        <p className="opacity-90"><span className="text-primary font-semibold">Employee:</span> What about bikes and EVs?</p>
        <p className="opacity-90"><span className="text-secondary font-semibold">Punk:</span> Bikes are stealthy. EVs are loud. Both can slip past the tax drones—within policy, of course.</p>
        <p className="text-white/70 text-xs">Entertainment only. Not advice. Don’t hate the player, learn the rules.</p>
      </div>
    </div>
  );
}
