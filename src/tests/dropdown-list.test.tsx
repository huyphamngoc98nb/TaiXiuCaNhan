import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DropdownList } from '@/shared/components/DropdownList';

describe('DropdownList', () => {
  it('opens on the first touch pointer down after blurring an active input', () => {
    const onChange = vi.fn();

    render(
      <>
        <input aria-label="Amount" />
        <DropdownList
          value=""
          onChange={onChange}
          ariaLabel="Category"
          placeholder="Select category"
          openOnInputBlurPointerDown
          options={[
            { value: '', label: 'Select category', disabled: true },
            { value: 'food', label: 'Food' },
          ]}
        />
      </>,
    );

    const amountInput = screen.getByLabelText('Amount');
    amountInput.focus();

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Category' }), {
      pointerType: 'touch',
    });

    expect(document.activeElement).not.toBe(amountInput);
    expect(screen.getByRole('listbox', { name: 'Category' })).toBeTruthy();
  });

  it('keeps portaled menu options clickable', () => {
    const onChange = vi.fn();

    render(
      <DropdownList
        value=""
        onChange={onChange}
        ariaLabel="Category"
        placeholder="Select category"
        options={[
          { value: '', label: 'Select category', disabled: true },
          { value: 'food', label: 'Food' },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Category' }));
    fireEvent.click(screen.getByRole('option', { name: 'Food' }));

    expect(onChange).toHaveBeenCalledWith('food');
  });
});
