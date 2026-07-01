import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrencyCode } from '@/shared/context/CurrencyContext';
import {
  CurrencyAmountInput,
  findNearestFormattedOffset,
  formattedOffsetToRawOffset,
  rawOffsetToFormattedOffset,
} from './CurrencyAmountInput';

vi.mock('@/shared/context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

function CurrencyHarness({
  initialValue,
  currency = 'VND',
  enableMoneyKeyboard = true,
}: {
  initialValue: string;
  currency?: CurrencyCode;
  enableMoneyKeyboard?: boolean;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <CurrencyAmountInput
      value={value}
      onValueChange={setValue}
      currency={currency}
      enableMoneyKeyboard={enableMoneyKeyboard}
    />
  );
}

function selectFormattedRange(input: HTMLInputElement, start: number, end = start) {
  input.setSelectionRange(start, end);
  fireEvent.select(input);
}

describe('CurrencyAmountInput custom keyboard editing', () => {
  beforeEach(() => {
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('maps caret offsets between the formatted VND display and raw numeric value', () => {
    expect(formattedOffsetToRawOffset('1.234.567', 5, 0)).toBe(4);
    expect(rawOffsetToFormattedOffset('1.234.567', 4, 0)).toBe(5);
    expect(formattedOffsetToRawOffset('1.234,50', 6, 2)).toBe(5);
    expect(rawOffsetToFormattedOffset('1.234,50', 5, 2)).toBe(6);
  });

  it('maps an Android pointer coordinate to the nearest formatted caret boundary', () => {
    const measureText = (text: string) => text.length * 10;

    expect(findNearestFormattedOffset('123.456', 24, measureText)).toBe(2);
    expect(findNearestFormattedOffset('123.456', 26, measureText)).toBe(3);
    expect(findNearestFormattedOffset('123.456', 45, measureText)).toBe(5);
  });

  it('keeps the input read-only, suppresses the native keyboard, and shows a fake caret', () => {
    render(<CurrencyHarness initialValue="123456" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.focus(input);

    expect(input.readOnly).toBe(true);
    expect(input.inputMode).toBe('none');
    expect(document.querySelector('[data-money-input-caret="true"]')).toBeTruthy();
    expect(screen.getByLabelText('money_keyboard.title')).toBeTruthy();
  });

  it('inserts a digit at the caret instead of appending it', () => {
    render(<CurrencyHarness initialValue="123456" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.focus(input);
    selectFormattedRange(input, 3);

    fireEvent.click(screen.getByRole('button', { name: '9' }));

    expect(input.value).toBe('1.239.456');
    expect(input.selectionStart).toBe(5);
  });

  it('backspaces the character before a middle caret', () => {
    render(<CurrencyHarness initialValue="123456" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.focus(input);
    selectFormattedRange(input, 3);

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.backspace' }));

    expect(input.value).toBe('12.456');
    expect(input.selectionStart).toBe(2);
  });

  it('replaces the selected raw digits and preserves VND formatting', () => {
    render(<CurrencyHarness initialValue="123456" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.focus(input);
    selectFormattedRange(input, 1, 5);

    fireEvent.click(screen.getByRole('button', { name: '9' }));

    expect(input.value).toBe('1.956');
    expect(input.selectionStart).toBe(3);
  });

  it('edits currencies with decimal digits without losing the fraction', () => {
    render(<CurrencyHarness initialValue="1234.56" currency="USD" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.focus(input);
    selectFormattedRange(input, 3);

    fireEvent.click(screen.getByRole('button', { name: '9' }));

    expect(input.value).toBe('12.934,56');
    expect(input.selectionStart).toBe(4);
  });

  it('closes the keyboard and removes the caret overlay when Done is tapped', () => {
    render(<CurrencyHarness initialValue="123456" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.focus(input);

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.done' }));

    expect(screen.queryByLabelText('money_keyboard.title')).toBeNull();
    expect(document.querySelector('[data-money-input-selection-overlay="true"]')).toBeNull();
  });

  it('uses the native decimal input when the custom keyboard setting is disabled', () => {
    render(<CurrencyHarness initialValue="1234.5" currency="USD" enableMoneyKeyboard={false} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.focus(input);

    expect(input.readOnly).toBe(false);
    expect(input.inputMode).toBe('decimal');
    expect(screen.queryByLabelText('money_keyboard.title')).toBeNull();
    expect(document.querySelector('[data-money-input-selection-overlay="true"]')).toBeNull();
  });
});
