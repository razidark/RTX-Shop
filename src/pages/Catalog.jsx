import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const ALL_PRODUCTS = [
  // Processador (5 products) - Brand-differentiated images
  { id: 2, name: 'AMD Ryzen 9 7950X3D', category: 'Processador', price: 4699.99, image: '/images/amd_ryzen9_7950x3d.png' },
  { id: 10, name: 'Intel Core i9-14900K', category: 'Processador', price: 4299.99, image: '/images/intel_i9_14900k.png' },
  { id: 22, name: 'AMD Ryzen 7 7800X3D', category: 'Processador', price: 2999.99, image: '/images/amd_ryzen7_7800x3d.png' },
  { id: 23, name: 'Intel Core i7-14700K', category: 'Processador', price: 2799.99, image: '/images/intel_i7_14700k.png' },
  { id: 24, name: 'AMD Ryzen 5 7600X', category: 'Processador', price: 1499.99, image: '/images/amd_ryzen9_7950x3d.png' },

  // Placa de Vídeo (5 products) - NVIDIA green vs AMD red
  { id: 1, name: 'NVIDIA GeForce RTX 4090', category: 'Placa de Vídeo', price: 15999.99, image: '/images/nvidia_rtx4090.png', isNew: true },
  { id: 13, name: 'AMD Radeon RX 7900 XTX', category: 'Placa de Vídeo', price: 7999.99, image: '/images/amd_rx7900xtx.png' },
  { id: 25, name: 'NVIDIA GeForce RTX 4080 Super', category: 'Placa de Vídeo', price: 8499.99, image: '/images/nvidia_rtx4080.png' },
  { id: 26, name: 'NVIDIA GeForce RTX 4070 Ti Super', category: 'Placa de Vídeo', price: 6299.99, image: '/images/nvidia_rtx4070ti.png' },
  { id: 27, name: 'AMD Radeon RX 7800 XT', category: 'Placa de Vídeo', price: 3899.99, image: '/images/amd_rx7800xt.png' },

  // Memória RAM (3 products) - Corsair black vs G.SKILL RGB vs Kingston
  { id: 3, name: 'G.SKILL Trident Z5 RGB 32GB', category: 'Memória RAM', price: 1129.99, image: '/images/gskill_trident_z5.png' },
  { id: 12, name: 'Corsair Vengeance 64GB DDR5', category: 'Memória RAM', price: 2199.99, image: '/images/corsair_vengeance_ddr5.png' },
  { id: 28, name: 'Kingston FURY Beast RGB 16GB', category: 'Memória RAM', price: 549.99, image: '/images/kingston_fury_beast.png' },

  // Placa Mãe (2 products) - ASUS ROG vs Gigabyte AORUS
  { id: 4, name: 'ASUS ROG Strix Z790-E', category: 'Placa Mãe', price: 3479.99, image: '/images/asus_rog_z790.png' },
  { id: 11, name: 'Gigabyte X670E AORUS Master', category: 'Placa Mãe', price: 3199.99, image: '/images/gigabyte_x670e.png' },

  // Armazenamento (2 products) - Samsung vs WD
  { id: 14, name: 'Samsung 990 PRO 2TB NVMe', category: 'Armazenamento', price: 1399.99, image: '/images/samsung_990pro.png' },
  { id: 15, name: 'WD Black SN850X 1TB NVMe', category: 'Armazenamento', price: 799.99, image: '/images/ssd.jpg' },

  // Fonte (2 products)
  { id: 16, name: 'Corsair RM1000x 1000W', category: 'Fonte', price: 1299.99, image: '/images/psu.jpg' },
  { id: 37, name: 'ASUS ROG Thor 1200W', category: 'Fonte', price: 2499.99, image: '/images/psu.jpg' },

  // Gabinete (2 products)
  { id: 18, name: 'Lian Li O11 Dynamic EVO', category: 'Gabinete', price: 1199.99, image: '/images/case.jpg' },
  { id: 19, name: 'NZXT H9 Flow Black', category: 'Gabinete', price: 1099.99, image: '/images/case.jpg' },

  // Refrigeração (2 products)
  { id: 20, name: 'NZXT Kraken Elite 360mm', category: 'Refrigeração', price: 1899.99, image: '/images/cooler.jpg' },
  { id: 21, name: 'Noctua NH-D15 Black', category: 'Refrigeração', price: 899.99, image: '/images/cooler.jpg' },

  // Monitor (2 products)
  { id: 44, name: 'ASUS ROG Swift 32" OLED 4K', category: 'Monitor', price: 9499.99, image: '/images/monitor.png', isNew: true },
  { id: 45, name: 'Samsung Odyssey G9 49"', category: 'Monitor', price: 8299.99, image: '/images/monitor.png' },

  // Periféricos (2 products)
  { id: 50, name: 'Logitech G Pro X Superlight 2', category: 'Periféricos', price: 999.99, image: '/images/peripherals.png' },
  { id: 53, name: 'Razer DeathAdder V3 Pro', category: 'Periféricos', price: 899.99, image: '/images/peripherals.png' },

  // Cadeira Gamer (2 products)
  { id: 60, name: 'Cadeira Gamer Razer Iskur X', category: 'Cadeira Gamer', price: 2499.99, image: '/images/chair.png' },
  { id: 61, name: 'Cadeira Gamer Corsair T3 Rush', category: 'Cadeira Gamer', price: 1999.99, image: '/images/chair.png' },

  // Acessórios (4 products)
  { id: 70, name: 'Suporte de Headset RGB Razer Base Station V2 Chroma', category: 'Acessórios', price: 499.99, image: '/images/accessories.png' },
  { id: 71, name: 'Mousepad Gamer Corsair MM300 Extended', category: 'Acessórios', price: 199.99, image: '/images/accessories.png' },
  { id: 72, name: 'Controle Xbox Wireless Carbon Black', category: 'Acessórios', price: 449.99, image: '/images/accessories.png' },
  { id: 73, name: 'Microfone HyperX QuadCast S RGB', category: 'Acessórios', price: 999.99, image: '/images/accessories.png' }
];

