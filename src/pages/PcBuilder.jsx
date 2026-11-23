import { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Check, ChevronRight, Cpu, MemoryStick, CircuitBoard, MonitorPlay, HardDrive, Zap, Box, Fan, AlertTriangle } from 'lucide-react';

const BUILDER_STEPS = [
  { id: 'cpu', title: 'Processador', icon: Cpu, options: [
    { id: 2, name: 'AMD Ryzen 9 7950X3D', price: 4699.99, image: '/images/cpu.jpg' },
    { id: 10, name: 'Intel Core i9-14900K', price: 4299.99, image: '/images/cpu.jpg' }
  ]},
  { id: 'motherboard', title: 'Placa Mãe', icon: CircuitBoard, options: [
    { id: 4, name: 'ASUS ROG Strix Z790-E', price: 3479.99, image: '/images/motherboard.png' },
    { id: 11, name: 'Gigabyte X670E AORUS Master', price: 3199.99, image: '/images/motherboard.png' }
  ]},
  { id: 'ram', title: 'Memória RAM', icon: MemoryStick, options: [
    { id: 3, name: 'G.SKILL Trident Z5 RGB 32GB', price: 1129.99, image: '/images/ram.jpg' },
    { id: 12, name: 'Corsair Vengeance 64GB DDR5', price: 2199.99, image: '/images/ram.jpg' }
  ]},
  { id: 'gpu', title: 'Placa de Vídeo', icon: MonitorPlay, options: [
    { id: 1, name: 'NVIDIA GeForce RTX 4090', price: 15999.99, image: '/images/gpu.jpg' },
    { id: 13, name: 'AMD Radeon RX 7900 XTX', price: 7999.99, image: '/images/gpu.jpg' }
  ]},
  { id: 'storage', title: 'Armazenamento', icon: HardDrive, options: [
    { id: 14, name: 'Samsung 990 PRO 2TB NVMe', price: 1399.99, image: '/images/ssd.jpg' },
    { id: 15, name: 'WD Black SN850X 1TB NVMe', price: 799.99, image: '/images/ssd.jpg' }
  ]},
  { id: 'psu', title: 'Fonte', icon: Zap, options: [
    { id: 16, name: 'Corsair RM1000x 1000W', price: 1299.99, image: '/images/psu.jpg' },
    { id: 17, name: 'ASUS ROG Thor 1200W', price: 2499.99, image: '/images/psu.jpg' }
  ]},
  { id: 'case', title: 'Gabinete', icon: Box, options: [
    { id: 18, name: 'Lian Li O11 Dynamic EVO', price: 1199.99, image: '/images/case.jpg' },
    { id: 19, name: 'NZXT H9 Flow Black', price: 1099.99, image: '/images/case.jpg' }
  ]},
  { id: 'cooler', title: 'Refrigeração', icon: Fan, options: [
    { id: 20, name: 'NZXT Kraken Elite 360mm', price: 1899.99, image: '/images/cooler.jpg' },
    { id: 21, name: 'Noctua NH-D15 Black', price: 899.99, image: '/images/cooler.jpg' }
  ]}
];

const STEP_CATEGORIES = {
  cpu: 'Processador',
  motherboard: 'Placa Mãe',
  ram: 'Memória RAM',
  gpu: 'Placa de Vídeo',
  storage: 'Armazenamento',
  psu: 'Fonte',
  case: 'Gabinete',
  cooler: 'Refrigeração'
};

// Recommended Presets Config
const PRESETS = {
  budget: {
    name: { pt: 'Gamer Custo-Benefício', en: 'Best Value Gaming' },
    items: [
      'Ryzen 5', 'i7-14700K', 'i7',
      'TUF Gaming', 'MAG B650', 'B760M',
      'FURY Beast', 'Ripjaws', '16GB',
      'RX 7800 XT', 'RTX 4070',
      'NV2 2TB', 'Kingston NV2',
      'Focus GX-750W', 'Reactor 850W',
      '4000D Airflow',
      'Dark Rock Pro 5', 'LT720'
    ]
  },
  streamer: {
    name: { pt: 'Pro Streamer & Creator', en: 'Pro Streamer & Creator' },
    items: [
      'Ryzen 7', 'i7-14700K',
      'ROG Strix', 'AORUS Master',
      'Trident Z5', 'Vengeance', '32GB',
      'RTX 4080 Super', 'RTX 4070 Ti', 'RX 7900 XTX',
      '990 PRO 2TB', 'SN850X',
      'RM1000x', 'Reactor 850W',
      'O11 Dynamic', 'H9 Flow',
      'Kraken Elite 360mm', 'H150i'
    ]
  },
  cyberpunk: {
    name: { pt: 'Ultimate Cyberpunk 4K', en: 'Ultimate Cyberpunk 4K' },
    items: [
      'Ryzen 9', 'i9-14900K', 'i9',
      'ROG Strix Z790-E', 'AORUS Master', 'Taichi',
      'Dominator Titanium', 'Trident Z5', '64GB',
      'RTX 4090',
      'T700 2TB', '990 PRO',
      'ROG Thor 1200W', 'RM1000x',
      'Hyte Y60', 'O11 Dynamic',
      'Kraken Elite 360mm'
    ]
  }
};

