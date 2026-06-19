import { describe, expect, it } from 'vitest';
import {
  formatAmountInput,
  getFractionDigits,
  normalizeAmountInput,
} from './money-input-utils';

describe('money input utils', () => {
  it('returns configured fraction digits by currency', () => {
    expect(getFractionDigits('VND')).toBe(0);
    expect(getFractionDigits('USD')).toBe(2);
  });

  it('normalizes plain VND input to raw numeric text', () => {
    expect(normalizeAmountInput('123456', 0)).toBe('123456');
    expect(normalizeAmountInput('00123456', 0)).toBe('123456');
    expect(normalizeAmountInput('123.456 VND', 0)).toBe('123456');
  });

  it('keeps 000 input as raw appended digits for VND', () => {
    expect(normalizeAmountInput('1000', 0)).toBe('1000');
    expect(normalizeAmountInput('000', 0)).toBe('0');
  });

  it('formats VND without decimal digits using vi-VN separators', () => {
    expect(formatAmountInput('125000', 'VND')).toBe('125.000');
    expect(formatAmountInput('100000.55', 'VND')).toBe('100.001');
  });

  it('allows decimals for currencies with fraction digits', () => {
    expect(normalizeAmountInput('1.234,50', 2)).toBe('1234.50');
    expect(normalizeAmountInput('12.345', 2)).toBe('12.34');
    expect(formatAmountInput('1234.5', 'USD')).toBe('1.234,5');
  });

  it('preserves trailing decimal separators and trailing zeroes', () => {
    expect(formatAmountInput('1234.', 'USD')).toBe('1.234,');
    expect(formatAmountInput('1234.50', 'USD')).toBe('1.234,50');
    expect(formatAmountInput('1234.00', 'USD')).toBe('1.234,00');
  });

  it('returns empty text for empty or non-finite values', () => {
    expect(formatAmountInput('', 'VND')).toBe('');
    expect(formatAmountInput('not-a-number', 'VND')).toBe('');
  });
});
