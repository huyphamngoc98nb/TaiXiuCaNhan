import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useUiPersonalizationSettings } from '@/shared/hooks/useUiPersonalizationSettings';
import { getStartupScreenRoute } from '@/shared/utils/startup-screen';

const STARTUP_REDIRECT_APPLIED_KEY = 'ui.startup_screen_redirect_applied';

function hasStartupRedirectBeenApplied(): boolean {
  try {
    return sessionStorage.getItem(STARTUP_REDIRECT_APPLIED_KEY) === 'true';
  } catch {
    return true;
  }
}

function markStartupRedirectApplied(): void {
  try {
    sessionStorage.setItem(STARTUP_REDIRECT_APPLIED_KEY, 'true');
  } catch {
    // Treat storage failures conservatively: do not keep attempting redirects.
  }
}

export function StartupScreenRedirector() {
  const { startupScreen } = useUiPersonalizationSettings();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasStartupRedirectBeenApplied()) return;

    const isInitialHomeRoute = location.pathname === ROUTES.HOME;
    markStartupRedirectApplied();

    if (!isInitialHomeRoute) return;

    const targetRoute = getStartupScreenRoute(startupScreen);
    if (targetRoute !== location.pathname) {
      navigate(targetRoute, { replace: true });
    }
  }, [location.pathname, navigate, startupScreen]);

  return null;
}
