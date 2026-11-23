import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  Cpu, MonitorPlay, CircuitBoard, MemoryStick, HardDrive, Zap, 
  ShieldCheck, Truck, Lock, Box, Fan, Tv, Gamepad, Armchair, Gamepad2 
} from 'lucide-react';

const FEATURED_PRODUCTS = [
  { id: 1, name: 'NVIDIA GeForce RTX 4090', category: 'Placa de Vídeo', price: 15999.99, image: '/images/gpu.jpg', isNew: true },
  { id: 2, name: 'AMD Ryzen 9 7950X3D', category: 'Processador', price: 4699.99, image: '/images/cpu.jpg' },
  { id: 3, name: 'G.SKILL Trident Z5 RGB 32GB', category: 'Memória RAM', price: 1129.99, image: '/images/ram.jpg' },
  { id: 4, name: 'ASUS ROG Strix Z790-E', category: 'Placa Mãe', price: 3479.99, image: '/images/motherboard.png' }
];

const CATEGORIES = [
  { id: 'cpu', nameKey: 'homeCategoryCpu', query: 'Processador', icon: Cpu },
  { id: 'gpu', nameKey: 'homeCategoryGpu', query: 'Placa de Vídeo', icon: MonitorPlay },
  { id: 'mobo', nameKey: 'homeCategoryMobo', query: 'Placa Mãe', icon: CircuitBoard },
  { id: 'ram', nameKey: 'homeCategoryRam', query: 'Memória RAM', icon: MemoryStick },
  { id: 'storage', nameKey: 'homeCategoryStorage', query: 'Armazenamento', icon: HardDrive },
  { id: 'psu', nameKey: 'homeCategoryPsu', query: 'Fonte', icon: Zap },
  { id: 'case', nameKey: 'homeCategoryCase', query: 'Gabinete', icon: Box },
  { id: 'cooler', nameKey: 'homeCategoryCooler', query: 'Refrigeração', icon: Fan },
  { id: 'monitor', nameKey: 'homeCategoryMonitor', query: 'Monitor', icon: Tv },
  { id: 'peripherals', nameKey: 'homeCategoryPeripherals', query: 'Periféricos', icon: Gamepad },
  { id: 'chair', nameKey: 'homeCategoryChair', query: 'Cadeira Gamer', icon: Armchair },
  { id: 'accessories', nameKey: 'homeCategoryAccessories', query: 'Acessórios', icon: Gamepad2 }
];

export default function Home() {
  const { t, language } = useLanguage();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState(FEATURED_PRODUCTS);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFeaturedProducts(data.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      }
    };
    fetchFeatured();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast(t('newsSuccess'), 'success');
      setEmail('');
    }
  };

  const handleCategoryClick = (query) => {
    navigate(`/produtos?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section with Video Background */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            zIndex: -2,
            opacity: 0.28
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-circuit-board-background-41762-large.mp4" type="video/mp4" />
        </video>
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(5, 5, 10, 0.75) 0%, rgba(5, 5, 10, 0.4) 50%, rgba(5, 5, 10, 0.9) 100%)',
            zIndex: -1
          }}
        ></div>
        <div className="hero-glow"></div>
        <div className="container">
          <h1 className="text-gradient glitch-text" data-text={t('homeHeroTitle')}>
            {language === 'pt' ? (
              <>O Futuro do seu<br/><span className="text-gradient-primary">Setup Gamer</span></>
            ) : (
              <>The Future of your<br/><span className="text-gradient-primary">Gaming Setup</span></>
            )}
          </h1>
          <p>{t('homeHeroSubtitle')}</p>
          <div className="hero-actions">
            <Link to="/produtos" className="btn btn-primary btn-cyber">{t('homeVerCatalogo')}</Link>
            <Link to="/monte-seu-pc" className="btn btn-outline btn-cyber">{t('homeMontarPc')}</Link>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="categories-section container">
        <h2 className="section-title text-gradient">{t('homeCategoriesTitle')}</h2>
        <div className="categories-grid">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                className="category-card glass-panel"
                onClick={() => handleCategoryClick(cat.query)}
              >
                <div className="cat-icon-container">
                  <Icon size={32} className="cat-icon" />
                </div>
                <h3>{t(cat.nameKey)}</h3>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section container">
        <div className="section-header">
          <h2>{t('homeFeatured')}</h2>
          <Link to="/produtos" className="view-all">{t('homeVerTodos')}</Link>
        </div>
        
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Introduction Section (Image next to text) */}
      <section className="brand-intro-section container" style={{ padding: '6rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div className="intro-image-container glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
          <img 
            src="/images/about_pc.png" 
            alt="Custom Gaming PC" 
            style={{ width: '100%', borderRadius: 'var(--radius-md)', display: 'block', transition: 'transform 0.5s ease' }} 
            className="intro-image"
          />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(5,5,10,0.5) 0%, transparent 50%)', pointerEvents: 'none' }}></div>
        </div>
        
        <div className="intro-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span style={{ color: 'var(--primary-color)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
            {language === 'pt' ? 'Engenharia de Elite' : 'Elite Engineering'}
          </span>
          <h2 style={{ fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.2' }} className="text-gradient">
            {language === 'pt' ? 'MÁQUINAS FEITAS PARA A VITÓRIA' : 'MACHINES ENGINEERED FOR VICTORY'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
            {language === 'pt' 
              ? 'Todos os nossos computadores customizados são montados à mão por técnicos especialistas e passam por rigorosos testes de estabilidade por 24 horas sob estresse máximo. Usamos componentes das marcas líderes globais para garantir que sua taxa de quadros nunca caia.'
              : 'All our custom computers are hand-assembled by expert technicians and undergo rigorous stability stress-tests for 24 hours under maximum load. We utilize only top-tier components from global leading brands to ensure your frame rate never drops.'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
            {language === 'pt' 
              ? 'Dos cabos perfeitamente organizados à refrigeração líquida com circulação otimizada, cuidamos de cada detalhe para que seu setup seja uma obra de arte tecnológica pronta para o combate.'
              : 'From meticulously routed cables to liquid-cooling loops with optimized flow channels, we take care of every detail to ensure your battle station is a masterpiece of technological warfare.'}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/monte-seu-pc" className="btn btn-primary btn-cyber">
              {language === 'pt' ? 'Começar Montagem' : 'Start Assembly'}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="trust-section container">
        <div className="trust-grid">
          <div className="trust-card glass-panel">
            <Lock size={36} className="trust-icon" />
            <div>
              <h3>{t('badgeSecureTitle')}</h3>
              <p>{t('badgeSecureDesc')}</p>
            </div>
          </div>
          
          <div className="trust-card glass-panel">
            <Truck size={36} className="trust-icon" />
            <div>
              <h3>{t('badgeShippingTitle')}</h3>
              <p>{t('badgeShippingDesc')}</p>
            </div>
          </div>
          
          <div className="trust-card glass-panel">
            <ShieldCheck size={36} className="trust-icon" />
            <div>
              <h3>{t('badgeWarrantyTitle')}</h3>
              <p>{t('badgeWarrantyDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section container">
        <div className="newsletter-box glass-panel">
          <div className="newsletter-glow"></div>
          <h2>{t('newsTitle')}</h2>
          <p>{t('newsSubtitle')}</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input 
              type="email" 
              placeholder={t('newsPlaceholder')} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-cyber">
              {t('newsSubmit')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
