import { CURRENCIES, CurrencyCode } from '@/shared/context/CurrencyContext';

export function getFractionDigits(currency: CurrencyCode): number {
  return CURRENCIES.find(c => c.code === currency)?.fractionDigits ?? 0;
}

export function normalizeAmountInput(input: string, fractionDigits: number): string {
  const cleaned = input.replace(/[^\d.,]/g, '');

  if (fractionDigits === 0) {
    const digits = cleaned.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
    return digits;
  }

  const lastDot = cleaned.lastIndexOf('.');
  const lastComma = cleaned.lastIndexOf(',');
  const decimalIndex = Math.max(lastDot, lastComma);

  if (decimalIndex === -1) {
    return cleaned.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  }

  const integerPart = cleaned.slice(0, decimalIndex).replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  const fractionPart = cleaned.slice(decimalIndex + 1).replace(/\D/g, '').slice(0, fractionDigits);

  if (!integerPart && !fractionPart) return '';
  return `${integerPart || '0'}${fractionPart ? `.${fractionPart}` : '.'}`;
}

export function formatAmountInput(value: string | number | null | undefined, currency: CurrencyCode): string {
  if (value === null || value === undefined || value === '') return '';

  const text = String(value);
  const fractionDigits = getFractionDigits(currency);
  const hasTrailingDecimal = text.endsWith('.');
  const rawFraction = text.includes('.') ? text.split('.')[1] : '';
  const numericValue = Number(text);

  if (!Number.isFinite(numericValue)) return '';

  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(numericValue);

  if (fractionDigits > 0 && hasTrailingDecimal) return `${formatted},`;
  if (fractionDigits > 0 && rawFraction.endsWith('0')) {
    const [, formattedFraction = ''] = formatted.split(',');
    const missingZeros = rawFraction.length - formattedFraction.length;
    if (missingZeros <= 0) return formatted;
    return formattedFraction
      ? `${formatted}${'0'.repeat(missingZeros)}`
      : `${formatted},${'0'.repeat(missingZeros)}`;
  }

  return formatted;
}
