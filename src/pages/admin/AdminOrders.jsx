import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Package, Truck, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

function StatusDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const options = [
    { value: 'PENDING', label: t('ordersStatusPending') },
    { value: 'PROCESSING', label: t('ordersStatusProcessing') },
    { value: 'SHIPPED', label: t('ordersStatusShipped') },
    { value: 'DELIVERED', label: t('ordersStatusDelivered') },
    { value: 'CANCELLED', label: t('ordersStatusCancelled') }
  ];

  const currentOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div style={{ position: 'relative', width: '150px', zIndex: 10 }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-hover)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'all 0.2s',
          outline: 'none'
        }}
      >
        <span>{currentOption.label}</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} 
          />
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            background: 'rgba(20, 20, 25, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            overflow: 'hidden'
          }}>
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '0.65rem 1rem',
                  fontSize: '0.875rem',
                  color: opt.value === value ? 'var(--primary-color)' : 'white',
                  background: opt.value === value ? 'rgba(0, 255, 136, 0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--surface-hover)';
                  e.target.style.color = 'var(--primary-color)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = opt.value === value ? 'rgba(0, 255, 136, 0.05)' : 'transparent';
                  e.target.style.color = opt.value === value ? 'var(--primary-color)' : 'white';
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { addToast } = useToast();
  const { formatPrice, t, language } = useLanguage();

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchOrders();
  }, []);

  const getStatusLabel = (status) => {
    switch(status) {
      case 'PENDING': return t('ordersStatusPending');
      case 'PROCESSING': return t('ordersStatusProcessing');
      case 'SHIPPED': return t('ordersStatusShipped');
      case 'DELIVERED': return t('ordersStatusDelivered');
      case 'CANCELLED': return t('ordersStatusCancelled');
      default: return status;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        addToast(t('ordersStatusUpdated', { status: getStatusLabel(newStatus) }), 'success');
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      addToast(t('ordersStatusError'), 'error');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(t('ordersConfirmDelete'))) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast(t('ordersDeleteSuccess'), 'success');
        fetchOrders();
      } else {
        const data = await res.json();
        addToast(data.error || t('ordersDeleteError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('ordersDeleteError'), 'error');
    }
  };

  const handleDeleteAllOrders = async () => {
    if (!window.confirm(t('ordersConfirmClearAll'))) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast(t('ordersClearSuccess'), 'success');
        fetchOrders();
      } else {
        const data = await res.json();
        addToast(data.error || t('ordersClearError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('ordersClearError'), 'error');
    }
  };

  const handleExportOrders = () => {
    if (orders.length === 0) {
      addToast(t('ordersExportEmpty'), 'error');
      return;
    }
    const headers = [
      t('ordersThId'), 
      t('ordersThCustomer'), 
      'E-mail', 
      t('ordersThDate'), 
      `${t('ordersThTotal')} (${language === 'pt' ? 'R$' : 'USD'})`, 
      t('ordersThStatus'), 
      'Itens', 
      'Endereco'
    ];
    const csvRows = [
      headers.join(','),
      ...orders.map(order => {
        const itemsStr = order.items?.map(it => `${it.quantity}x ${it.product?.name || 'Produto'}`).join(' | ') || '';
        return [
          `"${order.id}"`,
          `"${order.user?.name || ''}"`,
          `"${order.user?.email || ''}"`,
          `"${new Date(order.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}"`,
          `"${order.total.toFixed(2)}"`,
          `"${getStatusLabel(order.status)}"`,
          `"${itemsStr.replace(/"/g, '""')}"`,
          `"${(order.address || '').replace(/"/g, '""')}"`
        ].join(',');
      })
    ];
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rtx-shop-pedidos-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(t('ordersExportSuccess'), 'success');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'var(--accent-color)';
      case 'PROCESSING': return 'var(--primary-color)';
      case 'SHIPPED': return '#3b82f6';
      case 'DELIVERED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{t('ordersTitle')}</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExportOrders} className="btn btn-outline btn-sm">
            {t('ordersExport')}
          </button>
          {orders.length > 0 && (
            <button onClick={handleDeleteAllOrders} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              {t('ordersClear')}
            </button>
          )}
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('ordersThId')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('ordersThCustomer')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('ordersThDate')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('ordersThTotal')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('ordersThStatus')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('ordersThActions')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace' }}>{order.id.split('-')[0].toUpperCase()}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{order.user?.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>{new Date(order.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>{formatPrice(order.total)}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.875rem',
                    background: `rgba(255,255,255,0.1)`, 
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}`
                  }}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <StatusDropdown 
                      value={order.status} 
                      onChange={(newStatus) => handleStatusChange(order.id, newStatus)} 
                    />
                    <button 
                      onClick={() => handleDeleteOrder(order.id)} 
                      className="btn btn-outline btn-sm" 
                      style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      title={t('ordersThActions')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {t('ordersEmpty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
