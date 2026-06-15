import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RecoveryService } from '@/core/auth/recovery.service';
import {
  completeResetNavigationState,
  resetLocalDataStorage,
} from '@/core/db/reset-local-data';

vi.mock('@/core/db/reset-local-data', () => ({
  completeResetNavigationState: vi.fn(),
  resetLocalDataStorage: vi.fn(),
}));

describe('RecoveryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs the reset storage flow', async () => {
    await new RecoveryService().resetLocalData();

    expect(resetLocalDataStorage).toHaveBeenCalledTimes(1);
  });

  it('does not report success when storage reset fails', async () => {
    vi.mocked(resetLocalDataStorage).mockRejectedValueOnce(new Error('delete failed'));
    await expect(new RecoveryService().resetLocalData()).rejects.toThrow('delete failed');
  });

  it('marks navigation state complete after reset succeeds', () => {
    new RecoveryService().completeResetNavigationState();

    expect(completeResetNavigationState).toHaveBeenCalledTimes(1);
  });
});
