import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit, Key, Trash2, Mail, Lock, User, ShoppingBag, ShieldCheck, ShieldAlert, Users, DollarSign, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const { addToast } = useToast();
  const { t, formatPrice, language } = useLanguage();

  // Form States
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'CUSTOMER' });
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });

  const fetchCustomers = useCallback(async () => {
    // Defer state update to prevent synchronous setState inside useEffect warnings
    await Promise.resolve();
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      } else {
        addToast(t('customersLoadError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('customersConnError'), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email) return;

    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm)
      });
      if (res.ok) {
        addToast(t('customersCreateSuccess'), 'success');
        setShowCreateModal(false);
        setCreateForm({ name: '', email: '', password: '', role: 'CUSTOMER' });
        fetchCustomers();
      } else {
        const data = await res.json();
        addToast(data.error || t('customersCreateError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('customersCreateError'), 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        addToast(t('customersUpdateSuccess'), 'success');
        setShowEditModal(false);
        fetchCustomers();
      } else {
        const data = await res.json();
        addToast(data.error || t('customersUpdateError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('customersUpdateError'), 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      addToast(t('profilePasswordMismatch'), 'error');
      return;
    }
    if (passwordForm.password.length < 8) {
      addToast(t('profileNewPassword'), 'error'); // minimum 8 characters message
      return;
    }

    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForm.password })
      });
      if (res.ok) {
        addToast(t('customersPasswordSuccess'), 'success');
        setShowPasswordModal(false);
        setPasswordForm({ password: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        addToast(data.error || t('customersPasswordError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('customersPasswordError'), 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(t('customersConfirmDelete', { name }))) return;

    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast(t('customersDeleteSuccess'), 'success');
        fetchCustomers();
      } else {
        const data = await res.json();
        addToast(data.error || t('customersDeleteError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('customersDeleteError'), 'error');
    }
  };

  const handleOpenOrdersModal = async (customer) => {
    setSelectedCustomer(customer);
    setShowOrdersModal(true);
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}/orders`);
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders(data);
      } else {
        addToast(t('customersLoadError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('customersLoadError'), 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  const calculateTotalSpent = (customer) => {
    return customer.orders?.reduce((sum, o) => sum + o.total, 0) || 0;
  };

  // Filter and Sort Logic
  const filteredAndSortedCustomers = customers
    .filter(c => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(query) || 
                            c.email.toLowerCase().includes(query) ||
                            c.id.toLowerCase().includes(query);
                            
      const matchesRole = roleFilter === 'ALL' || c.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'NAME_AZ') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'NAME_ZA') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'MOST_ORDERS') {
        const ordersA = a._count?.orders || 0;
        const ordersB = b._count?.orders || 0;
        return ordersB - ordersA;
      }
      if (sortBy === 'HIGHEST_SPENT') {
        return calculateTotalSpent(b) - calculateTotalSpent(a);
      }
      return 0;
    });

  // Role Badges
  const renderRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <ShieldAlert size={12} /> ADMIN
          </span>
        );
      case 'EMPLOYEE':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <ShieldCheck size={12} /> {language === 'pt' ? 'EQUIPE' : 'STAFF'}
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <User size={12} /> {language === 'pt' ? 'CLIENTE' : 'CUSTOMER'}
          </span>
        );
    }
  };

  // Order status badge
  const renderStatusBadge = (status) => {
    const statusStyles = {
      PENDING: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.3)', color: '#eab308', text: t('ordersStatusPending') },
      PROCESSING: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6', text: t('ordersStatusProcessing') },
      SHIPPED: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', color: '#8b5cf6', text: t('ordersStatusShipped') },
      DELIVERED: { bg: 'rgba(0, 255, 136, 0.1)', border: 'rgba(0, 255, 136, 0.3)', color: 'var(--primary-color)', text: t('ordersStatusDelivered') },
      CANCELLED: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', text: t('ordersStatusCancelled') }
    };
    const current = statusStyles[status] || statusStyles.PENDING;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-sm)', background: current.bg, border: `1px solid ${current.border}`, color: current.color, fontSize: '0.75rem', fontWeight: 'bold' }}>
        {current.text}
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>{t('customersTitle')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>
            {language === 'pt' 
              ? 'Gerencie perfis, cargos, redefinição de senhas e visualize históricos de compras' 
              : 'Manage player profiles, permissions, passwords and view purchase history logs'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchCustomers} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} title={language === 'pt' ? 'Recarregar' : 'Reload'}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> {language === 'pt' ? 'Recarregar' : 'Reload'}
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Plus size={18} /> {t('customersNewBtn')}
          </button>
        </div>
      </div>

      {/* CRM Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{language === 'pt' ? 'Total de Usuários' : 'Total Registered Users'}</span>
            <h3 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0', fontWeight: 'bold' }}>{customers.length}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(0, 255, 136, 0.1)', color: 'var(--primary-color)' }}>
            <User size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('customersFilterCustomer')}</span>
            <h3 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {customers.filter(c => c.role === 'CUSTOMER').length}
            </h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('adminStaff')}</span>
            <h3 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0', fontWeight: 'bold', color: '#8b5cf6' }}>
              {customers.filter(c => c.role === 'EMPLOYEE' || c.role === 'ADMIN').length}
            </h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{language === 'pt' ? 'Volume Gasto (CRM)' : 'Total Spent (CRM)'}</span>
            <h3 style={{ fontSize: '1.75rem', margin: '0.25rem 0 0', fontWeight: 'bold', color: '#eab308' }}>
              {formatPrice(customers.reduce((sum, c) => sum + calculateTotalSpent(c), 0))}
            </h3>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder={t('customersSearchPlaceholder')} 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1.5rem 0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <option value="ALL">{t('customersFilterAll')}</option>
            <option value="CUSTOMER">{t('customersFilterCustomer')}</option>
            <option value="EMPLOYEE">{language === 'pt' ? 'Funcionários' : 'Staff Members'}</option>
            <option value="ADMIN">{t('customersFilterAdmin')}</option>
          </select>
        </div>

        <div style={{ minWidth: '200px' }}>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1.5rem 0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            <option value="NEWEST">{t('customersSortNewest')}</option>
            <option value="NAME_AZ">{t('customersSortNameAZ')}</option>
            <option value="NAME_ZA">{t('customersSortNameZA')}</option>
            <option value="MOST_ORDERS">{language === 'pt' ? 'Mais Compras' : 'Most Orders'}</option>
            <option value="HIGHEST_SPENT">{language === 'pt' ? 'Maior Valor Gasto' : 'Highest Spent'}</option>
          </select>
        </div>
      </div>

      {/* CRM Database Table */}
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'visible' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{t('customersThCustomer')} / ID</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{language === 'pt' ? 'E-mail' : 'Email'}</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>{t('customersThRole')}</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>{t('customersThJoined')}</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>{t('customersThOrders')}</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>{t('customersThSpent')}</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>{t('customersThActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCustomers.map(customer => {
                const totalSpent = calculateTotalSpent(customer);
                return (
                  <tr key={customer.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: customer.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : customer.role === 'EMPLOYEE' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 255, 136, 0.1)', color: customer.role === 'ADMIN' ? '#ef4444' : customer.role === 'EMPLOYEE' ? '#3b82f6' : 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.95rem' }}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{customer.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {customer.id.split('-')[0].toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                        <Mail size={15} /> {customer.email}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      {renderRoleBadge(customer.role)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {new Date(customer.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <span style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.15)', color: 'var(--primary-color)', padding: '0.25rem 0.65rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {customer._count?.orders || 0} {language === 'pt' ? 'un' : 'pcs'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 'bold', color: totalSpent > 0 ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                      {formatPrice(totalSpent)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleOpenOrdersModal(customer)} 
                          className="btn btn-outline btn-sm" 
                          style={{ padding: '0.5rem', borderColor: 'rgba(0, 255, 136, 0.15)' }} 
                          title={language === 'pt' ? 'Visualizar Histórico de Compras' : 'View Purchase History'}
                        >
                          <ShoppingBag size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setEditForm({ name: customer.name, email: customer.email, role: customer.role || 'CUSTOMER' });
                            setShowEditModal(true);
                          }} 
                          className="btn btn-outline btn-sm" 
                          style={{ padding: '0.5rem' }} 
                          title={language === 'pt' ? 'Editar Perfil' : 'Edit Profile'}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowPasswordModal(true);
                          }} 
                          className="btn btn-outline btn-sm" 
                          style={{ padding: '0.5rem', color: '#ffb703', borderColor: 'rgba(255, 183, 3, 0.2)' }} 
                          title={language === 'pt' ? 'Alterar Senha' : 'Change Password'}
                        >
                          <Key size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id, customer.name)} 
                          className="btn btn-outline btn-sm" 
                          style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} 
                          title={language === 'pt' ? 'Remover Usuário' : 'Remove User'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredAndSortedCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {language === 'pt' 
                      ? 'Nenhum usuário cadastrado no CRM atende a estes critérios de pesquisa.' 
                      : 'No users found matching the search criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 10000 }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="var(--primary-color)" /> {t('customersCreateModalTitle')}
            </h2>
            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormName').toUpperCase()}</label>
                <input type="text" required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} placeholder="Ex: João Silva" style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormEmail').toUpperCase()}</label>
                <input type="email" required value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} placeholder="joao@exemplo.com" style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormPassword').toUpperCase()}</label>
                <input type="password" required value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} placeholder="••••••••" style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormRole').toUpperCase()}</label>
                <select value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <option value="CUSTOMER">{language === 'pt' ? 'Cliente Padrão' : 'Standard Customer'}</option>
                  <option value="EMPLOYEE">{language === 'pt' ? 'Funcionário da Equipe' : 'Staff Member'}</option>
                  <option value="ADMIN">{language === 'pt' ? 'Administrador Geral' : 'System Administrator'}</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline" style={{ flex: 1 }}>{t('productsCancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{t('customersNewBtn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 10000 }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit size={20} color="var(--primary-color)" /> {t('customersEditModalTitle')}
            </h2>
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormName').toUpperCase()}</label>
                <input type="text" required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormEmail').toUpperCase()}</label>
                <input type="email" required value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormRole').toUpperCase()}</label>
                <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <option value="CUSTOMER">{language === 'pt' ? 'Cliente Padrão' : 'Standard Customer'}</option>
                  <option value="EMPLOYEE">{language === 'pt' ? 'Funcionário da Equipe' : 'Staff Member'}</option>
                  <option value="ADMIN">{language === 'pt' ? 'Administrador Geral' : 'System Administrator'}</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline" style={{ flex: 1 }}>{t('productsCancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{language === 'pt' ? 'Salvar Dados' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 10000 }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} color="#ffb703" /> {t('customersPasswordModalTitle')}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {language === 'pt' 
                ? 'Você está forçando uma nova senha para o usuário: ' 
                : 'You are resetting the security password for user: '} 
              <strong>{selectedCustomer?.name}</strong>.
            </p>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormPasswordNew').toUpperCase()}</label>
                <input type="password" required value={passwordForm.password} onChange={e => setPasswordForm({...passwordForm, password: e.target.value})} placeholder={language === 'pt' ? 'Mínimo 8 caracteres...' : 'Minimum 8 characters...'} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('customersFormPasswordConfirm').toUpperCase()}</label>
                <input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} placeholder={language === 'pt' ? 'Repita a nova senha...' : 'Repeat the new password...'} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn btn-outline" style={{ flex: 1 }}>{t('productsCancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: '#ffb703', borderColor: '#ffb703', color: 'black' }}>{language === 'pt' ? 'Redefinir Senha' : 'Reset Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT ORDERS MODAL */}
      {showOrdersModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 10000 }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', position: 'relative' }}>
            <h2 style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} color="var(--primary-color)" /> {t('customersOrdersModalTitle', { name: '' }).split(' - ')[0]}
            </h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedCustomer?.name}</p>
              <p style={{ margin: '0.1rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedCustomer?.email}</p>
            </div>

            {loadingOrders ? (
              <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                {t('customersOrdersLoading')}
              </div>
            ) : customerOrders.length === 0 ? (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                {t('customersOrdersEmpty')}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {customerOrders.map(order => (
                  <div key={order.id} className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ID: {order.id.split('-')[0].toUpperCase()}</span>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          {language === 'pt' ? 'Realizado em:' : 'Placed on:'} {new Date(order.createdAt).toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US')}
                        </div>
                      </div>
                      <div>
                        {renderStatusBadge(order.status)}
                      </div>
                    </div>
                    
                    {/* Items in this order */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem 0', margin: '0.75rem 0' }}>
                      {order.items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.25rem 0' }}>
                          <span style={{ color: 'var(--text-main)' }}>
                            {item.quantity}x {item.product?.name || 'Produto Removido'}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{language === 'pt' ? 'Total do Pedido:' : 'Order Total:'}</span>
                      <span style={{ color: 'var(--primary-color)' }}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <button type="button" onClick={() => setShowOrdersModal(false)} className="btn btn-outline" style={{ marginLeft: 'auto', minWidth: '120px' }}>{language === 'pt' ? 'Fechar' : 'Close'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
