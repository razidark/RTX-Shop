import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Check, Shield, Truck, Heart, MessageSquare, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CategoryIcon from '../components/CategoryIcon';

const PRODUCTS = {
  1: { id: 1, name: 'NVIDIA GeForce RTX 4090', category: 'Placa de Vídeo', price: 15999.99, image: '/images/gpu.jpg', desc: 'A GPU definitiva. Um salto gigantesco em performance, eficiência e gráficos movidos por IA.', specs: ['24GB GDDR6X', '16384 Núcleos CUDA', 'Clock Base: 2.23 GHz'] },
  2: { id: 2, name: 'AMD Ryzen 9 7950X3D', category: 'Processador', price: 4699.99, image: '/images/cpu.jpg', desc: 'O processador definitivo para jogos e criação, com tecnologia AMD 3D V-Cache.', specs: ['16 Núcleos / 32 Threads', 'Boost Máximo: 5.7 GHz', 'Cache L3: 128MB'] },
  // Fallback defaults
  3: { id: 3, name: 'G.SKILL Trident Z5 RGB 32GB', category: 'Memória RAM', price: 1129.99, image: '/images/ram.jpg', desc: 'Memória RAM DDR5 de altíssima performance para sistemas Intel.', specs: ['32GB (2x16GB)', 'DDR5 6000MHz', 'Latência CAS 36'] },
  4: { id: 4, name: 'ASUS ROG Strix Z790-E', category: 'Placa Mãe', price: 3479.99, image: '/images/motherboard.png', desc: 'Placa-mãe poderosa para a plataforma Intel Z790.', specs: ['Socket LGA 1700', 'WiFi 6E', 'PCIe 5.0'] },
};

