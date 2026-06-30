import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppUpdateSettings } from './AppUpdateSettings';

const getAutoCheckEnabledMock = vi.hoisted(() => vi.fn());
const setAutoCheckEnabledMock = vi.hoisted(() => vi.fn());

vi.mock('@/modules/app-update', () => ({
  getAppUpdateAutoCheckEnabled: getAutoCheckEnabledMock,
  setAppUpdateAutoCheckEnabled: setAutoCheckEnabledMock,
}));

vi.mock('@/shared/context/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

describe('AppUpdateSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAutoCheckEnabledMock.mockResolvedValue(true);
    setAutoCheckEnabledMock.mockResolvedValue(undefined);
  });

  it('loads and persists the automatic update check toggle', async () => {
    render(<AppUpdateSettings />);

    const toggle = screen.getByRole('switch', {
      name: 'app_update.auto_check',
    });
    await waitFor(() => expect(toggle.hasAttribute('disabled')).toBe(false));
    expect(toggle.getAttribute('aria-checked')).toBe('true');

    fireEvent.click(toggle);

    await waitFor(() =>
      expect(setAutoCheckEnabledMock).toHaveBeenCalledWith(false),
    );
    expect(toggle.getAttribute('aria-checked')).toBe('false');
  });
});
