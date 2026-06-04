import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';

function ScrollLockHarness({ first, second = false }: { first: boolean; second?: boolean }) {
  useBodyScrollLock(first);
  useBodyScrollLock(second);
  return null;
}

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('body-scroll-locked');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('body-scroll-locked');
  });

  it('locks body scroll and restores previous inline body styles', () => {
    document.body.style.overflow = 'clip';

    const { rerender } = render(<ScrollLockHarness first />);

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.classList.contains('body-scroll-locked')).toBe(true);

    rerender(<ScrollLockHarness first={false} />);

    expect(document.body.style.overflow).toBe('clip');
    expect(document.body.classList.contains('body-scroll-locked')).toBe(false);
  });

  it('keeps body locked until all active locks are released', () => {
    const { rerender } = render(<ScrollLockHarness first second />);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<ScrollLockHarness first second={false} />);

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.classList.contains('body-scroll-locked')).toBe(true);

    rerender(<ScrollLockHarness first={false} second={false} />);

    expect(document.body.style.overflow).toBe('');
    expect(document.body.classList.contains('body-scroll-locked')).toBe(false);
  });
});
