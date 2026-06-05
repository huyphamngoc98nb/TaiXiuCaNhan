import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollRestoration } from '@/shared/hooks/useScrollRestoration';

function ScrollRestorationHarness({ scrollKey }: { scrollKey: string }) {
  const scrollRef = useScrollRestoration<HTMLDivElement>(scrollKey);

  return (
    <div ref={scrollRef} data-testid="route-scroll" style={{ height: 100, overflowY: 'auto' }}>
      <div style={{ height: 1000 }} />
    </div>
  );
}

describe('useScrollRestoration', () => {
  beforeEach(() => {
    let frameId = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frameId += 1;
      callback(0);
      return frameId;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores independent scroll positions per route key', () => {
    const { rerender } = render(<ScrollRestorationHarness scrollKey="form-a" />);
    const scrollContainer = screen.getByTestId('route-scroll');

    scrollContainer.scrollTop = 300;
    rerender(<ScrollRestorationHarness scrollKey="form-b" />);

    expect(scrollContainer.scrollTop).toBe(0);

    scrollContainer.scrollTop = 500;
    rerender(<ScrollRestorationHarness scrollKey="form-a" />);

    expect(scrollContainer.scrollTop).toBe(300);
  });
});
