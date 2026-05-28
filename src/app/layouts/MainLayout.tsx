import { useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  List,
  PlusCircle,
  PieChart,
  MoreHorizontal,
  BarChart3,
  Wallet,
  RefreshCcw,
  Settings,
  X,
  Download,
  Database,
  Tags,
} from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { useConfirm } from '@/shared/components/ConfirmDialog/ConfirmContext';
import { useLanguage } from '@/shared/context/LanguageContext';
import { consumeAppBackButton } from '@/shared/utils/app-back-stack';
import { getParentRoute } from '@/shared/utils/route-parent';
import './MainLayout.css';

export function MainLayout() {
  const { t } = useLanguage();
  const { confirm } = useConfirm();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'none'>('none');
  const drawerOpenRef = useRef(drawerOpen);
  const confirmingExitRef = useRef(false);

  useEffect(() => {
    drawerOpenRef.current = drawerOpen;
  }, [drawerOpen]);

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return;

    let removeListener: (() => Promise<void>) | undefined;

    async function registerBackButton() {
      const listener = await CapacitorApp.addListener(
        'backButton',
        async ({ canGoBack }: { canGoBack: boolean }) => {
          if (drawerOpenRef.current) {
            setDrawerOpen(false);
            return;
          }

          if (consumeAppBackButton()) {
            return;
          }

          const parentRoute = getParentRoute(location.pathname);
          if (parentRoute) {
            navigate(parentRoute);
            return;
          }

          if (canGoBack && location.pathname !== ROUTES.HOME) {
            navigate(-1);
            return;
          }

          if (confirmingExitRef.current) return;

          confirmingExitRef.current = true;
          const shouldExit = await confirm({
            title: t('app.exit_title'),
            message: t('app.exit_message'),
            confirmText: t('app.exit_confirm'),
            cancelText: t('app.stay'),
          });
          confirmingExitRef.current = false;

          if (shouldExit) {
            await CapacitorApp.exitApp();
          }
        },
      );

      removeListener = () => listener.remove();
    }

    void registerBackButton();

    return () => {
      if (removeListener) {
        void removeListener();
      }
    };
  }, [confirm, location.pathname, navigate]);

  const menuItems = [
    { icon: <Wallet size={22} />, label: t('wallets.title'), route: ROUTES.WALLETS },
    { icon: <Tags size={22} />, label: t('categories.title'), route: ROUTES.CATEGORIES },
    { icon: <BarChart3 size={22} />, label: t('navigation.reports'), route: ROUTES.REPORTS },
    {
      icon: <RefreshCcw size={22} />,
      label: t('recurring_bills.title'),
      route: ROUTES.RECURRING_BILLS,
    },
    { icon: <Download size={22} />, label: t('reports.export'), route: ROUTES.EXPORT },
    { icon: <Database size={22} />, label: t('settings.backup_restore'), route: ROUTES.BACKUP },
    { icon: <Settings size={22} />, label: t('navigation.settings'), route: ROUTES.SETTINGS },
  ];
  const moreRoutes = menuItems.map((item) => item.route);
  const activeNavIndex =
    location.pathname === ROUTES.HOME
      ? 0
      : location.pathname.startsWith(ROUTES.TRANSACTIONS_NEW)
        ? 2
        : location.pathname.startsWith(ROUTES.TRANSACTIONS)
          ? 1
          : location.pathname.startsWith(ROUTES.BUDGETS)
            ? 3
            : moreRoutes.some((route) => location.pathname.startsWith(route))
              ? 4
              : 0;
  const isMoreActive = drawerOpen || activeNavIndex === 4;
  const activeNavIndexRef = useRef(activeNavIndex);

  useEffect(() => {
    activeNavIndexRef.current = activeNavIndex;
  }, [activeNavIndex]);

  function prepareSlide(nextIndex: number) {
    const currentIndex = activeNavIndexRef.current;
    if (nextIndex === currentIndex) {
      setSlideDirection('none');
      return;
    }

    setSlideDirection(nextIndex > currentIndex ? 'left' : 'right');
  }

  return (
    <div className="app-container">
      <main className="main-content">
        <div
          key={location.pathname}
          className={`main-content-page main-content-page--slide-${slideDirection}`}
        >
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <div className="bottom-nav__side bottom-nav__side--left">
          <NavLink
            to={ROUTES.HOME}
            onClick={() => prepareSlide(0)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
          >
            <Home size={22} />
            <span>{t('navigation.home')}</span>
          </NavLink>
          <NavLink
            to={ROUTES.TRANSACTIONS}
            onClick={() => prepareSlide(1)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            end
          >
            <List size={22} />
            <span>{t('navigation.history')}</span>
          </NavLink>
        </div>
        <NavLink
          to={ROUTES.TRANSACTIONS_NEW}
          onClick={() => prepareSlide(2)}
          className={({ isActive }) => `nav-item nav-item--fab ${isActive ? 'active' : ''}`}
          aria-label={t('navigation.add')}
        >
          <PlusCircle size={34} />
        </NavLink>
        <div className="bottom-nav__side bottom-nav__side--right">
          <NavLink
            to={ROUTES.BUDGETS}
            onClick={() => prepareSlide(3)}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <PieChart size={22} />
            <span>{t('navigation.budgets')}</span>
          </NavLink>
          <button
            className={`nav-item ${isMoreActive ? 'active' : ''}`}
            onClick={() => setDrawerOpen(true)}
          >
            <MoreHorizontal size={22} />
            <span>{t('navigation.more')}</span>
          </button>
        </div>
      </nav>

      {/* Bottom Drawer */}
      {drawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          <div className="drawer-sheet">
            <div className="drawer-handle" />
            <div className="drawer-header">
              <span className="drawer-title">{t('navigation.more')}</span>
              <button className="drawer-close" onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="drawer-grid">
              {menuItems.map((item) => (
                <button
                  key={item.route}
                  className="drawer-grid-item"
                  onClick={() => {
                    prepareSlide(4);
                    navigate(item.route);
                    setDrawerOpen(false);
                  }}
                >
                  <div className="drawer-grid-icon">{item.icon}</div>
                  <span className="drawer-grid-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
