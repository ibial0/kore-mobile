import { formatCurrency } from '../utils/format';

describe('Currency Formatting', () => {
  it('should format null as --', () => {
    expect(formatCurrency(null)).toBe('--');
  });

  it('should format billions correctly', () => {
    expect(formatCurrency(1500000000)).toBe('$1.50B');
  });

  it('should format millions correctly', () => {
    expect(formatCurrency(2500000)).toBe('$2.50M');
  });

  it('should format thousands correctly', () => {
    expect(formatCurrency(4500)).toBe('$4.50K');
  });

  it('should format small numbers with more precision', () => {
    expect(formatCurrency(0.0001234)).toBe('$0.000123');
  });

  it('should format regular numbers to 2 decimal places', () => {
    expect(formatCurrency(123.456)).toBe('$123.46');
  });
});
