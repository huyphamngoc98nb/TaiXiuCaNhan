import { describe, expect, it } from 'vitest';
import {
  appendMoneyCalculatorDecimalSeparator,
  appendMoneyCalculatorDigit,
  appendMoneyCalculatorOperator,
  backspaceMoneyExpression,
  clearMoneyExpression,
  evaluateMoneyExpression,
  isValidMoneyExpression,
} from './money-calculator';

const MULTIPLY = '\u00d7';
const DIVIDE = '\u00f7';

describe('money calculator', () => {
  it('adds money amounts', () => {
    expect(evaluateMoneyExpression('100000 + 25000', 0)).toEqual({
      ok: true,
      value: '125000',
    });
  });

  it('divides money amounts', () => {
    expect(evaluateMoneyExpression('500000 / 2', 0)).toEqual({
      ok: true,
      value: '250000',
    });
  });

  it('multiplies money amounts', () => {
    expect(evaluateMoneyExpression(`120000 ${MULTIPLY} 3`, 0)).toEqual({
      ok: true,
      value: '360000',
    });
  });

  it('returns divide_by_zero for division by zero', () => {
    expect(evaluateMoneyExpression(`100000 ${DIVIDE} 0`, 0)).toEqual({
      ok: false,
      error: 'divide_by_zero',
    });
  });

  it('returns invalid_expression for empty or malformed expressions', () => {
    expect(evaluateMoneyExpression('', 0)).toEqual({
      ok: false,
      error: 'invalid_expression',
    });
    expect(evaluateMoneyExpression('100000 +', 0)).toEqual({
      ok: false,
      error: 'invalid_expression',
    });
    expect(evaluateMoneyExpression(`100000 + ${MULTIPLY} 2`, 0)).toEqual({
      ok: false,
      error: 'invalid_expression',
    });
  });

  it('returns invalid_expression for non-finite results', () => {
    const nearMaxFiniteInteger = `1${'0'.repeat(308)}`;

    expect(evaluateMoneyExpression(`${nearMaxFiniteInteger} ${MULTIPLY} 10`, 0)).toEqual({
      ok: false,
      error: 'invalid_expression',
    });
  });

  it('does not return long decimal tails when fractionDigits is zero', () => {
    expect(evaluateMoneyExpression(`100000 ${DIVIDE} 3`, 0)).toEqual({
      ok: true,
      value: '33333',
    });
  });

  it('keeps at most the requested number of decimal digits', () => {
    expect(evaluateMoneyExpression(`10 ${DIVIDE} 4`, 2)).toEqual({
      ok: true,
      value: '2.5',
    });
    expect(evaluateMoneyExpression(`1 ${DIVIDE} 3`, 2)).toEqual({
      ok: true,
      value: '0.33',
    });
  });

  it('honors multiplication and division before addition and subtraction', () => {
    expect(evaluateMoneyExpression(`100 + 20 ${MULTIPLY} 3 - 10`, 0)).toEqual({
      ok: true,
      value: '150',
    });
  });

  it('validates expressions without evaluating through string execution', () => {
    expect(isValidMoneyExpression(`100 + 20 ${MULTIPLY} 3`)).toBe(true);
    expect(isValidMoneyExpression('100 +')).toBe(false);
  });

  it('supports calculator input helpers', () => {
    let expression = clearMoneyExpression();
    expression = appendMoneyCalculatorDigit(expression, '1');
    expression = appendMoneyCalculatorDigit(expression, '2');
    expression = appendMoneyCalculatorOperator(expression, '+');
    expression = appendMoneyCalculatorDigit(expression, '3');

    expect(expression).toBe('12 + 3');
    expect(backspaceMoneyExpression(expression)).toBe('12 +');
    expect(clearMoneyExpression()).toBe('');
  });

  it('ignores unsupported digit helper input', () => {
    expect(appendMoneyCalculatorDigit('12', '000')).toBe('12');
    expect(appendMoneyCalculatorDigit('12', 'a')).toBe('12');
  });

  it('prevents decimal input when fraction digits are not allowed', () => {
    expect(appendMoneyCalculatorDecimalSeparator('12', 0)).toBe('12');
    expect(appendMoneyCalculatorDecimalSeparator('12', 2)).toBe('12.');
    expect(appendMoneyCalculatorDecimalSeparator('12.', 2)).toBe('12.');
  });
});
