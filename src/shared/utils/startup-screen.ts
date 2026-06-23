import { ROUTES } from '@/shared/constants/routes';
import type { StartupScreen } from '@/modules/settings/services/ui-personalization-settings.service';

export const STARTUP_SCREEN_ROUTE_MAP: Record<StartupScreen, string> = {
  dashboard: ROUTES.HOME,
  transactions: ROUTES.TRANSACTIONS,
  budgets: ROUTES.BUDGETS,
  reports: ROUTES.REPORTS,
  wallets: ROUTES.WALLETS,
};

export function getStartupScreenRoute(screen: StartupScreen): string {
  return STARTUP_SCREEN_ROUTE_MAP[screen] ?? ROUTES.HOME;
}
