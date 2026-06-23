import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_UI_PERSONALIZATION_SETTINGS,
  updateUiPersonalizationSettings,
} from '@/modules/settings/services/ui-personalization-settings.service';
import { useUiPersonalizationSettings } from './useUiPersonalizationSettings';

describe('useUiPersonalizationSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads current ui personalization settings', () => {
    updateUiPersonalizationSettings({ fontSize: 'large' });

    const { result } = renderHook(() => useUiPersonalizationSettings());

    expect(result.current.fontSize).toBe('large');
  });

  it('reloads settings when the service dispatches a change event', () => {
    const { result } = renderHook(() => useUiPersonalizationSettings());

    expect(result.current).toEqual(DEFAULT_UI_PERSONALIZATION_SETTINGS);

    act(() => {
      updateUiPersonalizationSettings({ listDensity: 'compact' });
    });

    expect(result.current.listDensity).toBe('compact');
  });
});
