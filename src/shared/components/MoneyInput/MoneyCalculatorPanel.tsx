import { useMemo, useState } from 'react';
import { Delete } from 'lucide-react';
import { CurrencyCode } from '@/shared/context/CurrencyContext';
import { useLanguage } from '@/shared/context/LanguageContext';
import { triggerLightHaptic } from '@/shared/utils/haptics';
import { getFractionDigits } from './money-input-utils';
import {
  appendMoneyCalculatorDigit,
  appendMoneyCalculatorOperator,
  backspaceMoneyExpression,
  clearMoneyExpression,
  evaluateMoneyExpression,
  MoneyCalculationError,
  MoneyCalculatorOperator,
} from './money-calculator';
import { MoneyKeyboardButton } from './MoneyKeyboardButton';

interface MoneyCalculatorPanelProps {
  value: string;
  currency: CurrencyCode;
  onApply: (value: string) => void;
  onBack: () => void;
}

const calculatorRows: Array<Array<string | MoneyCalculatorOperator>> = [
  ['7', '8', '9', '÷'],
  ['4', '5', '6', '×'],
  ['1', '2', '3', '-'],
  ['clear', '0', 'backspace', '+'],
];

function getErrorText(error: MoneyCalculationError | undefined, t: ReturnType<typeof useLanguage>['t']): string {
  if (error === 'divide_by_zero') return t('money_keyboard.divide_by_zero');
  if (error === 'invalid_expression') return t('money_keyboard.invalid_expression');
  return t('money_keyboard.calculator_hint');
}

function formatExpressionForDisplay(expression: string): string {
  return expression.replace(/-/g, '−');
}

function getOperatorLabel(operator: MoneyCalculatorOperator): string {
  return operator === '-' ? '−' : operator;
}

export function MoneyCalculatorPanel({
  value,
  currency,
  onApply,
  onBack,
}: MoneyCalculatorPanelProps) {
  const { t } = useLanguage();
  const fractionDigits = getFractionDigits(currency);
  const [expression, setExpression] = useState(value);
  const calculation = useMemo(
    () => evaluateMoneyExpression(expression, fractionDigits),
    [expression, fractionDigits],
  );

  const appendDigit = (digit: string) => {
    void triggerLightHaptic();
    setExpression(current => appendMoneyCalculatorDigit(current, digit));
  };

  const appendOperator = (operator: MoneyCalculatorOperator) => {
    void triggerLightHaptic();
    setExpression(current => appendMoneyCalculatorOperator(current, operator));
  };

  const applyResult = () => {
    if (!calculation.ok || calculation.value === undefined) return;

    void triggerLightHaptic();
    onApply(calculation.value);
  };

  return (
    <div className="space-y-4" aria-label={t('money_keyboard.calculator_title')}>
      <p className="sr-only">{t('money_keyboard.calculator_hint')}</p>
      <div className="rounded-[16px] border border-border bg-bg-subtle px-4 py-3">
        <div className="min-h-[30px] overflow-hidden text-right text-[24px] font-bold leading-tight text-text tabular-nums">
          {formatExpressionForDisplay(expression) || '0'}
        </div>
        <div
          className={`mt-1 min-h-[22px] text-right text-[13px] font-semibold ${
            calculation.ok ? 'text-indigo-600' : 'text-rose-600'
          }`}
        >
          {calculation.ok && calculation.value !== undefined
            ? calculation.value
            : getErrorText(calculation.error, t)}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        {calculatorRows.flat().map(key => {
          if (key === 'backspace') {
            return (
              <MoneyKeyboardButton
                key={key}
                aria-label={t('money_keyboard.backspace')}
                onClick={() => {
                  void triggerLightHaptic();
                  setExpression(current => backspaceMoneyExpression(current));
                }}
              >
                <Delete size={22} strokeWidth={2.4} />
              </MoneyKeyboardButton>
            );
          }

          if (key === 'clear') {
            return (
              <MoneyKeyboardButton
                key={key}
                variant="danger"
                aria-label={t('money_keyboard.clear')}
                className="text-[15px]"
                onClick={() => {
                  void triggerLightHaptic();
                  setExpression(clearMoneyExpression());
                }}
              >
                {t('money_keyboard.clear')}
              </MoneyKeyboardButton>
            );
          }

          if (['+', '-', '×', '÷'].includes(key)) {
            const operator = key as MoneyCalculatorOperator;

            return (
              <MoneyKeyboardButton
                key={key}
                variant="operator"
                onClick={() => appendOperator(operator)}
              >
                {getOperatorLabel(operator)}
              </MoneyKeyboardButton>
            );
          }

          return (
            <MoneyKeyboardButton key={key} onClick={() => appendDigit(key)}>
              {key}
            </MoneyKeyboardButton>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <MoneyKeyboardButton
          className="h-12 text-[15px]"
          onClick={() => {
            void triggerLightHaptic();
            onBack();
          }}
        >
          {t('money_keyboard.back')}
        </MoneyKeyboardButton>
        <MoneyKeyboardButton
          className="h-12 text-[15px]"
          variant="primary"
          disabled={!calculation.ok || calculation.value === undefined}
          onClick={applyResult}
        >
          {t('money_keyboard.apply')}
        </MoneyKeyboardButton>
      </div>
    </div>
  );
}
