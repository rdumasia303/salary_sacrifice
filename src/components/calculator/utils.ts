export const formatCurrency = (amount: number) => `£${Math.abs(amount).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
export const formatChange = (amount: number, showSign = true) => `${showSign ? (amount >= 0 ? '+' : '') : ''}${formatCurrency(amount)}`;

export const copyToClipboard = async (text: string) => {
  try { await navigator.clipboard.writeText(text); } catch {}
};
