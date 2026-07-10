// Converts a 2-letter ISO country code into its flag emoji via the Unicode
// regional-indicator trick — no image assets or library needed.
export function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  const codePoints = [...code.toUpperCase()].map(c => 0x1f1e6 - 65 + c.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
