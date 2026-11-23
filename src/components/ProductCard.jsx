import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import CategoryIcon from './CategoryIcon';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, formatPrice, language } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isFav = isInWishlist(product.id);

  return (
    <div className="product-card glass-panel animate-fade-in" style={{ position: 'relative' }}>
      <div className="product-image-container-wrapper" style={{ position: 'relative' }}>
        <Link to={`/produtos/${product.id}`} className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
          {product.isNew && <span className="badge new-badge">{t('cardNew')}</span>}
        </Link>
        <button
          onClick={handleWishlist}
          className="wishlist-toggle-btn"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${isFav ? 'var(--primary-color, #00ff88)' : 'rgba(255, 255, 255, 0.2)'}`,
            borderRadius: '50%',
            width: '2.2rem',
            height: '2.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.3s ease',
            color: isFav ? 'var(--primary-color, #00ff88)' : 'rgba(255, 255, 255, 0.8)'
          }}
          title={isFav ? t('wishlistRemove') : t('navWishlist')}
        >
          <Heart size={16} fill={isFav ? 'var(--primary-color, #00ff88)' : 'none'} style={{ transition: 'transform 0.2s ease' }} />
        </button>
      </div>
      
      <div className="product-info">
        <span className="product-category" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CategoryIcon category={product.category} size={13} />
          {product.category}
        </span>
        <h3 className="product-name">
          <Link to={`/produtos/${product.id}`}>{product.name}</Link>
        </h3>
        
        <div className="product-footer" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="product-price" style={{ color: 'var(--primary-color)', fontSize: '1.45rem', fontWeight: '800', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              {formatPrice(product.price * 0.85)}
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{language === 'pt' ? 'no PIX' : 'cash'}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {language === 'pt' ? 'ou' : 'or'} {formatPrice(product.price)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '600', marginTop: '0.1rem' }}>
              12x {language === 'pt' ? 'de' : 'of'} {formatPrice(product.price / 12)}
            </div>
          </div>
          <button 
            onClick={handleAdd} 
            className="btn btn-primary btn-sm add-to-cart-btn"
            disabled={product.stock === 0}
            style={{ width: '100%', opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center' }}
          >
            <ShoppingCart size={16} /> {product.stock === 0 ? t('cardOut') : t('cardAdd')}
          </button>
        </div>
      </div>
    </div>
  );
}

