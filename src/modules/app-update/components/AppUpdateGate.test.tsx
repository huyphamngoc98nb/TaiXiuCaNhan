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

const getAutoCheckEnabledMock = vi.hoisted(() => vi.fn());
const cleanupUpdateCacheMock = vi.hoisted(() => vi.fn());
const loggerWarnMock = vi.hoisted(() => vi.fn());

vi.mock('../hooks/useAppUpdate', () => ({
  useAppUpdate: vi.fn(() => hookValue),
}));

vi.mock('../services/app-update.service', () => ({
  getAppUpdateAutoCheckEnabled: getAutoCheckEnabledMock,
}));

vi.mock('../services/app-update.native', () => ({
  cleanupAndroidUpdateCache: cleanupUpdateCacheMock,
}));

vi.mock('@/core/telemetry/logger', () => ({
  logger: { warn: loggerWarnMock },
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
    getAutoCheckEnabledMock.mockResolvedValue(true);
    cleanupUpdateCacheMock.mockResolvedValue(0);
  });

  it('checks for an update on mount when automatic checks are enabled', async () => {
    const { container } = render(<AppUpdateGate />);

    await waitFor(() => expect(hookValue.checkForUpdate).toHaveBeenCalledTimes(1));
    expect(cleanupUpdateCacheMock).toHaveBeenCalledWith({ maxAgeHours: 24 });
    expect(container.innerHTML).toBe('');
  });

  it('continues the update check when cache cleanup fails', async () => {
    const cleanupError = new Error('cleanup failed');
    cleanupUpdateCacheMock.mockRejectedValue(cleanupError);

    render(<AppUpdateGate />);

    await waitFor(() => expect(hookValue.checkForUpdate).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(loggerWarnMock).toHaveBeenCalledWith(
      'Android update cache cleanup failed.',
      cleanupError,
      { context: 'AppUpdateGate.cleanup' },
    ));
  });

  it('does not check for an update when automatic checks are disabled', async () => {
    getAutoCheckEnabledMock.mockResolvedValue(false);

    render(<AppUpdateGate />);

    await waitFor(() => expect(getAutoCheckEnabledMock).toHaveBeenCalledTimes(1));
    expect(hookValue.checkForUpdate).not.toHaveBeenCalled();
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