// Initial Mock Reviews
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: 'Alex "CyberGamer"',
    rating: 5,
    date: '2026-05-15',
    comment: {
      pt: 'Simplesmente incrível! A performance superou todas as minhas expectativas no Cyberpunk 2077 com Ray Tracing e DLSS 3 ativados.',
      en: 'Simply incredible! Performance exceeded all my expectations in Cyberpunk 2077 with Ray Tracing and DLSS 3 active.'
    }
  },
  {
    id: 2,
    name: 'Julia Matrix',
    rating: 4,
    date: '2026-06-02',
    comment: {
      pt: 'Produto de altíssima qualidade, entrega super rápida e embalagem muito bem protegida. Recomendo fortemente a RTX Shop.',
      en: 'Top quality product, super fast delivery, and very well protected packaging. Highly recommend RTX Shop.'
    }
  }
];

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, formatPrice, language } = useLanguage();
  const { user } = useAuth();
  const { addToast } = useToast();

  // Reviews States
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setProduct(PRODUCTS[id] || PRODUCTS[1]);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setProduct(PRODUCTS[id] || PRODUCTS[1]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        {t('builderWaiting')}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Produto não encontrado.
      </div>
    );
  }

  const isFav = isInWishlist(product.id);
  let descriptionText = product.description || product.desc || '';
  let specs = product.specs || [];
  if (product.description && product.description.startsWith('{')) {
    try {
      const parsed = JSON.parse(product.description);
      descriptionText = parsed.descriptionText || '';
      const parsedSpecs = [];
      if (parsed.brand) {
        parsedSpecs.push(`${language === 'pt' ? 'Marca' : 'Brand'}: ${parsed.brand}`);
      }
      if (parsed.sku) {
        parsedSpecs.push(`SKU: ${parsed.sku}`);
      }
      if (parsed.barcode) {
        parsedSpecs.push(`${language === 'pt' ? 'Código de Barras' : 'Barcode'}: ${parsed.barcode}`);
      }
      specs = [...specs, ...parsedSpecs];
    } catch (e) {
      console.error('Failed to parse description JSON:', e);
    }
  } else if (specs.length === 0 && descriptionText) {
    specs = [descriptionText];
  }

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: newReviewName.trim() || user?.name || 'Anonymous Gamer',
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: {
        pt: newReviewComment.trim(),
        en: newReviewComment.trim()
      }
    };

    setReviews([newRev, ...reviews]);
    setNewReviewComment('');
    addToast(
      language === 'pt' ? 'Avaliação publicada com sucesso!' : 'Review posted successfully!',
      'success'
    );
  };

  const renderStars = (rating, interactive = false, onSelect = () => {}) => {
    return (
      <div style={{ display: 'inline-flex', gap: '0.2rem', color: '#ffb703' }}>
        {[...Array(5)].map((_, i) => {
          const starVal = i + 1;
          const isFilled = starVal <= rating;
          return (
            <span 
              key={i} 
              onClick={() => interactive && onSelect(starVal)}
              style={{ 
                fontSize: interactive ? '1.4rem' : '1.1rem', 
                cursor: interactive ? 'pointer' : 'default',
                textShadow: isFilled ? '0 0 5px rgba(255, 183, 3, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {isFilled ? '★' : '☆'}
            </span>
          );
        })}
      </div>
    );
  };

  // Average calculation
  const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="product-details-page container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
        
        <div className="details-image glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>

        <div className="details-info">
          <span className="product-category" style={{ fontSize: '1rem', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <CategoryIcon category={product.category} size={16} />
            {product.category}
          </span>
          <h1 style={{ fontSize: '3rem', margin: '0.5rem 0 1.5rem' }}>{product.name}</h1>
          <div className="price" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {formatPrice(product.price * 0.85)}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '0.5rem' }}>{t('detailsPixOff')}</span>
          </div>
          <div style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {t('detailsOr')} {formatPrice(product.price)} {t('detailsCardInstallments', { value: formatPrice(product.price / 12) })}
          </div>
          
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2rem' }}>{descriptionText}</p>
          
          {specs.length > 0 && (
            <div className="specs" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>{t('detailsSpecs')}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {specs.map((spec, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    <Check size={16} color="var(--primary-color)" /> {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="actions" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
            <button onClick={() => addToCart(product)} className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.125rem' }}>
              <ShoppingCart size={20} /> {t('detailsAddCart')}
            </button>
            <button 
              onClick={() => toggleWishlist(product)} 
              className="btn btn-secondary" 
              style={{
                width: '3.5rem',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${isFav ? 'var(--primary-color)' : 'rgba(255,255,255,0.15)'}`,
                background: isFav ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.04)',
                color: isFav ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              title={isFav ? t('wishlistRemove') : t('navWishlist')}
            >
              <Heart size={20} fill={isFav ? 'var(--primary-color)' : 'none'} />
            </button>
          </div>

          <div className="benefits" style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} /> {t('detailsFreeShipping')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} /> {t('detailsWarranty')}
            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS & RATINGS SECTION */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare size={24} color="var(--primary-color)" />
          {language === 'pt' ? 'Avaliações do Hardware' : 'Hardware Reviews'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '4rem', alignItems: 'start' }}>
          {/* Left Column: Average Summary & Add Review Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: '1', fontFamily: 'var(--font-heading)' }}>
                {avgRating}
              </div>
              <div style={{ margin: '0.5rem 0' }}>
                {renderStars(Math.round(Number(avgRating)))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                {language === 'pt' ? `Baseado em ${reviews.length} avaliações` : `Based on ${reviews.length} reviews`}
              </p>
            </div>

            {/* Write a Review Panel */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {language === 'pt' ? 'Escrever Avaliação' : 'Write a Review'}
              </h3>
              <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {language === 'pt' ? 'Seu Nome / Apelido' : 'Your Name / Handle'}
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={newReviewName || user?.name || ''}
                    onChange={e => setNewReviewName(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {language === 'pt' ? 'Nota do Produto' : 'Product Rating'}
                  </label>
                  <div style={{ marginTop: '0.25rem' }}>
                    {renderStars(newReviewRating, true, setNewReviewRating)}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {language === 'pt' ? 'Comentário sobre o Hardware' : 'Hardware Review Comments'}
                  </label>
                  <textarea 
                    required 
                    rows="4"
                    value={newReviewComment}
                    onChange={e => setNewReviewComment(e.target.value)}
                    placeholder={language === 'pt' ? 'Fale sobre o desempenho, temperatura, etc...' : 'Talk about performance, cooling, design...'}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-cyber" style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center', padding: '0.75rem' }}>
                  <Send size={16} /> {language === 'pt' ? 'Publicar' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: List of Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.map(rev => (
              <div key={rev.id} className="glass-panel animate-fade-in" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{rev.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(rev.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                    </span>
                  </div>
                  {renderStars(rev.rating)}
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  {rev.comment[language] || rev.comment['pt']}
                </p>
              </div>
            ))}
            {reviews.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                {language === 'pt' ? 'Nenhuma avaliação publicada ainda.' : 'No reviews posted yet.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

