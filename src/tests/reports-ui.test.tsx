import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import type React from 'react';
import { DateRangePicker } from '../modules/reports/components/DateRangePicker';
import { LanguageProvider } from '@/shared/context/LanguageContext';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(async () => ({ value: 'en' })),
    set: vi.fn(async () => undefined),
  },
}));

function renderWithProviders(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Reports UI - DateRangePicker', () => {
  it('calls onPresetChange when a new preset is selected', async () => {
    const onPresetChange = vi.fn();
    const onGranularityChange = vi.fn();

    renderWithProviders(
      <DateRangePicker 
        preset="this_month" 
        granularity="day" 
        customRange={{ startDate: 1, endDate: 2 }}
        onPresetChange={onPresetChange} 
        onGranularityChange={onGranularityChange} 
        onCustomRangeChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    fireEvent.click(await screen.findByRole('button', { name: /This Week/i }));

    expect(onPresetChange).toHaveBeenCalledWith('this_week');
  });

  it('calls onGranularityChange when a new granularity is selected', async () => {
    const onPresetChange = vi.fn();
    const onGranularityChange = vi.fn();

    renderWithProviders(
      <DateRangePicker 
        preset="this_month" 
        granularity="day" 
        customRange={{ startDate: 1, endDate: 2 }}
        onPresetChange={onPresetChange} 
        onGranularityChange={onGranularityChange} 
        onCustomRangeChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const granularityGroup = await screen.findByRole('group', { name: /Group By/i });
    fireEvent.click(within(granularityGroup).getByRole('button', { name: /^Week$/i }));

    expect(onGranularityChange).toHaveBeenCalledWith('week');
  });
});
