import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import GamerAvatar from '../components/GamerAvatar';
import { AVATAR_PRESETS } from '../constants/avatars';
import { User, Shield, Key, Mail, Edit3, Camera, Save, Lock, ShoppingBag, Calendar, MapPin, Trash2, ShoppingCart, Heart, AlertTriangle } from 'lucide-react';
 
export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { language, t, formatPrice } = useLanguage();
  const { addToast } = useToast();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
 
  const [name, setName] = useState(() => user?.name || '');
  const [avatar, setAvatar] = useState(() => user?.avatar || '');
  const [customAvatar, setCustomAvatar] = useState(() => {
    return user?.avatar && !user.avatar.startsWith('preset:') ? user.avatar : '';
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
 
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const stepsList = [
    { key: 'PENDING', label: language === 'pt' ? 'Pendente' : 'Pending' },
    { key: 'PROCESSING', label: language === 'pt' ? 'Processando' : 'Processing' },
    { key: 'SHIPPED', label: language === 'pt' ? 'Enviado' : 'Shipped' },
    { key: 'DELIVERED', label: language === 'pt' ? 'Entregue' : 'Delivered' }
  ];

  const getStatusIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 0;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        setLoadingOrders(true);
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleDownloadInvoice = (order) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    
    let text = `==================================================
              RTX SHOP TERMINAL INVOICE
==================================================
SECURE PROTOCOL CLEARANCE: LEVEL_01_CUSTOMER
TRANSACTION ID: #${order.id}
TIMESTAMP: ${orderDate}
PLAYER/BUYER: ${user.name} (${user.email})
STATUS: CONFIRMED_AND_PAID
==================================================
ITEMS SECURED IN CARGO HOVER:
--------------------------------------------------\n`;

    order.items.forEach((item, index) => {
      const name = item.product?.name || 'Gamer Hardware';
      const qty = item.quantity;
      const unit = formatPrice(item.price);
      const total = formatPrice(item.price * qty);
      text += `[${index + 1}] ${qty}x ${name.padEnd(30)} | Price: ${unit} | Sub: ${total}\n`;
    });

    text += `--------------------------------------------------
DELIVERY COORDINATES:
${order.address}
==================================================
FINAL SETTLEMENT TOTAL: ${formatPrice(order.total)}
==================================================
SYSTEM LOG ENTRY:
>> INTEGRITY VERIFIED (SHA-256 HASH COMPLIANT)
>> DEMO TRANSACTION GATEWAY CLEARANCE APPROVED
>> THANK YOU FOR PRE-ORDERING YOUR CYBERPUNK SETUP
==================================================\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rtx-invoice-${order.id.slice(0, 8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast(language === 'pt' ? 'Recibo terminal baixado com sucesso!' : 'Terminal invoice successfully downloaded!', 'success');
  };



  if (!user) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', maxWidth: '500px', margin: '0 auto', border: '1px solid rgba(255, 42, 95, 0.2)' }}>
          <Shield size={48} color="#ff2a5f" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 8px rgba(255, 42, 95, 0.4))' }} />
          <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Acesso Restrito</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Você precisa fazer login para gerenciar o perfil.</p>
          <a href="/login" className="btn btn-primary" style={{ backgroundColor: '#ff2a5f', boxShadow: '0 4px 14px 0 rgba(255, 42, 95, 0.3)', color: 'var(--text-main)' }}>Entrar</a>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const finalAvatar = customAvatar.trim() ? customAvatar.trim() : avatar;
      await updateProfile(name, finalAvatar);
      addToast(t('profileUpdateSuccess'), 'success');
    } catch (err) {
      addToast(err.message || t('profileUpdateError'), 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast(t('profilePasswordMismatch'), 'error');
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('profilePasswordError'));
      }
      
      addToast(t('profilePasswordSuccess'), 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.message || t('profilePasswordError'), 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const selectPreset = (presetKey) => {
    setAvatar(presetKey);
    setCustomAvatar('');
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', minHeight: '85vh' }}>
      {/* Title Header */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.75rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          {t('profileTitle')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          {t('profileSubtitle')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Row 1: Profile Summary Card */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 255, 136, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative' }}>
            <GamerAvatar avatar={customAvatar || avatar} size={110} />
            <div style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary-color)', color: '#000', borderRadius: '50%', padding: '0.5rem', boxShadow: '0 0 10px rgba(0,255,136,0.5)' }}>
              <Camera size={16} />
            </div>
          </div>

          <div style={{ flex: '1', minWidth: '250px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', margin: 0, fontFamily: 'var(--font-heading)' }}>{user.name}</h2>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', background: user.role === 'ADMIN' ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.05)', color: user.role === 'ADMIN' ? 'var(--primary-color)' : 'var(--text-muted)', border: user.role === 'ADMIN' ? '1px solid rgba(0,255,136,0.3)' : '1px solid var(--border-color)', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                {user.role}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {t('profileRoleLabel')}: <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{user.role === 'ADMIN' ? 'Administrador do Sistema' : 'Cliente RTX Shop'}</span>
            </p>
          </div>
        </div>

        {/* Row 2: Grid containing settings form and password form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Box 1: Profile Details */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <User size={22} color="var(--primary-color)" />
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Informações Básicas</h3>
            </div>

            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('profileNameLabel')}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', paddingLeft: '2.5rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                  <Edit3 size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('profileAvatarLabel')}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.65rem', marginBottom: '1rem' }}>
                  {Object.keys(AVATAR_PRESETS).map((presetKey) => {
                    const isSelected = avatar === presetKey && !customAvatar;
                    return (
                      <button
                        key={presetKey}
                        type="button"
                        onClick={() => selectPreset(presetKey)}
                        title={presetKey.replace('preset:', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        style={{
                          background: 'none',
                          border: isSelected ? '2px solid var(--primary-color)' : '2px solid transparent',
                          borderRadius: '50%',
                          padding: '3px',
                          cursor: 'pointer',
                          transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: isSelected ? '0 0 14px rgba(0, 255, 136, 0.5)' : 'none',
                          filter: isSelected ? 'brightness(1.1)' : 'brightness(0.85)',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.filter = 'brightness(1)'; }}}
                        onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(0.85)'; }}}
                      >
                        <GamerAvatar avatar={presetKey} size={46} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('profileCustomAvatarLabel')}
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/avatar.jpg"
                  value={customAvatar}
                  onChange={(e) => {
                    setCustomAvatar(e.target.value);
                    if (e.target.value.trim()) setAvatar('');
                  }}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none', fontSize: '0.9rem' }}
                />
              </div>

              <button type="submit" disabled={isUpdatingProfile} className="btn btn-primary btn-cyber" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Save size={18} />
                {isUpdatingProfile ? 'Salvando...' : t('profileSaveBtn')}
              </button>
            </form>
          </div>

          {/* Box 2: Security & Password */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <Lock size={22} color="var(--primary-color)" />
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-heading)' }}>{t('profileSecurityTitle')}</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('profileCurrentPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('profileNewPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {t('profileConfirmPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <button type="submit" disabled={isUpdatingPassword} className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Key size={18} />
                {isUpdatingPassword ? 'Processando...' : t('profilePasswordBtn')}
              </button>
            </form>
          </div>

        </div>

        {/* Wishlist Panel */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <Heart size={24} color="var(--primary-color)" fill="var(--primary-color)" />
            <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {language === 'pt' ? 'Lista de Desejos' : 'Saved Hardware Wishlist'}
            </h3>
          </div>

          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '1.5rem' }}>{language === 'pt' ? 'Sua lista de desejos está vazia.' : 'Your wishlist is empty.'}</p>
              <a href="/produtos" className="btn btn-outline btn-sm">
                {t('cartBackToShop')}
              </a>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {wishlistItems.map(item => (
                <div key={item.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ width: '50px', height: '50px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = '/favicon.png'; }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '170px' }} title={item.name}>{item.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button 
                      onClick={() => addToCart(item)} 
                      className="btn btn-primary btn-sm" 
                      style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                    >
                      <ShoppingCart size={14} /> {t('detailsAddCart')}
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item.id)} 
                      className="btn btn-outline btn-sm" 
                      style={{ borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.4rem 0.65rem' }}
                      title="Remover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Row 3: Order History */}
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <ShoppingBag size={24} color="var(--primary-color)" />
            <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {language === 'pt' ? 'Histórico de Compras' : 'Gamer Order Log'}
            </h3>
          </div>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <p>{t('builderWaiting')}</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                {language === 'pt' ? 'Você ainda não realizou nenhuma compra gamer.' : 'Your combat log is empty. No orders placed yet.'}
              </p>
              <a href="/produtos" className="btn btn-primary btn-sm btn-cyber">
                {t('cartBackToShop')}
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {orders.map(order => {
                // Color status helper
                const getStatusColor = (status) => {
                  switch (status) {
                    case 'DELIVERED': return { bg: 'rgba(0, 255, 136, 0.1)', text: 'var(--primary-color)', border: 'rgba(0, 255, 136, 0.25)' };
                    case 'PENDING': return { bg: 'rgba(251, 133, 0, 0.1)', text: '#fb8500', border: 'rgba(251, 133, 0, 0.25)' };
                    case 'PROCESSING': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.25)' };
                    case 'SHIPPED': return { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.25)' };
                    case 'CANCELLED': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.25)' };
                    default: return { bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--text-muted)', border: 'var(--border-color)' };
                  }
                };
                const colors = getStatusColor(order.status);
                const orderDate = new Date(order.createdAt).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                return (
                  <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.01)', overflow: 'hidden' }}>
                    {/* Order Header */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>ID do Pedido</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-main)' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Data da Compra</span>
                          <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} color="var(--primary-color)" /> {orderDate}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-sm)', background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, letterSpacing: '1px' }}>
                        {order.status}
                      </span>
                    </div>

                    {/* Tracking Timeline */}
                    {order.status === 'CANCELLED' ? (
                      <div style={{ padding: '1.25rem 1.5rem', margin: '1rem 1.5rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-md)', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                        <span>Este pedido foi cancelado e reembolsado.</span>
                      </div>
                    ) : (
                      <div style={{ padding: '1.75rem 1.5rem 1.25rem', margin: '0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', gap: '1rem' }}>
                        {stepsList.map((step, idx) => {
                          const activeIdx = getStatusIndex(order.status);
                          const isDone = idx <= activeIdx;
                          const isCurrent = idx === activeIdx;
                          
                          return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1, minWidth: '80px', position: 'relative', zIndex: 2 }}>
                              <div style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: isDone ? 'var(--primary-color)' : 'var(--bg-color)',
                                border: `2px solid ${isDone ? 'var(--primary-color)' : 'var(--border-color)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none',
                                color: isDone ? '#000' : 'var(--text-muted)',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                              }}>
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: isCurrent ? 'bold' : '500', color: isCurrent ? 'var(--primary-color)' : 'var(--text-main)', textAlign: 'center' }}>{step.label}</span>
                            </div>
                          );
                        })}
                        
                        {/* Connecting Line Background */}
                        <div style={{
                          position: 'absolute',
                          top: '30px',
                          left: '3rem',
                          right: '3rem',
                          height: '2px',
                          background: 'rgba(255,255,255,0.05)',
                          zIndex: 1
                        }} />
                        {/* Connecting Line Active Fill */}
                        <div style={{
                          position: 'absolute',
                          top: '30px',
                          left: '3rem',
                          width: `${(getStatusIndex(order.status) / 3) * 100}%`,
                          maxWidth: 'calc(100% - 6rem)',
                          height: '2px',
                          background: 'var(--primary-color)',
                          boxShadow: '0 0 8px var(--primary-glow)',
                          zIndex: 1,
                          transition: 'all 0.4s ease'
                        }} />
                      </div>
                    )}

                    {/* Order Items */}
                    <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {order.items.map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                            <img src={item.product?.image || '/favicon.png'} alt={item.product?.name} style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', padding: '4px' }} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.product?.name || 'Gamer Part'}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qtd: {item.quantity} × {formatPrice(item.price)}</div>
                            </div>
                          </div>
                          <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', minWidth: '200px' }}>
                        <MapPin size={16} color="var(--primary-color)" />
                        <span>{order.address}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => handleDownloadInvoice(order)}
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'rgba(0, 255, 136, 0.4)', color: 'var(--primary-color)', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                        >
                          {language === 'pt' ? 'Baixar Recibo Terminal' : 'Download Terminal Invoice'}
                        </button>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>
                          Total: <span style={{ color: 'var(--primary-color)', textShadow: '0 0 8px var(--primary-glow)' }}>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
