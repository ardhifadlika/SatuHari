/**
 * Utility functions for Indonesian Rupiah (IDR) and currency formatting.
 * Strictly formats money and budgets using '.' (dot) as the thousand separator
 * for every 3 zeros (e.g. 100.000.000 or Rp 25.000.000).
 */

/**
 * Formats a number or numeric string with '.' every 3 digits.
 * Example: 15000000 -> "15.000.000"
 */
export function formatNumberWithDots(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0';
  
  if (typeof value === 'number') {
    if (isNaN(value)) return '0';
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // If string, strip non-digits first to clean it up
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) return '0';
  
  const num = parseInt(digitsOnly, 10);
  if (isNaN(num)) return '0';

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formats a number with "Rp " prefix and '.' thousands separator.
 * Example: 250000000 -> "Rp 250.000.000"
 */
export function formatRupiah(value: number | string | null | undefined, withPrefix: boolean = true): string {
  const formatted = formatNumberWithDots(value);
  return withPrefix ? `Rp ${formatted}` : formatted;
}

/**
 * Parses a string containing dots or currency text into a pure integer.
 * Example: "250.000.000" or "Rp 250.000.000" -> 250000000
 */
export function parseRupiah(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : Math.round(value);
  }
  if (!value) return 0;
  const digitsOnly = String(value).replace(/\D/g, '');
  if (!digitsOnly) return 0;
  const parsed = parseInt(digitsOnly, 10);
  return isNaN(parsed) ? 0 : parsed;
}