// 3D Isometric Hologram PC Assembly Visualizer
function HologramPc({ selections }) {
  const hasCpu = !!selections.cpu;
  const hasMobo = !!selections.motherboard;
  const hasRam = !!selections.ram;
  const hasGpu = !!selections.gpu;
  const hasStorage = !!selections.storage;
  const hasPsu = !!selections.psu;
  const hasCase = !!selections.case;
  const hasCooler = !!selections.cooler;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '320px',
      background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, rgba(5,5,10,0.85) 90%)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(0, 255, 136, 0.25)',
      overflow: 'hidden',
      marginBottom: '1.5rem',
      boxShadow: 'inset 0 0 25px rgba(0, 255, 136, 0.15), 0 0 15px rgba(0, 255, 136, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Grid Pattern Background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 255, 136, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.04) 1px, transparent 1px)',
        backgroundSize: '12px 12px',
        opacity: 0.9,
        pointerEvents: 'none'
      }} />

      {/* Cyber Laser Scanline */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '1.5px',
        background: 'rgba(0, 255, 136, 0.6)',
        boxShadow: '0 0 8px rgba(0, 255, 136, 0.9)',
        animation: 'hologram-scan 3.5s linear infinite',
        pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes hologram-scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes pulse-core {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes flow-circuit {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes float-hologram {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-rgb {
          0% { stroke: #ff2a5f; }
          33% { stroke: #9d4edd; }
          66% { stroke: #00ccff; }
          100% { stroke: #ff2a5f; }
        }
      `}</style>

      {/* SVG Canvas for Isometric 3D PC */}
      <svg 
        viewBox="0 0 300 300" 
        style={{ 
          width: '95%', 
          height: '95%', 
          zIndex: 1, 
          pointerEvents: 'none',
          animation: 'float-hologram 4s ease-in-out infinite'
        }}
      >
        {/* HUD Texts */}
        <text x="12" y="18" fill="var(--primary-color)" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.8">SYSTEM STATUS: ASSEMBLY_ACTIVE</text>
        <text x="12" y="28" fill="var(--primary-color)" fontSize="8" fontFamily="monospace" opacity="0.6">CHASSIS: GAMING_TOWER_3D</text>
        
        {/* Projector Base Ring */}
        <ellipse cx="150" cy="255" rx="100" ry="22" fill="rgba(0, 255, 136, 0.01)" stroke="rgba(0, 255, 136, 0.15)" strokeWidth="1" strokeDasharray="4 4" />
        <ellipse cx="150" cy="255" rx="75" ry="16" fill="rgba(0, 255, 136, 0.01)" stroke="rgba(0, 255, 136, 0.1)" strokeWidth="1" />
        
        {/* 1. CASE BASE BLUEPRINT */}
        <polygon points="70,220 150,255 230,220 150,185" fill="rgba(0, 255, 136, 0.02)" stroke={hasCase ? "var(--primary-color)" : "rgba(0, 255, 136, 0.2)"} strokeWidth="1.8" opacity={hasCase ? 0.95 : 0.4} />

        {/* 2. MOTHERBOARD */}
        {hasMobo ? (
          <g opacity="0.9">
            {/* Mobo Plate */}
            <polygon points="95,95 145,70 145,185 95,210" fill="rgba(0, 204, 255, 0.18)" stroke="#00ccff" strokeWidth="1.5" />
            {/* PCIe lines */}
            <line x1="105" y1="175" x2="135" y2="160" stroke="#00ccff" strokeWidth="1.2" />
            <line x1="105" y1="180" x2="135" y2="165" stroke="#00ccff" strokeWidth="1.2" />
            {/* VRM Heatsinks */}
            <polygon points="100,105 125,92 125,102 100,115" fill="rgba(0, 204, 255, 0.3)" stroke="#00ccff" strokeWidth="1" />
          </g>
        ) : (
          <polygon points="95,95 145,70 145,185 95,210" fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" strokeWidth="1" />
        )}

        {/* 3. CPU Core */}
        {hasCpu && (
          <g>
            <polygon points="112,132.5 122,127.5 132,132.5 122,137.5" fill="rgba(255, 183, 3, 0.3)" stroke="#ffb703" strokeWidth="1.2" />
            <circle cx="122" cy="132.5" r="3" fill="#ffb703" style={{ animation: 'pulse-core 1.2s infinite' }} />
          </g>
        )}

        {/* 4. RAM STICKS */}
        {hasRam && (
          <g stroke="#9d4edd" strokeWidth="2.2" opacity="0.95" strokeLinecap="round">
            {/* Draw 4 sticks next to CPU */}
            <line x1="134" y1="126" x2="134" y2="101" />
            <line x1="138" y1="128" x2="138" y2="103" />
            <line x1="142" y1="130" x2="142" y2="105" />
          </g>
        )}

        {/* 5. POWER SUPPLY */}
        {hasPsu && (
          <g>
            {/* PSU shroud at bottom */}
            <polygon points="75,215 115,235 115,195 75,175" fill="rgba(251, 133, 0, 0.15)" stroke="#fb8500" strokeWidth="1.2" />
            <polygon points="115,235 155,215 155,175 115,195" fill="rgba(251, 133, 0, 0.15)" stroke="#fb8500" strokeWidth="1.2" />
            <polygon points="75,175 115,195 155,175 115,155" fill="rgba(251, 133, 0, 0.1)" stroke="#fb8500" strokeWidth="1" />
            {/* Vent grills */}
            <line x1="120" y1="202" x2="145" y2="190" stroke="#fb8500" strokeWidth="1" opacity="0.6" />
            <line x1="120" y1="208" x2="145" y2="196" stroke="#fb8500" strokeWidth="1" opacity="0.6" />
            {/* Circuit animation line */}
            <path d="M 115,195 Q 125,185 122,150" fill="none" stroke="#fb8500" strokeWidth="1.2" strokeDasharray="4 4" style={{ animation: 'flow-circuit 1s linear infinite' }} />
          </g>
        )}

        {/* 6. STORAGE (M.2 / SSD) */}
        {hasStorage && (
          <polygon points="103,158 118,150 120,152 105,160" fill="rgba(0, 245, 212, 0.4)" stroke="#00f5d4" strokeWidth="1" />
        )}

        {/* 7. GPU (Massive 3D Graphics Card) */}
        {hasGpu && (
          <g>
            {/* Connection bracket */}
            <polygon points="100,165 115,157 115,147 100,155" fill="rgba(255, 42, 95, 0.4)" />
            {/* Back Plate */}
            <polygon points="100,145 160,175 160,150 100,120" fill="rgba(255, 42, 95, 0.15)" stroke="#ff2a5f" strokeWidth="1" />
            {/* Main GPU Block Body (Horizontal projection) */}
            <polygon points="100,145 160,175 200,155 140,125" fill="rgba(255, 42, 95, 0.15)" stroke="#ff2a5f" strokeWidth="1" />
            {/* Front Shroud (Visible side facing front-right) */}
            <polygon points="160,175 200,155 200,130 160,150" fill="rgba(255, 42, 95, 0.25)" stroke="#ff2a5f" strokeWidth="1.5" />
            {/* Circular GPU Fans */}
            <ellipse cx="173" cy="165" rx="5" ry="8" stroke="#ff2a5f" strokeWidth="1" fill="none" />
            <ellipse cx="187" cy="158" rx="5" ry="8" stroke="#ff2a5f" strokeWidth="1" fill="none" />
            {/* Tech RGB strip along card side */}
            <line x1="162" y1="152" x2="198" y2="134" stroke="#ff2a5f" strokeWidth="2" style={{ animation: 'glow-rgb 3s linear infinite' }} />
          </g>
        )}

        {/* 8. COOLER (Water Cooler AIO) */}
        {hasCooler && (
          <g>
            {/* Water Pump on CPU */}
            <circle cx="122" cy="132.5" r="5.5" fill="rgba(0, 204, 255, 0.25)" stroke="#00ccff" strokeWidth="1.5" />
            <circle cx="122" cy="132.5" r="3" fill="none" stroke="#00ccff" strokeWidth="1" strokeDasharray="3 2" />
            {/* Coolant Tubes */}
            <path d="M 122,127 C 122,110 145,100 145,78" fill="none" stroke="#00ccff" strokeWidth="1.5" />
            <path d="M 125,129 C 125,112 148,102 148,80" fill="none" stroke="#00ccff" strokeWidth="1.5" />
            {/* Radiator block at the top */}
            <polygon points="100,68 170,33 170,47 100,82" fill="rgba(0, 204, 255, 0.2)" stroke="#00ccff" strokeWidth="1.5" />
            {/* Double Radiator Fans */}
            <ellipse cx="123" cy="62" rx="14" ry="5.5" stroke="#00ccff" strokeWidth="0.8" fill="none" />
            <ellipse cx="147" cy="50" rx="14" ry="5.5" stroke="#00ccff" strokeWidth="0.8" fill="none" />
          </g>
        )}

        {/* 9. CASE CHASSIS TOWER WRAPPER */}
        {hasCase && (
          <g stroke="var(--primary-color)" strokeWidth="1.5" opacity="0.8">
            {/* Front pillars */}
            <line x1="70" y1="220" x2="70" y2="80" />
            <line x1="150" y1="255" x2="150" y2="115" />
            <line x1="230" y1="220" x2="230" y2="80" strokeLinecap="round" />
            {/* Back pillar */}
            <line x1="150" y1="185" x2="150" y2="45" strokeDasharray="3 3" opacity="0.4" />
            
            {/* Top ceiling panel */}
            <polygon points="70,80 150,115 230,80 150,45" fill="rgba(0, 255, 136, 0.05)" stroke="var(--primary-color)" strokeWidth="1.5" />
            
            {/* Decorative chassis grids */}
            <line x1="85" y1="87" x2="135" y2="108" stroke="var(--primary-color)" strokeWidth="0.8" opacity="0.5" />
            <line x1="90" y1="85" x2="130" y2="102" stroke="var(--primary-color)" strokeWidth="0.8" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
}

export default function PcBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({});
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t, formatPrice, language } = useLanguage();
  const [steps, setSteps] = useState(BUILDER_STEPS);
  const compatibilityWarnings = useMemo(() => {
    const warnings = [];
    const cpu = selections.cpu;
    const mobo = selections.motherboard;
    const gpu = selections.gpu;
    const psu = selections.psu;

    if (cpu && mobo) {
      const cpuName = cpu.name.toLowerCase();
      const moboName = mobo.name.toLowerCase();
      
      let cpuSocket = null;
      if (cpuName.includes('ryzen') || cpuName.includes('am5') || cpuName.includes('7800x3d') || cpuName.includes('7950x3d') || cpuName.includes('7600x')) {
        cpuSocket = 'AM5';
      } else if (cpuName.includes('intel') || cpuName.includes('core') || cpuName.includes('14900k') || cpuName.includes('14700k')) {
        cpuSocket = 'LGA1700';
      }

      let moboSocket = null;
      if (moboName.includes('x670') || moboName.includes('b650') || moboName.includes('am5') || moboName.includes('aorus master')) {
        moboSocket = 'AM5';
      } else if (moboName.includes('z790') || moboName.includes('b760') || moboName.includes('lga1700') || moboName.includes('rog strix z790')) {
        moboSocket = 'LGA1700';
      }

      if (cpuSocket && moboSocket && cpuSocket !== moboSocket) {
        warnings.push({
          type: 'error',
          message: language === 'pt' 
            ? `Incompatibilidade de Socket! Processador ${cpuSocket} selecionado com Placa Mãe ${moboSocket}. Eles não se encaixam fisicamente.` 
            : `Socket Mismatch! ${cpuSocket} CPU paired with a ${moboSocket} Motherboard. They will not fit physically.`
        });
      }
    }

    if (gpu && psu) {
      const gpuName = gpu.name.toLowerCase();
      const psuName = psu.name.toLowerCase();

      const isHighEndGpu = gpuName.includes('4090') || gpuName.includes('7900 xtx') || gpuName.includes('4080');
      
      let psuWattage = 1000;
      const match = psuName.match(/(\d+)w/);
      if (match) {
        psuWattage = parseInt(match[1]);
      }

      if (isHighEndGpu && psuWattage < 850) {
        warnings.push({
          type: 'warning',
          message: language === 'pt'
            ? `Alimentação Recomendada: A placa de vídeo selecionada consome muita energia. Recomenda-se uma fonte de pelo menos 850W (a atual possui ${psuWattage}W).`
            : `Recommended Power: The selected graphics card is power hungry. A PSU of at least 850W is recommended (current is ${psuWattage}W).`
        });
      }
    }

    return warnings;
  }, [selections, language]);

  useEffect(() => {
    const fetchBuilderOptions = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const dbProducts = await res.json();
          if (dbProducts && dbProducts.length > 0) {
            const updatedSteps = BUILDER_STEPS.map(step => {
              const categoryName = STEP_CATEGORIES[step.id];
              const matchingProducts = dbProducts.filter(p => p.category === categoryName);
              return {
                ...step,
                options: matchingProducts.length > 0 ? matchingProducts : step.options
              };
            });
            setSteps(updatedSteps);
          }
        }
      } catch (err) {
        console.error('Failed to fetch builder options:', err);
      }
    };
    fetchBuilderOptions();
  }, []);

  const stepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFinished = currentStep === steps.length;

  const getStepTitle = (stepId) => {
    const map = {
      cpu: 'builderStepCpu',
      motherboard: 'builderStepMobo',
      ram: 'builderStepRam',
      gpu: 'builderStepGpu',
      storage: 'builderStepStorage',
      psu: 'builderStepPsu',
      case: 'builderStepCase',
      cooler: 'builderStepCooler'
    };
    return t(map[stepId] || stepId);
  };

  const handleSelect = (option) => {
    setSelections({ ...selections, [stepData.id]: option });
  };

  const handleNext = () => {
    if (selections[stepData.id]) {
      setCurrentStep(prev => prev + 1);
    } else {
      addToast(t('builderSelectToast'), 'error');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    Object.values(selections).forEach(item => {
      addToCart({ ...item, category: 'PC Build' });
    });
    addToast(t('builderSuccessToast'), 'success');
    navigate('/carrinho');
  };

  const calculateTotal = () => {
    return Object.values(selections).reduce((acc, item) => acc + item.price, 0);
  };

  const handleLoadPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    const newSelections = {};
    steps.forEach(step => {
      const matchedOption = step.options.find(opt => 
        preset.items.some(keyword => opt.name.toLowerCase().includes(keyword.toLowerCase()))
      ) || step.options[0];
      
      if (matchedOption) {
        newSelections[step.id] = matchedOption;
      }
    });

    setSelections(newSelections);
    setCurrentStep(steps.length); // Skip straight to final review step
    addToast(
      language === 'pt'
        ? `Setup "${preset.name.pt}" carregado no visualizador 3D!`
        : `Setup "${preset.name.en}" loaded in 3D visualizer!`,
      'success'
    );
  };

  if (isFinished) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3.5rem 2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)', fontFamily: 'var(--font-heading)' }} className="text-gradient-primary">{t('builderFinishedTitle')}</h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            {t('builderFinishedDesc')}
          </p>

          {/* Hologram visualizer on success */}
          <HologramPc selections={selections} language={language} />
          
          <div style={{ textAlign: 'left', background: 'rgba(5, 5, 10, 0.4)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-main)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '2px', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{t('builderSummary')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {steps.map(step => {
                const selectedItem = selections[step.id];
                return (
                  <div key={step.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '500' }}>{getStepTitle(step.id)}:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '70%', textAlign: 'right' }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{selectedItem?.name}</span>
                      <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: '700', marginTop: '0.15rem' }}>{formatPrice(selectedItem?.price)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ 
            background: 'rgba(0, 255, 136, 0.02)', 
            border: '1px solid rgba(0, 255, 136, 0.15)', 
            padding: '1.5rem', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '2.5rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>{t('builderTotal')}</span>
            <div style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--primary-color)', marginTop: '0.25rem', textShadow: '0 0 10px var(--primary-glow)' }}>
              {formatPrice(calculateTotal())}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
            <button onClick={handleBack} className="btn btn-outline" style={{ padding: '0.875rem 1.5rem' }}>
              {t('builderVoltarAlterar')}
            </button>
            <button onClick={handleFinish} className="btn btn-primary btn-cyber" style={{ padding: '0.875rem 2rem' }}>
              {t('builderAddCart')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }} className="text-gradient-primary">{t('builderTitle')}</h1>
      
      {/* Recommended Presets Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--primary-color), transparent)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
          {language === 'pt' ? '⚡ CARREGAR CONFIGURAÇÃO PRONTA (PRESET)' : '⚡ LOAD PRE-CONFIGURED GAMING SETUP (PRESET)'}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {Object.entries(PRESETS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleLoadPreset(key)}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', borderColor: 'rgba(0, 255, 136, 0.3)', color: 'var(--primary-color)' }}
            >
              {value.name[language === 'pt' ? 'pt' : 'en']}
            </button>
          ))}
        </div>
      </div>

      <div className="builder-progress glass-panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', overflowX: 'auto', gap: '1rem' }}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '80px', opacity: isActive || isCompleted ? 1 : 0.4, transition: 'all 0.3s ease' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isActive ? 'var(--primary-color)' : isCompleted ? 'rgba(0, 255, 136, 0.1)' : 'var(--bg-color)', border: `2px solid ${isActive || isCompleted ? 'var(--primary-color)' : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', boxShadow: isActive ? 'var(--shadow-glow)' : 'none' }}>
                {isCompleted ? <Check size={20} color="#000" /> : <Icon size={20} color={isActive ? '#000' : 'var(--text-muted)'} />}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--primary-color)' : 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>{getStepTitle(step.id)}</span>
            </div>
          );
        })}
      </div>

      <div className="builder-layout" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', borderLeft: '4px solid var(--primary-color)', paddingLeft: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('builderStepChoose')} {getStepTitle(stepData.id)}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {stepData.options.map(option => {
              const isSelected = selections[stepData.id]?.id === option.id;
              return (
                <div 
                  key={option.id} 
                  onClick={() => handleSelect(option)}
                  className={`glass-panel ${isSelected ? 'selected-border' : ''}`}
                  style={{ 
                    padding: '1.5rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: isSelected ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '0', right: '0', background: 'var(--primary-color)', color: '#000', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: 'var(--radius-md)', textTransform: 'uppercase' }}>
                      {t('builderSelected')}
                    </div>
                  )}
                  <img src={option.image} alt={option.name} style={{ width: '100%', height: '120px', objectFit: 'contain', marginBottom: '1rem', borderRadius: 'var(--radius-md)', transition: 'transform 0.3s ease' }} className="builder-option-image" />
                  <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', height: '2.5rem', overflow: 'hidden' }}>{option.name}</h3>
                  <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {formatPrice(option.price)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
            <button onClick={handleBack} disabled={currentStep === 0} className="btn btn-outline" style={{ opacity: currentStep === 0 ? 0.3 : 1, cursor: currentStep === 0 ? 'not-allowed' : 'pointer' }}>
              {t('builderBack')}
            </button>
            <button onClick={handleNext} className="btn btn-primary btn-cyber">
              {isLastStep ? t('builderFinish') : t('builderNext')} <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', height: 'fit-content', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>{t('builderYourPc')}</h3>
          
          {/* Hologram Visualizer Preview */}
          <HologramPc selections={selections} />

          {/* Compatibility Alerts */}
          {compatibilityWarnings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {compatibilityWarnings.map((w, index) => (
                <div 
                  key={index} 
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: w.type === 'error' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                    background: w.type === 'error' ? 'rgba(239, 68, 68, 0.04)' : 'rgba(245, 158, 11, 0.04)',
                    color: w.type === 'error' ? '#ef4444' : '#f59e0b',
                    fontSize: '0.8rem',
                    lineHeight: '1.3',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    boxShadow: w.type === 'error' ? '0 0 10px rgba(239, 68, 68, 0.1)' : 'none'
                  }}
                >
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>{w.message}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {steps.map(step => {
              const selectedItem = selections[step.id];
              return (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{getStepTitle(step.id)}</span>
                  {selectedItem ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-color)' }}>{selectedItem.name}</span>
                  ) : (
                    <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.15)' }}>{t('builderWaiting')}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('builderSubtotal')}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.25rem' }}>
              {formatPrice(calculateTotal())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