const CATEGORY_MAP = {
  'Todos': { pt: 'Todos', en: 'All' },
  'Processador': { pt: 'Processadores', en: 'Processors' },
  'Placa de Vídeo': { pt: 'Placas de Vídeo', en: 'Graphics Cards' },
  'Memória RAM': { pt: 'Memória RAM', en: 'RAM Memory' },
  'Placa Mãe': { pt: 'Placas Mãe', en: 'Motherboards' },
  'Armazenamento': { pt: 'Armazenamento', en: 'Storage' },
  'Fonte': { pt: 'Fontes', en: 'Power Supplies' },
  'Gabinete': { pt: 'Gabinetes', en: 'Cases' },
  'Refrigeração': { pt: 'Refrigeração', en: 'Cooling' },
  'Monitor': { pt: 'Monitores', en: 'Monitors' },
  'Periféricos': { pt: 'Periféricos', en: 'Peripherals' },
  'Cadeira Gamer': { pt: 'Cadeiras Gamer', en: 'Gaming Chairs' },
  'Acessórios': { pt: 'Acessórios', en: 'Accessories' }
};

export default function Catalog() {
  const [filter, setFilter] = useState('Todos');
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const [products, setProducts] = useState(ALL_PRODUCTS);

  // Advanced Filter States
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProducts(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch products from backend:', err);
      }
    };
    fetchProducts();
  }, []);
  
  const searchQuery = searchParams.get('search') || '';
  
  const filteredProducts = products
    .filter(p => {
      let status = 'ACTIVE';
      if (p.description && p.description.startsWith('{')) {
        try {
          status = JSON.parse(p.description).status || 'ACTIVE';
        } catch {
          // Ignore invalid description JSON or drafts
        }
      }
      if (status === 'DRAFT') return false;

      const matchesCategory = filter === 'Todos' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Min/Max Price filter (taking active currency scaling into account is not strictly needed for sorting, but we can check values in BRL)
      const priceNum = Number(p.price);
      const minNum = minPrice !== '' ? Number(minPrice) : 0;
      const maxNum = maxPrice !== '' ? Number(maxPrice) : Infinity;
      const matchesPrice = priceNum >= minNum && priceNum <= maxNum;

      // Stock filter
      const isAvailable = p.stock !== undefined ? p.stock > 0 : true;
      const matchesStock = !hideOutOfStock || isAvailable;

      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // Default
    });

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('default');
    setHideOutOfStock(false);
    setFilter('Todos');
    setSearchParams({});
  };

  return (
    <div className="catalog-page container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <h1>{t('catalogTitle')}</h1>
      
      {/* Category Tabs */}
      <div className="filters" style={{ marginBottom: '1.5rem' }}>
        {Object.keys(CATEGORY_MAP).map(key => (
          <button 
            key={key} 
            className={`btn btn-sm ${filter === key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(key)}
          >
            {CATEGORY_MAP[key][language]}
          </button>
        ))}
      </div>

      {/* Advanced Filter Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', flex: 1 }}>
          {/* Sorting */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {language === 'pt' ? 'Ordenação' : 'Sorting'}
            </span>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
            >
              <option value="default">{language === 'pt' ? 'Padrão' : 'Default'}</option>
              <option value="price-asc">{language === 'pt' ? 'Preço: Menor para Maior' : 'Price: Low to High'}</option>
              <option value="price-desc">{language === 'pt' ? 'Preço: Maior para Menor' : 'Price: High to Low'}</option>
              <option value="name-asc">{language === 'pt' ? 'Nome: A-Z' : 'Name: A-Z'}</option>
            </select>
          </div>

          {/* Min/Max Price */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {language === 'pt' ? 'Preço Mínimo (R$)' : 'Min Price (BRL)'}
            </span>
            <input 
              type="number" 
              placeholder="0"
              value={minPrice} 
              onChange={e => setMinPrice(e.target.value)}
              style={{ width: '110px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
              {language === 'pt' ? 'Preço Máximo (R$)' : 'Max Price (BRL)'}
            </span>
            <input 
              type="number" 
              placeholder="99999"
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)}
              style={{ width: '110px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          {/* Hide Out of Stock checkbox */}
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '1.25rem' }}>
            <input 
              type="checkbox" 
              checked={hideOutOfStock} 
              onChange={e => setHideOutOfStock(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--primary-color)' }}
            />
            <span>{language === 'pt' ? 'Ocultar Esgotados' : 'Hide Out of Stock'}</span>
          </label>
        </div>

        {/* Clear Filters Button */}
        <button 
          onClick={clearAllFilters}
          className="btn btn-outline btn-sm"
          style={{ height: 'fit-content', whiteSpace: 'nowrap' }}
        >
          {language === 'pt' ? 'Limpar Filtros' : 'Reset Filters'}
        </button>
      </div>

      {searchQuery && (
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>{t('catalogSearchLabel')} <strong style={{ color: 'var(--primary-color)' }}>"{searchQuery}"</strong></span>
          <button 
            onClick={() => setSearchParams({})} 
            className="btn btn-outline btn-sm"
            style={{ padding: '0.25rem 0.75rem' }}
          >
            {t('catalogClearSearch')}
          </button>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)' }}>
          {t('catalogEmpty')}
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
