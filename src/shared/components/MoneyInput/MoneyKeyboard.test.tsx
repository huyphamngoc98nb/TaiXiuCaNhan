import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MoneyKeyboard } from './MoneyKeyboard';

vi.mock('@/shared/context/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
}));

describe('MoneyKeyboard', () => {
  it('renders the number keyboard', () => {
    render(
      <MoneyKeyboard
        value=""
        currency="VND"
        onInsert={vi.fn()}
        onBackspace={vi.fn()}
        onReplace={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('money_keyboard.title')).toBeTruthy();
    expect(screen.getByRole('button', { name: '1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '000' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'money_keyboard.calculator' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'money_keyboard.done' })).toBeTruthy();
  });

  it('calls onInsert when tapping a number key', () => {
    const onInsert = vi.fn();

    render(
      <MoneyKeyboard
        value=""
        currency="VND"
        onInsert={onInsert}
        onBackspace={vi.fn()}
        onReplace={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '1' }));

    expect(onInsert).toHaveBeenCalledWith('1');
  });

  it('passes 000 to the selection-aware insert callback', () => {
    const onInsert = vi.fn();

    render(
      <MoneyKeyboard
        value="1"
        currency="VND"
        onInsert={onInsert}
        onBackspace={vi.fn()}
        onReplace={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '000' }));

    expect(onInsert).toHaveBeenCalledWith('000');
  });

  it('delegates backspace to the selection-aware callback', () => {
    const onBackspace = vi.fn();

    render(
      <MoneyKeyboard
        value="123"
        currency="VND"
        onInsert={vi.fn()}
        onBackspace={onBackspace}
        onReplace={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.backspace' }));

    expect(onBackspace).toHaveBeenCalledTimes(1);
  });

  it('switches to calculator mode', () => {
    render(
      <MoneyKeyboard
        value=""
        currency="VND"
        onInsert={vi.fn()}
        onBackspace={vi.fn()}
        onReplace={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.calculator' }));

    expect(screen.getByLabelText('money_keyboard.calculator_title')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'money_keyboard.apply' })).toBeTruthy();
  });

  it('applies a valid calculator result with onReplace', () => {
    const onReplace = vi.fn();

    render(
      <MoneyKeyboard
        value="100000"
        currency="VND"
        onInsert={vi.fn()}
        onBackspace={vi.fn()}
        onReplace={onReplace}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.calculator' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.apply' }));

    expect(onReplace).toHaveBeenCalledWith('125000');
  });

  it('keeps decimal results for currencies that allow fraction digits', () => {
    const onReplace = vi.fn();

    render(
      <MoneyKeyboard
        value="1"
        currency="USD"
        onInsert={vi.fn()}
        onBackspace={vi.fn()}
        onReplace={onReplace}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.calculator' }));
    fireEvent.click(screen.getByText('\u00f7'));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.apply' }));

    expect(onReplace).toHaveBeenCalledWith('0.25');
  });
});
