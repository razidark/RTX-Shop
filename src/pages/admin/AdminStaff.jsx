import { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { addToast } = useToast();
  const { t, language } = useLanguage();

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaff();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('staffConfirmDelete'))) return;

    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast(t('staffDeleteSuccess'), 'success');
        fetchStaff();
      } else {
        const data = await res.json();
        addToast(data.error || t('staffDeleteError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('staffDeleteError'), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        addToast(t('staffCreateSuccess'), 'success');
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
        fetchStaff();
      } else {
        const data = await res.json();
        addToast(data.error || t('staffCreateError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('staffCreateError'), 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>{t('staffTitle')}</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={20} /> {t('staffNewBtn')}
        </button>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('staffThName')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('staffThEmail')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('staffThJoined')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('staffThRole')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('staffThActions')}</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{member.name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{member.email}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{new Date(member.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase', fontWeight: '700' }}>
                    <ShieldCheck size={12} /> {t('staffFormRoleBadge')}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <button onClick={() => handleDelete(member.id)} className="btn btn-outline btn-sm" style={{ padding: '0.5rem', color: '#ef4444' }} title={t('staffThActions')}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {t('staffEmpty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '450px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{t('staffCreateModalTitle')}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder={t('staffFormName')} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              <input type="email" placeholder={t('staffFormEmail')} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              <input type="password" placeholder={t('staffFormPassword')} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>{t('productsCancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{t('staffNewBtn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
