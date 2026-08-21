export const formatCurrency = (val: number | null): string => {
  if (val === null) return '--';
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
  if (val < 0.01 && val > 0) return `$${val.toFixed(6)}`;
  return `$${val.toFixed(2)}`;
};
