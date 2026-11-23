import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

// 2D Vector Barcode Simulator
function BarcodeSvg({ value }) {
  if (!value) return null;
  const lines = [];
  let currentPos = 10;
  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const w1 = (charCode % 3) + 1;
    const w2 = ((charCode >> 1) % 3) + 1;
    const w3 = ((charCode >> 2) % 3) + 1;
    
    lines.push({ pos: currentPos, width: w1 });
    currentPos += w1 + 2;
    lines.push({ pos: currentPos, width: w2 });
    currentPos += w2 + 2;
    lines.push({ pos: currentPos, width: w3 });
    currentPos += w3 + 3;
  }

  return (
    <div style={{ background: 'white', padding: '0.4rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
      <svg width={currentPos + 10} height="40" style={{ display: 'block' }}>
        {lines.map((l, idx) => (
          <rect key={idx} x={l.pos} y="2" width={l.width} height="24" fill="black" />
        ))}
        <text x={(currentPos + 10) / 2} y="36" fill="black" fontSize="7" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
          {value}
        </text>
      </svg>
    </div>
  );
}

// 2D Matrix QR Code Simulator
function QrCodeSvg({ value }) {
  if (!value) return null;
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) + value.charCodeAt(i);
  }

  const matrixSize = 13;
  const rects = [];
  const cellSize = 3;

  const isCornerBlock = (x, y) => {
    if (x < 4 && y < 4) return true;
    if (x >= matrixSize - 4 && y < 4) return true;
    if (x < 4 && y >= matrixSize - 4) return true;
    return false;
  };

  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      let fillCell = false;
      if (isCornerBlock(x, y)) {
        const localX = x < 4 ? x : x >= matrixSize - 4 ? x - (matrixSize - 4) : x;
        const localY = y < 4 ? y : y >= matrixSize - 4 ? y - (matrixSize - 4) : y;
        if (localX === 0 || localX === 3 || localY === 0 || localY === 3) {
          fillCell = true;
        } else if (localX === 1.5 || localY === 1.5) {
          fillCell = true;
        }
      } else {
        const cellId = y * matrixSize + x;
        fillCell = ((hash >> (cellId % 24)) & 1) === 1 || (cellId % 3 === 0 && cellId % 2 !== 0);
      }

      if (fillCell) {
        rects.push(<rect key={`${x}-${y}`} x={x * cellSize} y={y * cellSize} width={cellSize} height={cellSize} fill="black" />);
      }
    }
  }

  return (
    <div style={{ background: 'white', padding: '0.4rem', borderRadius: '4px', display: 'inline-block' }}>
      <svg width={matrixSize * cellSize} height={matrixSize * cellSize} style={{ display: 'block' }}>
        {rects}
      </svg>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { addToast } = useToast();
  const { formatPrice, t, language } = useLanguage();
  
  // Extended Form State
  const [formData, setFormData] = useState({
    name: '',
    descriptionText: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    sku: '',
    barcode: '',
    costPrice: '',
    brand: '',
    status: 'ACTIVE',
    weight: '',
    dimensions: '',
    warranty: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'Processador': return t('builderStepCpu');
      case 'Placa de Vídeo': return t('builderStepGpu');
      case 'Memória RAM': return t('builderStepRam');
      case 'Placa Mãe': return t('builderStepMobo');
      case 'Armazenamento': return t('builderStepStorage');
      case 'Fonte': return t('builderStepPsu');
      case 'Gabinete': return t('builderStepCase');
      case 'Refrigeração': return t('builderStepCooler');
      case 'Monitor': return t('homeCategoryMonitor');
      case 'Periféricos': return t('homeCategoryPeripherals');
      default: return cat;
    }
  };

  const handleOpenNewModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      descriptionText: '',
      price: '',
      image: '',
      category: 'Processador',
      stock: '10',
      sku: 'RTX-' + Math.floor(1000 + Math.random() * 9000),
      barcode: '789' + Math.floor(1000000000 + Math.random() * 9000000000),
      costPrice: '',
      brand: '',
      status: 'ACTIVE',
      weight: '500',
      dimensions: '15x10x5 cm',
      warranty: '12 meses'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setEditingId(product.id);

    let descText = product.description;
    let sku = '';
    let barcode = '';
    let costPrice = '';
    let brand = '';
    let status = 'ACTIVE';
    let weight = '';
    let dimensions = '';
    let warranty = '';

    if (product.description && product.description.startsWith('{')) {
      try {
        const parsed = JSON.parse(product.description);
        descText = parsed.descriptionText || '';
        sku = parsed.sku || '';
        barcode = parsed.barcode || '';
        costPrice = parsed.costPrice || '';
        brand = parsed.brand || '';
        status = parsed.status || 'ACTIVE';
        weight = parsed.weight || '';
        dimensions = parsed.dimensions || '';
        warranty = parsed.warranty || '';
      } catch (e) {
        console.error(e);
      }
    }

    setFormData({
      name: product.name,
      descriptionText: descText,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      stock: product.stock.toString(),
      sku,
      barcode,
      costPrice,
      brand,
      status,
      weight,
      dimensions,
      warranty
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('productsConfirmDelete'))) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        addToast(t('productsDeleteSuccess'), 'success');
        fetchProducts();
      } else {
        const data = await res.json();
        addToast(data.error || t('productsDeleteError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('productsDeleteError'), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing ? `/api/admin/products/${editingId}` : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const serializedDescription = JSON.stringify({
        descriptionText: formData.descriptionText,
        sku: formData.sku,
        barcode: formData.barcode,
        costPrice: formData.costPrice,
        brand: formData.brand,
        status: formData.status,
        weight: formData.weight,
        dimensions: formData.dimensions,
        warranty: formData.warranty
      });

      const bodyData = {
        name: formData.name,
        description: serializedDescription,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        stock: parseInt(formData.stock) || 0
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      
      if (res.ok) {
        addToast(isEditing ? t('productsUpdateSuccess') : t('productsCreateSuccess'), 'success');
        setShowModal(false);
        fetchProducts();
      } else {
        const data = await res.json();
        addToast(data.error || t('productsSaveError'), 'error');
      }
    } catch (err) {
      console.error(err);
      addToast(t('productsSaveError'), 'error');
    }
  };

  // Profit calculations
  const salePrice = parseFloat(formData.price) || 0;
  const costPrice = parseFloat(formData.costPrice) || 0;
  const profit = salePrice - costPrice;
  const profitMargin = salePrice > 0 ? ((profit / salePrice) * 100).toFixed(1) : '0.0';

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>{t('productsTitle')}</h1>
        <button onClick={handleOpenNewModal} className="btn btn-primary">
          <Plus size={20} /> {t('productsNewBtn')}
        </button>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('productsThProduct')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('productsThCategory')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('productsThPrice')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', textAlign: 'center' }}>{t('productsThStock')}</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{t('productsThActions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              let sku = '';
              if (product.description && product.description.startsWith('{')) {
                try {
                  sku = JSON.parse(product.description).sku || '';
                } catch {
                  // Ignore parsing error
                }
              }
              return (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: '500' }}>{product.name}</div>
                      {sku && <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontFamily: 'monospace' }}>SKU: {sku}</div>}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>{getCategoryLabel(product.category)}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{formatPrice(product.price)}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 'bold', color: product.stock <= 5 ? '#ef4444' : 'var(--text-main)' }}>
                    {product.stock} {language === 'pt' ? 'un' : 'pcs'}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEditModal(product)} className="btn btn-outline btn-sm" style={{ padding: '0.5rem' }} title={t('productsCancel')}><Edit size={16} /></button>
                      <button onClick={() => handleDelete(product.id)} className="btn btn-outline btn-sm" style={{ padding: '0.5rem', color: '#ef4444' }} title={t('productsThActions')}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {t('productsEmpty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Robust Scroll-Centering Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', zIndex: 10000 }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', position: 'relative' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              {isEditing ? t('productsEditModalTitle') : t('productsCreateModalTitle')}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Double-Column Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                {/* Column 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormName')}</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormCategory')}</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                      <option value="Processador">{t('builderStepCpu')}</option>
                      <option value="Placa de Vídeo">{t('builderStepGpu')}</option>
                      <option value="Memória RAM">{t('builderStepRam')}</option>
                      <option value="Placa Mãe">{t('builderStepMobo')}</option>
                      <option value="Armazenamento">{t('builderStepStorage')}</option>
                      <option value="Fonte">{t('builderStepPsu')}</option>
                      <option value="Gabinete">{t('builderStepCase')}</option>
                      <option value="Refrigeração">{t('builderStepCooler')}</option>
                      <option value="Monitor">{t('homeCategoryMonitor')}</option>
                      <option value="Periféricos">{t('homeCategoryPeripherals')}</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormSalePrice')} ({language === 'pt' ? 'R$' : 'USD'})</label>
                      <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormCostPrice')} ({language === 'pt' ? 'R$' : 'USD'})</label>
                      <input type="number" step="0.01" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormBrand')}</label>
                      <input type="text" placeholder="Ex: ASUS, Intel" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormStock')}</label>
                      <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormWeight')}</label>
                      <input type="number" placeholder="Ex: 500" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormDimensions')}</label>
                      <input type="text" placeholder="Ex: 15x10x5 cm" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormSku')}</label>
                    <input type="text" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontFamily: 'monospace' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormBarcode')}</label>
                    <input type="text" required value={formData.barcode} onChange={e => setFormData({...formData, barcode: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontFamily: 'monospace' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormImgUrl')}</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="text" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ flex: 1, padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                      <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center' }}>
                        {t('productsFormLoadBtn')}
                        <input type="file" accept="image/*" onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => setFormData({...formData, image: r.result});
                            r.readAsDataURL(file);
                          }
                        }} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormWarranty')}</label>
                      <input type="text" placeholder="Ex: 12 meses" value={formData.warranty} onChange={e => setFormData({...formData, warranty: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormStatus')}</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
                        <option value="ACTIVE">{t('productsFormStatusActive')}</option>
                        <option value="DRAFT">{t('productsFormStatusDraft')}</option>
                        <option value="OUT_OF_SEASON">{t('productsFormStatusOutOfSeason')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsFormDescription')}</label>
                    <textarea required rows="2" value={formData.descriptionText} onChange={e => setFormData({...formData, descriptionText: e.target.value})} style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'vertical' }} />
                  </div>
                </div>

              </div>

              {/* Advanced Panel: Barcode / QR Code / Profit Margins */}
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                {/* Financial Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>{t('productsMarginCalc')}</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: profit > 0 ? 'var(--primary-color)' : '#ef4444' }}>
                    {profit > 0 ? `+${formatPrice(profit)}` : formatPrice(profit)}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: profit > 0 ? 'var(--primary-color)' : '#ef4444', fontWeight: 'bold' }}>
                    {t('productsMargin')}: {profitMargin}%
                  </span>
                </div>

                {/* Barcode Projection */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', padding: '0 0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsLiveBarcode')}</span>
                  <BarcodeSvg value={formData.barcode} />
                </div>

                {/* QR Code Projection */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 'bold' }}>{t('productsQrCode')}</span>
                  <QrCodeSvg value={editingId ? `http://localhost:5173/produtos/${editingId}` : `http://localhost:5173/produtos/preview`} />
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>{t('productsCancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? t('productsUpdateBtn') : t('productsCreateBtn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
