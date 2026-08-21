/**
 * Validates if a given string is a valid ARC (EVM-compatible) wallet address.
 * Standard format: 0x followed by 40 hex characters.
 */
export const isValidArcAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
