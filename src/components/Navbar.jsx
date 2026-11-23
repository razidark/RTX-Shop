import { ShoppingCart, Heart, Search, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import GamerAvatar from './GamerAvatar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Fetch all products once on mount for instant search recommendations
  useEffect(() => {
    const loadProductsForSearch = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products for instant search:', err);
      }
    };
    loadProductsForSearch();
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2 && allProducts.length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase()) ||
        p.category.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setSuggestions([]);
    }
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container navbar-container">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/favicon.png" alt="RTX Shop Logo" className="logo-img" style={{ borderRadius: 'var(--radius-sm)', objectFit: 'contain', border: '1px solid rgba(0, 255, 136, 0.25)', boxShadow: '0 0 10px rgba(0, 255, 136, 0.2)' }} />
          <span><span className="logo-highlight">RTX</span> Shop</span>
        </Link>
        
        <span className="nav-divider desktop-only"></span>

        <div className="nav-links desktop-only">
          <Link to="/" className="nav-link">{t('navHome')}</Link>
          <Link to="/produtos" className="nav-link">{t('navCatalog')}</Link>
          <Link to="/monte-seu-pc" className="nav-link">{t('navBuildPc')}</Link>
        </div>

        <span className="nav-divider desktop-only"></span>

        <div className="nav-actions">
          <form onSubmit={handleSearch} className="search-bar desktop-only" style={{ position: 'relative', marginRight: '0.5rem' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={t('navSearchPlaceholder')} 
              value={searchQuery}
              onChange={handleInputChange}
              onBlur={() => setTimeout(() => setSuggestions([]), 250)}
            />
            {suggestions.length > 0 && (
              <div className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', borderRadius: 'var(--radius-md)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0.35rem 0', background: 'rgba(5, 5, 10, 0.95)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                {suggestions.map(p => (
                  <button 
                    key={p.id}
                    type="button"
                    onClick={() => {
                      navigate(`/produtos/${p.id}`);
                      setSearchQuery('');
                      setSuggestions([]);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.85rem', width: '100%', textAlign: 'left', background: 'transparent' }}
                    className="suggestion-item"
                  >
                    <img src={p.image} alt={p.name} style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.2s' }}>{p.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="action-capsule">
            <Link to="/favoritos" className="cart-btn" title={t('navWishlist')}>
              <Heart size={20} />
              {wishlistCount > 0 && <span className="cart-badge" style={{ backgroundColor: '#ff2a5f' }}>{wishlistCount}</span>}
            </Link>
            
            <span className="capsule-divider"></span>
            
            <Link to="/carrinho" className="cart-btn" title={t('cartTitle')}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>

          <span className="nav-divider desktop-only" style={{ margin: '0 0.5rem' }}></span>

          <div className="auth-links desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn btn-outline btn-sm" style={{ borderColor: 'var(--primary-color)', color: 'var(--primary-color)' }}>{t('navAdmin')}</Link>
                )}
                <Link to="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', transition: 'all 0.3s ease', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }} className="nav-profile-link">
                  <GamerAvatar avatar={user.avatar} size={28} />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user.name}</span>
                </Link>
                <button onClick={logout} className="btn btn-outline btn-sm">{t('navLogout')}</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" style={{ display: 'flex', gap: '0.5rem' }}>
                <User size={16} /> {t('navLogin')}
              </Link>
            )}
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu animate-fade-in">
          <form onSubmit={handleSearch} className="search-bar mobile-search" style={{ position: 'relative' }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder={t('navSearchPlaceholder')} 
              value={searchQuery}
              onChange={handleInputChange}
              onBlur={() => setTimeout(() => setSuggestions([]), 250)}
            />
            {suggestions.length > 0 && (
              <div className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem', borderRadius: 'var(--radius-md)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0.35rem 0', background: 'rgba(5, 5, 10, 0.98)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
                {suggestions.map(p => (
                  <button 
                    key={p.id}
                    type="button"
                    onClick={() => {
                      navigate(`/produtos/${p.id}`);
                      setSearchQuery('');
                      setSuggestions([]);
                      setIsMenuOpen(false);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.85rem', width: '100%', textAlign: 'left', background: 'transparent' }}
                    className="suggestion-item"
                  >
                    <img src={p.image} alt={p.name} style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color 0.2s' }}>{p.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navHome')}</Link>
          <Link to="/produtos" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navCatalog')}</Link>
          <Link to="/favoritos" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navWishlist')}</Link>
          <Link to="/monte-seu-pc" className="nav-link" onClick={() => setIsMenuOpen(false)}>{t('navBuildPc')}</Link>
          {user ? (
            <>
              <Link to="/perfil" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
                <GamerAvatar avatar={user.avatar} size={36} />
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('profileTitle')}</div>
                </div>
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="nav-link" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--primary-color)' }}>{t('navAdmin')}</Link>
              )}
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn btn-outline" style={{ justifyContent: 'flex-start', width: '100%', marginTop: '1rem' }}>{t('navLogout')}</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', width: '100%', marginTop: '1rem' }}>
              <User size={16} /> {t('navLogin')}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

