import { describe, expect, it } from 'vitest';
import { ROUTES } from '@/shared/constants/routes';
import { getStartupScreenRoute } from './startup-screen';

describe('getStartupScreenRoute', () => {
  it('maps startup screen settings to app routes', () => {
    expect(getStartupScreenRoute('dashboard')).toBe(ROUTES.HOME);
    expect(getStartupScreenRoute('transactions')).toBe(ROUTES.TRANSACTIONS);
    expect(getStartupScreenRoute('budgets')).toBe(ROUTES.BUDGETS);
    expect(getStartupScreenRoute('reports')).toBe(ROUTES.REPORTS);
    expect(getStartupScreenRoute('wallets')).toBe(ROUTES.WALLETS);
  });
});
