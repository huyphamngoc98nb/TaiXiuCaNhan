import { ROUTES } from '@/shared/constants/routes';

export function getParentRoute(pathname: string): string | null {
  if (pathname === ROUTES.HOME) return null;

  if (pathname === ROUTES.TRANSACTIONS_NEW) return ROUTES.TRANSACTIONS;
  if (pathname.startsWith('/transactions/') && pathname.endsWith('/edit')) {
    return ROUTES.TRANSACTIONS;
  }
  if (pathname === ROUTES.TRANSACTIONS) return ROUTES.HOME;

  if (pathname === ROUTES.RECURRING_BILLS_NEW) return ROUTES.RECURRING_BILLS;
  if (pathname.startsWith('/recurring-bills/') && pathname.endsWith('/edit')) {
    return ROUTES.RECURRING_BILLS;
  }

  if (pathname === ROUTES.BUDGETS_NEW) return ROUTES.BUDGETS;
  if (pathname === ROUTES.CATEGORIES_NEW) return ROUTES.CATEGORIES;
  if (pathname === ROUTES.WALLETS_NEW) return ROUTES.WALLETS;
  if (pathname === ROUTES.CATEGORIES) return ROUTES.SETTINGS;
  if (pathname === ROUTES.WALLETS) return ROUTES.SETTINGS;
  if (pathname === ROUTES.BACKUP) return ROUTES.SETTINGS;
  if (pathname === ROUTES.EXPORT) return ROUTES.REPORTS;

  return null;
}
