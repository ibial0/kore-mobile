import { isValidArcAddress } from '../utils/validation';

describe('ARC Address Validation', () => {
  it('should return true for a valid 40-char hex address starting with 0x', () => {
    expect(isValidArcAddress('0x71C000000000000000000000000000000000A92F')).toBe(true);
    expect(isValidArcAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true);
  });

  it('should return false if it does not start with 0x', () => {
    expect(isValidArcAddress('71C000000000000000000000000000000000A92F')).toBe(false);
  });

  it('should return false if it is too short', () => {
    expect(isValidArcAddress('0x123')).toBe(false);
  });

  it('should return false if it is too long', () => {
    expect(isValidArcAddress('0x71C000000000000000000000000000000000A92F1')).toBe(false);
  });

  it('should return false if it contains invalid characters', () => {
    expect(isValidArcAddress('0x71C000000000000000000000000000000000G92F')).toBe(false);
    expect(isValidArcAddress('0x71C000000000000000000000000000000000 A92F')).toBe(false);
  });
});
