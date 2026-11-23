import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, formatPrice, language } = useLanguage();

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{t('wishlistEmpty')}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {language === 'pt' 
            ? 'Explore o nosso catálogo e clique no ícone de coração para favoritar os seus componentes ideais.' 
            : 'Explore our catalog and click the heart icon to save your ideal components.'}
        </p>
        <Link to="/produtos" className="btn btn-primary">{t('wishlistBackToShop')}</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem' }}>{t('wishlistTitle')}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {wishlistItems.map(item => (
          <div key={item.id} className="wishlist-item glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', borderRadius: 'var(--radius-lg)', minHeight: '380px' }}>
            <Link to={`/produtos/${item.id}`} style={{ display: 'block', height: '180px', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', position: 'relative' }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="wishlist-item-img" />
              <span className="product-category" style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(0,0,0,0.7)', borderRadius: 'var(--radius-sm)', color: 'var(--primary-color)' }}>{item.category}</span>
            </Link>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '3.2rem', lineHeight: '1.6rem' }}>
                  <Link to={`/produtos/${item.id}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>{item.name}</Link>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '1.5rem' }}>
                  <div style={{ color: 'var(--primary-color)', fontSize: '1.45rem', fontWeight: '800', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    {formatPrice(item.price * 0.85)}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{language === 'pt' ? 'no PIX' : 'cash'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {language === 'pt' ? 'ou' : 'or'} {formatPrice(item.price)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '600', marginTop: '0.1rem' }}>
                    12x {language === 'pt' ? 'de' : 'of'} {formatPrice(item.price / 12)}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                <button 
                  onClick={() => addToCart(item)} 
                  className="btn btn-primary" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem' }}
                >
                  <ShoppingCart size={16} /> {t('detailsAddCart')}
                </button>
                
                <button 
                  onClick={() => removeFromWishlist(item.id)} 
                  className="btn btn-outline" 
                  style={{ width: '3.2rem', height: '3.2rem', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'rgba(239, 68, 68, 0.05)', transition: 'all 0.3s ease' }}
                  title={t('wishlistRemove')}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
