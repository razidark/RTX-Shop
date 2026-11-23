import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { t, formatPrice, language } = useLanguage();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '550px', margin: '0 auto', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <ShoppingBag size={64} color="var(--primary-color)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px var(--primary-glow))' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{t('cartEmpty')}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            {language === 'pt' 
              ? 'Você ainda não adicionou nenhuma peça ao seu setup.' 
              : 'You have not added any components to your setup yet.'}
          </p>
          <Link to="/produtos" className="btn btn-primary btn-cyber" style={{ padding: '1rem 2rem' }}>
            {t('cartBackToShop')}
          </Link>
        </div>
      </div>
    );
  }

  const itemsLabel = cartItems.length === 1 
    ? (language === 'pt' ? '1 item' : '1 item') 
    : (language === 'pt' ? `${cartItems.length} itens` : `${cartItems.length} items`);

  return (
    <div className="cart-page container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }} className="text-gradient-primary">
        {t('cartTitle')}
      </h1>
      
      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '3rem' }}>
        <div className="cart-items">
          {cartItems.map(item => (
            <div 
              key={item.id} 
              className="cart-item glass-panel" 
              style={{ 
                display: 'flex', 
                gap: '1.5rem', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius-lg)', 
                marginBottom: '1.5rem', 
                alignItems: 'center',
                border: '1px solid var(--border-color)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.25)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 255, 136, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'contain', 
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.01)',
                  padding: '0.25rem',
                  border: '1px solid rgba(255,255,255,0.03)'
                }} 
              />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '700' }}>{item.name}</h3>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  {formatPrice(item.price * item.quantity)}
                </div>
                
                <div className="cart-item-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.25rem' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      style={{ padding: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
                      title={language === 'pt' ? 'Diminuir' : 'Decrease'}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 1rem', fontWeight: '800', fontSize: '0.95rem' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      style={{ padding: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
                      title={language === 'pt' ? 'Aumentar' : 'Increase'}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="btn btn-outline btn-sm" 
                    style={{ 
                      padding: '0.5rem 0.75rem', 
                      borderRadius: 'var(--radius-sm)',
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      background: 'rgba(239, 68, 68, 0.02)',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }} 
                    title={language === 'pt' ? 'Remover' : 'Remove'}
                  >
                    <Trash2 size={14} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{language === 'pt' ? 'Excluir' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: 'fit-content', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('cartSummary')}</h3>
          
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
            <span>Subtotal ({itemsLabel})</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.15rem', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{language === 'pt' ? 'Prazo (até 12x)' : 'Credit Card (up to 12x)'}</span>
            <span style={{ color: 'var(--text-main)' }}>{formatPrice(cartTotal)}</span>
          </div>
          <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {language === 'pt' 
              ? `ou em 12x de ${formatPrice(cartTotal / 12)} sem juros` 
              : `or 12 interest-free payments of ${formatPrice(cartTotal / 12)}`}
          </div>
          
          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.45rem', fontWeight: '900', color: 'var(--primary-color)' }}>
            <span>{language === 'pt' ? 'À vista no PIX' : 'Cash / PIX'}</span>
            <span>{formatPrice(cartTotal * 0.85)}</span>
          </div>
          
          <div style={{ 
            background: 'rgba(0, 255, 136, 0.03)', 
            border: '1px solid rgba(0, 255, 136, 0.12)', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '0.8rem', 
            color: 'var(--primary-color)', 
            textAlign: 'center', 
            marginBottom: '2rem', 
            textTransform: 'uppercase', 
            fontWeight: 'bold', 
            letterSpacing: '1px',
            boxShadow: '0 0 10px rgba(0, 255, 136, 0.02)'
          }}>
            ⚡ {language === 'pt' ? 'Economize 15% pagando via PIX!' : 'Get 15% OFF on checkout with PIX!'}
          </div>
          
          <Link to="/checkout" className="btn btn-primary btn-cyber" style={{ display: 'flex', width: '100%', padding: '1.15rem', fontSize: '1.1rem', justifyContent: 'center' }}>
            {t('cartCheckoutBtn')} <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
