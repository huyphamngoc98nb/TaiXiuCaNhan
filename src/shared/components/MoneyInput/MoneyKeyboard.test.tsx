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
        onChange={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('money_keyboard.title')).toBeTruthy();
    expect(screen.getByRole('button', { name: '1' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '000' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'money_keyboard.calculator' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'money_keyboard.done' })).toBeTruthy();
  });

  it('calls onChange when tapping a number key', () => {
    const onChange = vi.fn();

    render(
      <MoneyKeyboard
        value=""
        currency="VND"
        onChange={onChange}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '1' }));

    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('appends 000 to the current raw value', () => {
    const onChange = vi.fn();

    render(
      <MoneyKeyboard
        value="1"
        currency="VND"
        onChange={onChange}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '000' }));

    expect(onChange).toHaveBeenCalledWith('1000');
  });

  it('backspaces the current raw value', () => {
    const onChange = vi.fn();

    render(
      <MoneyKeyboard
        value="123"
        currency="VND"
        onChange={onChange}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.backspace' }));

    expect(onChange).toHaveBeenCalledWith('12');
  });

  it('switches to calculator mode', () => {
    render(
      <MoneyKeyboard
        value=""
        currency="VND"
        onChange={vi.fn()}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.calculator' }));

    expect(screen.getByLabelText('money_keyboard.calculator_title')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'money_keyboard.apply' })).toBeTruthy();
  });

  it('applies a valid calculator result to onChange', () => {
    const onChange = vi.fn();

    render(
      <MoneyKeyboard
        value="100000"
        currency="VND"
        onChange={onChange}
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

    expect(onChange).toHaveBeenCalledWith('125000');
  });

  it('keeps decimal results for currencies that allow fraction digits', () => {
    const onChange = vi.fn();

    render(
      <MoneyKeyboard
        value="1"
        currency="USD"
        onChange={onChange}
        onDone={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.calculator' }));
    fireEvent.click(screen.getByText('\u00f7'));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: 'money_keyboard.apply' }));

    expect(onChange).toHaveBeenCalledWith('0.25');
  });
});
