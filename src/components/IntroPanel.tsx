import React from 'react';
import { Landmark } from 'lucide-react';

export default function IntroPanel() {
  return (
    <section className="glass rounded-xl px-6 py-5 mb-6 neon-primary overflow-hidden">
      <div className="flex items-start gap-4 justify-between flex-wrap">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
            <Landmark className="text-primary" size={20} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Keep more of what you earn</h2>
            <p className="text-sm text-white/80">
              This playground helps you experiment with taxable salary. Please independently verify the accuracy of all this - I take no liability for decisions you make and it's not advice. It's a philosophical experiment on subjective value — pensions, EVs, bikes, childcare and entitlements — all hopefully within the rules.
            </p>
            <p className="text-xs text-white/60">Apologies to the Chancellor. Entertainment only. Not advice.</p>
          </div>
        </div>
        <div className="pt-2">
          <form action="https://www.paypal.com/donate" method="post" target="_top">
            <input type="hidden" name="business" value="S7T27LMZ6RSXE" />
            <input type="hidden" name="no_recurring" value="0" />
            <input type="hidden" name="item_name" value="For helping me avoid accountants. I'll declare the donations if they exceed my 1k trading allowance! Stay legal :-)" />
            <input type="hidden" name="currency_code" value="GBP" />
            <button type="submit" className="btn btn-sm btn-outline border-white text-white inline-flex items-center gap-2 hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v12a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
              Support This
            </button>
          </form>
          <p className="text-[11px] text-white/50 mt-1">Thank you! Donations over the £1k trading allowance will be declared.</p>
        </div>
      </div>
    </section>
  );
}
