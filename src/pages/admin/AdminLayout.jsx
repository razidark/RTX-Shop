import { Link, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, ShieldAlert } from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  // Protect Admin Route
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '250px', padding: '2rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border-color)', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>{t('adminPanel')}</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>RTX Shop</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          <Link to="/admin" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/produtos" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <Package size={20} /> {t('adminProducts')}
          </Link>
          <Link to="/admin/pedidos" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <ShoppingBag size={20} /> {t('adminOrders')}
          </Link>
          <Link to="/admin/clientes" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <Users size={20} /> {t('adminCustomers')}
          </Link>
          <Link to="/admin/equipe" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none' }}>
            <ShieldAlert size={20} /> {t('adminStaff')}
          </Link>
        </nav>

        <button onClick={logout} className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: '#ef4444' }}>
          <LogOut size={20} /> {t('adminExit')}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
