import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, QrCode, Copy, RotateCw, ShieldCheck, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t, formatPrice, language } = useLanguage();
  
  // Form States
  const [fullName, setFullName] = useState(user ? user.name : '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');

  // Simulation States: 'form' | 'pix_pending' | 'processing' | 'success'
  const [purchaseStep, setPurchaseStep] = useState('form');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [installments, setInstallments] = useState(1);
  const [copiedPix, setCopiedPix] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState('');

  // These rates must stay in step with the server's orderPolicy.js
  // (COUPON_DISCOUNTS / PIX_DISCOUNT), otherwise the customer is shown one
  // price and charged another.
  const COUPON_DISCOUNTS = { RTX2026: 0.10 };
  const PIX_DISCOUNT = 0.15;

  const couponRate = COUPON_DISCOUNTS[activeCoupon] ?? 0;
  const couponDiscountAmount = cartTotal * couponRate;
  const afterCouponTotal = cartTotal - couponDiscountAmount;
  const pixDiscountAmount = paymentMethod === 'pix' ? afterCouponTotal * PIX_DISCOUNT : 0;
  // Round to cents the same way the server does, so the two totals match
  // exactly instead of differing by a floating-point fraction.
  const finalTotal = Math.round((afterCouponTotal - pixDiscountAmount) * 100) / 100;

  const handleApplyCoupon = () => {
    if (couponInput.trim() === 'RTX2026') {
      setActiveCoupon('RTX2026');
      addToast(language === 'pt' ? 'Cupom RTX2026 aplicado com sucesso!' : 'Coupon RTX2026 applied successfully!', 'success');
    } else {
      addToast(language === 'pt' ? 'Cupom inválido!' : 'Invalid coupon code!', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon('');
    setCouponInput('');
    addToast(language === 'pt' ? 'Cupom removido.' : 'Coupon removed.', 'success');
  };

  const saveOrderToDatabase = async () => {
    if (user) {
      try {
        const fullDeliveryAddress = `${address}, ${city} - CEP: ${cep}`;
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: fullDeliveryAddress,
            // The server derives the total from its own product prices and
            // applies the coupon / PIX discount itself. `total` and
            // `status` are no longer sent: the server ignores them, and
            // sending them made it look as if the client chose the price.
            coupon: activeCoupon || undefined,
            paymentMethod,
            items: cartItems.map(item => ({
              productId: item.id,
              quantity: item.quantity
            }))
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.order && data.order.id) {
            setCreatedOrderId(data.order.id);
            return data.order.id;
          }
        }
      } catch (err) {
        console.error('Error saving order to db:', err);
      }
    }
    return null;
  };

  const handleStartPayment = (e) => {
    e.preventDefault();
    if (paymentMethod === 'pix') {
      setPurchaseStep('pix_pending');
    } else {
      simulateCardPayment();
    }
  };

  const simulateCardPayment = () => {
    setPurchaseStep('processing');
    const statuses = [
      t('checkoutGatewayMsg'),
      t('checkoutVerifyMsg'),
      t('checkoutAuthMsg'),
      t('checkoutKeysMsg')
    ];

    statuses.forEach((status, index) => {
      setTimeout(async () => {
        setProcessingStatus(status);
        if (index === statuses.length - 1) {
          // Save real order database record
          await saveOrderToDatabase();
          setTimeout(() => {
            setPurchaseStep('success');
          }, 1500);
        }
      }, index * 1200);
    });
  };

  const handleConfirmPixPayment = () => {
    setPurchaseStep('processing');
    setProcessingStatus(t('checkoutVerifyPixMsg'));
    setTimeout(async () => {
      // Save real order database record
      await saveOrderToDatabase();
      setPurchaseStep('success');
    }, 2000);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136rtxshop-demo-key-1293847-pix-payment5204000053039865407' + finalTotal.toFixed(2));
    setCopiedPix(true);
    addToast(t('checkoutCopiedToast'), 'success');
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleCompleteDemo = () => {
    clearCart();
    addToast(t('checkoutDemoDoneToast'), 'success');
    navigate('/');
  };

  if (cartItems.length === 0 && purchaseStep === 'form') {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>{t('checkoutEmptyError')}</h2>
        <button onClick={() => navigate('/produtos')} className="btn btn-primary" style={{ marginTop: '2rem' }}>{t('checkoutReturnShop')}</button>
      </div>
    );
  }

  // 1. STEP: PROCESSING (Loader Screen)
  if (purchaseStep === 'processing') {
    return (
      <div className="container animate-fade-in" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--primary-color)', boxShadow: 'var(--shadow-glow)' }}>
          <RotateCw size={60} className="animate-spin text-primary" style={{ margin: '0 auto 2rem', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }} />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }} className="text-gradient-primary">{t('checkoutProcessing')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', minHeight: '3rem', fontFamily: 'monospace' }}>&gt;&gt; {processingStatus}</p>
        </div>
      </div>
    );
  }

  // 2. STEP: PIX PENDING (QR Code Screen)
  if (purchaseStep === 'pix_pending') {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '3.5rem 2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-color)', textAlign: 'center', boxShadow: 'var(--shadow-glow)' }}>
          <h2 className="text-gradient-primary" style={{ fontSize: '2.25rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('checkoutWaitPayment')}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>{t('checkoutWaitPaymentDesc')}</p>
          
          <div style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            width: '230px', 
            height: '230px', 
            margin: '0 auto 2rem', 
            borderRadius: 'var(--radius-md)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 0 30px rgba(0, 255, 136, 0.35)',
            border: '3px solid var(--primary-color)'
          }}>
            <QrCode size={190} color="#000" />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <button 
              onClick={handleCopyPix} 
              className="btn btn-outline" 
              style={{ 
                display: 'inline-flex', 
                gap: '0.5rem', 
                margin: '0 auto', 
                borderColor: copiedPix ? 'var(--primary-color)' : 'var(--border-color)',
                color: copiedPix ? 'var(--primary-color)' : 'var(--text-main)',
                background: copiedPix ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255,255,255,0.03)'
              }}
            >
              <Copy size={18} /> {copiedPix ? t('checkoutCopiedPix') : t('checkoutCopyPixBtn')}
            </button>
          </div>

          <div style={{ 
            background: 'rgba(0,255,136,0.02)', 
            border: '1px solid rgba(0,255,136,0.12)', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2.5rem',
            boxShadow: '0 0 10px rgba(0,255,136,0.01)'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('checkoutTotalToPay')}</span>
            <div style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--primary-color)', marginTop: '0.25rem', textShadow: '0 0 10px var(--primary-glow)' }}>
              {formatPrice(finalTotal)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', flexDirection: 'column' }}>
            <button onClick={handleConfirmPixPayment} className="btn btn-primary btn-cyber" style={{ width: '100%', padding: '1rem' }}>
              {t('checkoutSimulateConfirm')}
            </button>
            <button 
              onClick={() => setPurchaseStep('form')} 
              style={{ 
                color: 'var(--text-muted)', 
                textDecoration: 'none', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ArrowLeft size={16} /> {t('checkoutChangePayment')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. STEP: SUCCESS (Invoice & Receipt)
  if (purchaseStep === 'success') {
    return (
      <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '650px', width: '100%', padding: '3.5rem 2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-color)', boxShadow: 'var(--shadow-glow)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <CheckCircle size={64} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 12px var(--primary-glow))' }} />
            <h1 className="text-gradient-primary" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('checkoutOrderConfirmed')}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{t('checkoutConfirmedDesc')}</p>
          </div>

          <div style={{ 
            background: 'rgba(5, 5, 10, 0.4)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            padding: '2rem', 
            marginBottom: '2.5rem',
            position: 'relative'
          }}>
            {/* High-tech receipt header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>{t('checkoutOrderId')}</span>
              <span style={{ color: 'var(--primary-color)', fontFamily: 'monospace', fontWeight: 'bold' }}>#RTX-{createdOrderId ? createdOrderId.slice(0, 8).toUpperCase() : 'PENDING'}</span>
            </div>
            
            {/* Receipt list items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span style={{ fontWeight: '600' }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Dashed line divider */}
            <div style={{ borderTop: '2px dashed rgba(255,255,255,0.15)', margin: '1.5rem 0' }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: '900', fontFamily: 'monospace' }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>{t('checkoutPaidTotal')}</span>
              <span style={{ color: 'var(--primary-color)' }}>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', background: 'rgba(0, 255, 136, 0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 255, 136, 0.1)', marginBottom: '3rem', alignItems: 'center' }}>
            <ShieldCheck size={28} color="var(--primary-color)" style={{ flexShrink: 0, filter: 'drop-shadow(0 0 4px var(--primary-glow))' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{t('checkoutDemoAlert')}</span>
          </div>

          <button onClick={handleCompleteDemo} className="btn btn-primary btn-cyber" style={{ width: '100%', padding: '1.15rem', fontSize: '1.1rem', justifyContent: 'center' }}>
            {t('checkoutHomeBtn')}
          </button>
        </div>
      </div>
    );
  }

  // 4. STEP: STANDARD CHECKOUT FORM
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '1px' }} className="text-gradient-primary">{t('checkoutTitle')}</h1>
      
      <div className="builder-layout" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '3rem' }}>
        <form onSubmit={handleStartPayment} className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            {t('checkoutAddressTitle')}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutFullName')}</label>
              <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutAddress')}</label>
              <input type="text" required value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutCity')}</label>
              <input type="text" required value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutCep')}</label>
              <input type="text" required value={cep} onChange={e => setCep(e.target.value)} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            {t('checkoutPaymentMethod')}
          </h2>
          
          {/* Stylized select payment options */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div 
              onClick={() => setPaymentMethod('pix')} 
              className="glass-panel" 
              style={{ 
                flex: 1, 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer',
                border: paymentMethod === 'pix' ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                boxShadow: paymentMethod === 'pix' ? 'var(--shadow-glow)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                background: paymentMethod === 'pix' ? 'rgba(0, 255, 136, 0.03)' : 'var(--glass-bg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: paymentMethod === 'pix' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255,255,255,0.02)', width: '50px', height: '50px', borderRadius: '50%', color: paymentMethod === 'pix' ? 'var(--primary-color)' : 'var(--text-muted)', transition: 'all 0.3s ease' }}>
                <QrCode size={22} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: paymentMethod === 'pix' ? 'var(--primary-color)' : 'var(--text-main)' }}>PIX</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: '500' }}>
                  {language === 'pt' ? '15% de Desconto à Vista' : '15% Cash Discount'}
                </div>
              </div>
            </div>

            <div 
              onClick={() => setPaymentMethod('card')} 
              className="glass-panel" 
              style={{ 
                flex: 1, 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-md)', 
                cursor: 'pointer',
                border: paymentMethod === 'card' ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                boxShadow: paymentMethod === 'card' ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                background: paymentMethod === 'card' ? 'rgba(59, 130, 246, 0.03)' : 'var(--glass-bg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: paymentMethod === 'card' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)', width: '50px', height: '50px', borderRadius: '50%', color: paymentMethod === 'card' ? 'var(--accent-color)' : 'var(--text-muted)', transition: 'all 0.3s ease' }}>
                <CreditCard size={22} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: paymentMethod === 'card' ? 'var(--accent-color)' : 'var(--text-main)' }}>{t('checkoutCreditCard')}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: '500' }}>
                  {language === 'pt' ? 'Até 12x Sem Juros' : 'Up to 12x Interest-Free'}
                </div>
              </div>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutCardNumber')}</label>
                <input type="text" placeholder="0000 0000 0000 0000" required={paymentMethod === 'card'} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutValidade')}</label>
                  <input type="text" placeholder="MM/AA" required={paymentMethod === 'card'} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutCvc')}</label>
                  <input type="text" placeholder="000" maxLength="4" required={paymentMethod === 'card'} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>{t('checkoutInstallments')}</label>
                <select value={installments} onChange={(e) => setInstallments(Number(e.target.value))} style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>
                      {t('checkoutInstallmentOption', { qty: i+1, val: formatPrice(cartTotal / (i+1)) })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {paymentMethod === 'pix' && (
            <div className="animate-slide-up" style={{ padding: '2rem', background: 'rgba(0, 255, 136, 0.02)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid rgba(0, 255, 136, 0.15)', boxShadow: '0 0 10px rgba(0,255,136,0.01)' }}>
              <p style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t('checkoutPixAlert')}</p>
              <h3 style={{ color: 'var(--primary-color)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '1.25rem' }}>⚡ {t('checkoutPixDiscount')}</h3>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary btn-cyber" style={{ width: '100%', marginTop: '3rem', padding: '1.15rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}>
            {paymentMethod === 'pix' ? t('checkoutSubmitPix') : `${t('checkoutSubmitCard')}`} <ArrowRight size={20} />
          </button>
        </form>

        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: 'fit-content', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('checkoutOrderSummary')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>{item.quantity}x {item.name}</span>
                <span style={{ fontWeight: '500' }}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Intermediate breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{language === 'pt' ? 'Subtotal' : 'Subtotal'}</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            {couponDiscountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-color)' }}>
                <span>{language === 'pt' ? 'Até 10% de desconto' : 'Up to 10% discount'}</span>
                <span>-{formatPrice(couponDiscountAmount)}</span>
              </div>
            )}
            {pixDiscountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary-color)' }}>
                <span>{language === 'pt' ? 'Desconto PIX (15%)' : 'PIX Cash Discount (15%)'}</span>
                <span>-{formatPrice(pixDiscountAmount)}</span>
              </div>
            )}
          </div>

          {/* Coupon Entry */}
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {language === 'pt' ? 'Cupom de Desconto' : 'Coupon Code'}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="EX: RTX2026"
                value={couponInput}
                onChange={e => setCouponInput(e.target.value.toUpperCase())}
                style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
              />
              <button 
                type="button"
                onClick={handleApplyCoupon}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.5rem 1rem' }}
              >
                {language === 'pt' ? 'Aplicar' : 'Apply'}
              </button>
            </div>
            {activeCoupon && (
              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.15)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  {activeCoupon} ({language === 'pt' ? 'Até 10% de desconto' : 'Up to 10% OFF'})
                </span>
                <button 
                  type="button"
                  onClick={handleRemoveCoupon}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                >
                  X
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '900' }}>
            <span>{t('checkoutTotal')}</span>
            <span style={{ color: 'var(--primary-color)', textShadow: '0 0 8px var(--primary-glow)' }}>{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
