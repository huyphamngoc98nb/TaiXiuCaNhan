import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppUpdateGate } from './AppUpdateGate';
import { useAppUpdate } from '../hooks/useAppUpdate';

const hookValue = vi.hoisted(() => ({
  availableUpdate: null as ReturnType<typeof useAppUpdate>['availableUpdate'],
  beginUpdate: vi.fn(),
  checkForUpdate: vi.fn(),
  dismissUpdate: vi.fn(),
  downloadProgress: null,
  installState: 'idle' as const,
  isChecking: false,
  isUpdating: false,
  updateError: null as string | null,
}));

vi.mock('../hooks/useAppUpdate', () => ({
  useAppUpdate: vi.fn(() => hookValue),
}));

vi.mock('@/shared/context/LanguageContext', () => ({
  useLanguage: () => ({ t: (key: string) => key }),
}));

vi.mock('@/shared/hooks/useBodyScrollLock', () => ({
  useBodyScrollLock: vi.fn(),
}));

describe('AppUpdateGate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookValue.availableUpdate = null;
    hookValue.updateError = null;
  });

  it('checks for an update on mount without blocking the app', async () => {
    const { container } = render(<AppUpdateGate />);

    await waitFor(() => expect(hookValue.checkForUpdate).toHaveBeenCalledTimes(1));
    expect(container.innerHTML).toBe('');
  });

  it('renders the shared dialog for an available update', () => {
    hookValue.availableUpdate = {
      status: 'update_available',
      currentVersionCode: 120,
      mandatory: false,
      latest: {
        platform: 'android',
        versionName: '0.1.21',
        versionCode: 121,
        mandatory: false,
        apkUrl: 'https://example.com/app.apk',
        sha256: 'abc123',
        releaseNotes: [],
      },
    };

    render(<AppUpdateGate />);

    expect(screen.getByRole('dialog')).not.toBeNull();
  });
});
