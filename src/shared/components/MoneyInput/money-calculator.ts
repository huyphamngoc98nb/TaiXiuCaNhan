export type MoneyCalculatorOperator = '+' | '-' | '×' | '÷';

export type MoneyCalculationError = 'invalid_expression' | 'divide_by_zero';

export interface MoneyCalculationResult {
  ok: boolean;
  value?: string;
  error?: MoneyCalculationError;
}

type NumberToken = {
  type: 'number';
  value: number;
};

type OperatorToken = {
  type: 'operator';
  value: MoneyCalculatorOperator;
};

type Token = NumberToken | OperatorToken;

type InternalCalculationResult =
  | { ok: true; value: number }
  | { ok: false; error: MoneyCalculationError };

const OPERATOR_ALIASES: Record<string, MoneyCalculatorOperator> = {
  '+': '+',
  '-': '-',
  '×': '×',
  '*': '×',
  '÷': '÷',
  '/': '÷',
};

export function clearMoneyExpression(): string {
  return '';
}

export function backspaceMoneyExpression(expression: string): string {
  return expression.trimEnd().slice(0, -1).trimEnd();
}

export function appendMoneyCalculatorDigit(expression: string, digit: string): string {
  if (!/^\d$/.test(digit)) return expression;
  return `${expression}${digit}`;
}

export function appendMoneyCalculatorDecimalSeparator(expression: string, fractionDigits: number): string {
  if (fractionDigits <= 0) return expression;

  const currentNumber = getCurrentNumberText(expression);
  if (currentNumber.includes('.') || currentNumber.includes(',')) return expression;
  return `${expression}${currentNumber ? '.' : '0.'}`;
}

export function appendMoneyCalculatorOperator(
  expression: string,
  operator: MoneyCalculatorOperator
): string {
  const trimmed = expression.trim();
  if (!trimmed) return '';

  const lastChar = trimmed.charAt(trimmed.length - 1);
  if (isOperatorChar(lastChar)) {
    return `${trimmed.slice(0, -1).trimEnd()} ${operator} `;
  }

  return `${trimmed} ${operator} `;
}

export function validateMoneyExpression(expression: string): MoneyCalculationResult {
  const tokens = tokenizeMoneyExpression(expression);
  if (!tokens) return { ok: false, error: 'invalid_expression' };
  return { ok: true };
}

export function isValidMoneyExpression(expression: string): boolean {
  return validateMoneyExpression(expression).ok;
}

export function evaluateMoneyExpression(
  expression: string,
  fractionDigits: number
): MoneyCalculationResult {
  const tokens = tokenizeMoneyExpression(expression);
  if (!tokens) return { ok: false, error: 'invalid_expression' };

  const calculated = calculateTokens(tokens);
  if (!calculated.ok) return calculated;
  if (calculated.value === undefined) return { ok: false, error: 'invalid_expression' };

  return formatCalculationValue(calculated.value, fractionDigits);
}

function tokenizeMoneyExpression(expression: string): Token[] | null {
  const text = expression.trim();
  if (!text) return null;

  const tokens: Token[] = [];
  let index = 0;

  while (index < text.length) {
    const char = text[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (isOperatorChar(char)) {
      tokens.push({ type: 'operator', value: OPERATOR_ALIASES[char] });
      index += 1;
      continue;
    }

    if (/\d|[.,]/.test(char)) {
      const start = index;
      while (index < text.length && /\d|[.,]/.test(text[index])) {
        index += 1;
      }

      const value = parseMoneyNumber(text.slice(start, index));
      if (value === null) return null;
      tokens.push({ type: 'number', value });
      continue;
    }

    return null;
  }

  if (!hasValidTokenOrder(tokens)) return null;
  return tokens;
}

function parseMoneyNumber(text: string): number | null {
  if (!/\d/.test(text)) return null;

  const lastDot = text.lastIndexOf('.');
  const lastComma = text.lastIndexOf(',');
  const decimalIndex = Math.max(lastDot, lastComma);
  const separatorCount = [...text].filter(char => char === '.' || char === ',').length;

  if (separatorCount > 1) {
    const integerPart = text.slice(0, decimalIndex).replace(/[.,]/g, '');
    const fractionPart = text.slice(decimalIndex + 1).replace(/[.,]/g, '');
    const normalized = `${integerPart || '0'}.${fractionPart}`;
    return toFiniteNumber(normalized);
  }

  return toFiniteNumber(text.replace(',', '.'));
}

function toFiniteNumber(text: string): number | null {
  if (!/^\d+(?:\.\d*)?$/.test(text)) return null;

  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

function hasValidTokenOrder(tokens: Token[]): boolean {
  if (tokens.length === 0 || tokens.length % 2 === 0) return false;

  return tokens.every((token, index) => {
    const shouldBeNumber = index % 2 === 0;
    return shouldBeNumber ? token.type === 'number' : token.type === 'operator';
  });
}

function calculateTokens(tokens: Token[]): InternalCalculationResult {
  const values: number[] = [(tokens[0] as NumberToken).value];
  const addSubtractOps: MoneyCalculatorOperator[] = [];

  for (let index = 1; index < tokens.length; index += 2) {
    const operator = (tokens[index] as OperatorToken).value;
    const nextValue = (tokens[index + 1] as NumberToken).value;

    if (operator === '×' || operator === '÷') {
      const currentValue = values.pop();
      if (currentValue === undefined) return { ok: false, error: 'invalid_expression' };
      if (operator === '÷' && nextValue === 0) return { ok: false, error: 'divide_by_zero' };

      const result = operator === '×' ? currentValue * nextValue : currentValue / nextValue;
      if (!Number.isFinite(result)) return { ok: false, error: 'invalid_expression' };
      values.push(result);
      continue;
    }

    addSubtractOps.push(operator);
    values.push(nextValue);
  }

  const value = addSubtractOps.reduce((total, operator, index) => {
    const nextValue = values[index + 1];
    return operator === '+' ? total + nextValue : total - nextValue;
  }, values[0]);

  if (!Number.isFinite(value)) return { ok: false, error: 'invalid_expression' };
  return { ok: true, value };
}

function formatCalculationValue(value: number, fractionDigits: number): MoneyCalculationResult {
  const safeFractionDigits = Math.max(0, Math.min(20, Math.trunc(fractionDigits)));
  const fixedValue = value.toFixed(safeFractionDigits);
  const normalizedValue = safeFractionDigits === 0
    ? fixedValue
    : fixedValue.replace(/\.?0+$/, '');

  if (!Number.isFinite(Number(normalizedValue))) {
    return { ok: false, error: 'invalid_expression' };
  }

  return { ok: true, value: normalizedValue === '-0' ? '0' : normalizedValue };
}

function getCurrentNumberText(expression: string): string {
  const parts = expression.split(/[+\-×÷*/]/);
  return (parts[parts.length - 1] ?? '').trim();
}

function isOperatorChar(char: string): char is keyof typeof OPERATOR_ALIASES {
  return char in OPERATOR_ALIASES;
}
