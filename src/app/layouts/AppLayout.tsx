import { Outlet, NavLink } from 'react-router-dom';
import { Home, List, PlusCircle, Settings, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import './AppLayout.css';

export function AppLayout() {
  const { t } = useLanguage();

  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <Home size={24} />
          <span>{t('navigation.home')}</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <List size={24} />
          <span>{t('navigation.history')}</span>
        </NavLink>
        <NavLink to="/transactions/new" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PlusCircle size={24} />
          <span>{t('navigation.add')}</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={24} />
          <span>{t('navigation.settings')}</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart3 size={24} />
          <span>{t('navigation.reports')}</span>
        </NavLink>
      </nav>
    </div>
  );
}
