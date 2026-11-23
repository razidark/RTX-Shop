import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const REAL_PRODUCTS = [
  // Processadores (5 products)
  {
    name: 'AMD Ryzen 9 7950X3D',
    category: 'Processador',
    price: 4699.99,
    image: '/images/amd_ryzen9_7950x3d.png',
    description: JSON.stringify({
      descriptionText: 'O processador definitivo para jogos e criação, com tecnologia AMD 3D V-Cache.',
      sku: 'RTX-CPU-7950X3D',
      barcode: '7891000979502',
      costPrice: '3200.00',
      brand: 'AMD',
      status: 'ACTIVE',
      weight: '450',
      dimensions: '4.0 x 4.0 x 0.6 cm',
      warranty: '36 meses'
    }),
    stock: 15
  },
  {
    name: 'Intel Core i9-14900K',
    category: 'Processador',
    price: 4299.99,
    image: '/images/intel_i9_14900k.png',
    description: JSON.stringify({
      descriptionText: 'Processador de desktop de 14ª geração com 24 núcleos (8 P-cores + 16 E-cores) e clock de até 6.0 GHz.',
      sku: 'RTX-CPU-14900K',
      barcode: '7891000149007',
      costPrice: '2950.00',
      brand: 'Intel',
      status: 'ACTIVE',
      weight: '350',
      dimensions: '4.5 x 3.75 x 0.5 cm',
      warranty: '36 meses'
    }),
    stock: 12
  },
  {
    name: 'AMD Ryzen 7 7800X3D',
    category: 'Processador',
    price: 2999.99,
    image: '/images/amd_ryzen7_7800x3d.png',
    description: JSON.stringify({
      descriptionText: 'O campeão absoluto de custo-benefício para games com a poderosa tecnologia 3D V-Cache.',
      sku: 'RTX-CPU-7800X3D',
      barcode: '7891000780023',
      costPrice: '1900.00',
      brand: 'AMD',
      status: 'ACTIVE',
      weight: '450',
      dimensions: '4.0 x 4.0 x 0.6 cm',
      warranty: '36 meses'
    }),
    stock: 22
  },
  {
    name: 'Intel Core i7-14700K',
    category: 'Processador',
    price: 2799.99,
    image: '/images/intel_i7_14700k.png',
    description: JSON.stringify({
      descriptionText: 'Processador potente para streaming e jogos pesados com 20 núcleos e 28 threads.',
      sku: 'RTX-CPU-14700K',
      barcode: '7891000147003',
      costPrice: '1850.00',
      brand: 'Intel',
      status: 'ACTIVE',
      weight: '350',
      dimensions: '4.5 x 3.75 x 0.5 cm',
      warranty: '36 meses'
    }),
    stock: 18
  },
  {
    name: 'AMD Ryzen 5 7600X',
    category: 'Processador',
    price: 1499.99,
    image: '/images/amd_ryzen9_7950x3d.png',
    description: JSON.stringify({
      descriptionText: 'Excelente performance single-core para a nova plataforma AM5 da AMD.',
      sku: 'RTX-CPU-7600X',
      barcode: '7891000760018',
      costPrice: '980.00',
      brand: 'AMD',
      status: 'ACTIVE',
      weight: '450',
      dimensions: '4.0 x 4.0 x 0.6 cm',
      warranty: '36 meses'
    }),
    stock: 30
  },

  // Placas de Vídeo (5 products)
  {
    name: 'NVIDIA GeForce RTX 4090',
    category: 'Placa de Vídeo',
    price: 15999.99,
    image: '/images/nvidia_rtx4090.png',
    description: JSON.stringify({
      descriptionText: 'A placa gráfica de maior desempenho do mercado. Perfeita para 4K nativo e Ray Tracing.',
      sku: 'RTX-GPU-4090',
      barcode: '7891000040908',
      costPrice: '11500.00',
      brand: 'NVIDIA',
      status: 'ACTIVE',
      weight: '2200',
      dimensions: '30.4 x 13.7 x 6.1 cm',
      warranty: '36 meses'
    }),
    stock: 8
  },
  {
    name: 'AMD Radeon RX 7900 XTX',
    category: 'Placa de Vídeo',
    price: 7999.99,
    image: '/images/amd_rx7900xtx.png',
    description: JSON.stringify({
      descriptionText: 'Flagship da AMD com 24GB de VRAM e arquitetura RDNA 3 para jogos em altíssima resolução.',
      sku: 'RTX-GPU-7900XTX',
      barcode: '7891000079007',
      costPrice: '5800.00',
      brand: 'AMD',
      status: 'ACTIVE',
      weight: '1800',
      dimensions: '28.7 x 12.3 x 5.0 cm',
      warranty: '36 meses'
    }),
    stock: 11
  },
  {
    name: 'NVIDIA GeForce RTX 4080 Super',
    category: 'Placa de Vídeo',
    price: 8499.99,
    image: '/images/nvidia_rtx4080.png',
    description: JSON.stringify({
      descriptionText: 'Excelente placa gráfica com 16GB de VRAM e suporte total a DLSS 3.5.',
      sku: 'RTX-GPU-4080S',
      barcode: '7891000040809',
      costPrice: '6100.00',
      brand: 'NVIDIA',
      status: 'ACTIVE',
      weight: '2000',
      dimensions: '31.0 x 14.0 x 6.1 cm',
      warranty: '36 meses'
    }),
    stock: 14
  },
  {
    name: 'NVIDIA GeForce RTX 4070 Ti Super',
    category: 'Placa de Vídeo',
    price: 6299.99,
    image: '/images/nvidia_rtx4070ti.png',
    description: JSON.stringify({
      descriptionText: 'Upgrade com 16GB de VRAM ideal para jogos competitivos e renderização em 1440p.',
      sku: 'RTX-GPU-4070TIS',
      barcode: '7891000040700',
      costPrice: '4500.00',
      brand: 'NVIDIA',
      status: 'ACTIVE',
      weight: '1600',
      dimensions: '29.5 x 12.0 x 5.0 cm',
      warranty: '36 meses'
    }),
    stock: 16
  },
  {
    name: 'AMD Radeon RX 7800 XT',
    category: 'Placa de Vídeo',
    price: 3899.99,
    image: '/images/amd_rx7800xt.png',
    description: JSON.stringify({
      descriptionText: 'Melhor opção custo-benefício para jogos em 1440p no ultra com 16GB de memória.',
      sku: 'RTX-GPU-7800XT',
      barcode: '7891000078000',
      costPrice: '2700.00',
      brand: 'AMD',
      status: 'ACTIVE',
      weight: '1400',
      dimensions: '26.7 x 11.0 x 5.0 cm',
      warranty: '36 meses'
    }),
    stock: 25
  },

  // Memória RAM (3 products)
  {
    name: 'Corsair Vengeance 64GB DDR5',
    category: 'Memória RAM',
    price: 2199.99,
    image: '/images/corsair_vengeance_ddr5.png',
    description: JSON.stringify({
      descriptionText: 'Kit de 64GB (2x32GB) DDR5 6000MHz ideal para criadores de conteúdo e multitarefas.',
      sku: 'RTX-RAM-CV64G',
      barcode: '7891000640003',
      costPrice: '1500.00',
      brand: 'Corsair',
      status: 'ACTIVE',
      weight: '120',
      dimensions: '13.5 x 3.5 x 0.7 cm',
      warranty: 'Garantia Vitalícia'
    }),
    stock: 20
  },
  {
    name: 'G.SKILL Trident Z5 RGB 32GB',
    category: 'Memória RAM',
    price: 1129.99,
    image: '/images/gskill_trident_z5.png',
    description: JSON.stringify({
      descriptionText: 'Memória DDR5 6000MHz CL36 de altíssima performance e iluminação RGB customizável.',
      sku: 'RTX-RAM-TZ5R32G',
      barcode: '7891000320015',
      costPrice: '780.00',
      brand: 'G.SKILL',
      status: 'ACTIVE',
      weight: '150',
      dimensions: '13.5 x 4.4 x 0.8 cm',
      warranty: 'Garantia Vitalícia'
    }),
    stock: 24
  },
  {
    name: 'Kingston FURY Beast RGB 16GB',
    category: 'Memória RAM',
    price: 549.99,
    image: '/images/kingston_fury_beast.png',
    description: JSON.stringify({
      descriptionText: 'Módulo individual de 16GB DDR5 5600MHz de alta estabilidade e refrigeração aprimorada.',
      sku: 'RTX-RAM-KFB16G',
      barcode: '7891000160019',
      costPrice: '380.00',
      brand: 'Kingston',
      status: 'ACTIVE',
      weight: '100',
      dimensions: '13.3 x 3.4 x 0.7 cm',
      warranty: 'Garantia Vitalícia'
    }),
    stock: 45
  },

  // Placa Mãe (2 products)
  {
    name: 'ASUS ROG Strix Z790-E',
    category: 'Placa Mãe',
    price: 3479.99,
    image: '/images/asus_rog_z790.png',
    description: JSON.stringify({
      descriptionText: 'Placa-mãe premium LGA 1700 com suporte a PCIe 5.0, WiFi 6E e robusto sistema de VRM de 18+1 fases.',
      sku: 'RTX-MB-Z790E',
      barcode: '7891000790123',
      costPrice: '2400.00',
      brand: 'ASUS',
      status: 'ACTIVE',
      weight: '1800',
      dimensions: '30.5 x 24.4 cm (ATX)',
      warranty: '36 meses'
    }),
    stock: 10
  },
  {
    name: 'Gigabyte X670E AORUS Master',
    category: 'Placa Mãe',
    price: 3199.99,
    image: '/images/gigabyte_x670e.png',
    description: JSON.stringify({
      descriptionText: 'Placa-mãe AM5 topo de linha projetada para overclocks extremos e suporte a múltiplos SSDs PCIe Gen5.',
      sku: 'RTX-MB-X670EA',
      barcode: '7891000670014',
      costPrice: '2250.00',
      brand: 'Gigabyte',
      status: 'ACTIVE',
      weight: '1900',
      dimensions: '30.5 x 24.4 cm (ATX)',
      warranty: '36 meses'
    }),
    stock: 8
  },

  // Armazenamento (2 products)
  {
    name: 'Samsung 990 PRO 2TB NVMe',
    category: 'Armazenamento',
    price: 1399.99,
    image: '/images/samsung_990pro.png',
    description: JSON.stringify({
      descriptionText: 'SSD NVMe PCIe 4.0 mais rápido da categoria, com taxas de leitura sequencial de até 7450 MB/s.',
      sku: 'RTX-SSD-990P2T',
      barcode: '7891000990026',
      costPrice: '900.00',
      brand: 'Samsung',
      status: 'ACTIVE',
      weight: '9',
      dimensions: '8.0 x 2.2 x 0.23 cm',
      warranty: '60 meses'
    }),
    stock: 35
  },
  {
    name: 'WD Black SN850X 1TB NVMe',
    category: 'Armazenamento',
    price: 799.99,
    image: '/images/ssd.jpg',
    description: JSON.stringify({
      descriptionText: 'SSD ideal para o PlayStation 5 e PCs entusiastas, com dissipador integrado e velocidades ultra rápidas.',
      sku: 'RTX-SSD-SN850X1T',
      barcode: '7891000850013',
      costPrice: '520.00',
      brand: 'Western Digital',
      status: 'ACTIVE',
      weight: '15',
      dimensions: '8.0 x 2.2 x 0.8 cm',
      warranty: '60 meses'
    }),
    stock: 25
  },

  // Fontes (2 products)
  {
    name: 'Corsair RM1000x 1000W',
    category: 'Fonte',
    price: 1299.99,
    image: '/images/psu.jpg',
    description: JSON.stringify({
      descriptionText: 'Fonte modular ATX com certificação 80 Plus Gold, ventoinha de levitação magnética e capacitores japoneses.',
      sku: 'RTX-PSU-RM1000X',
      barcode: '7891000100030',
      costPrice: '910.00',
      brand: 'Corsair',
      status: 'ACTIVE',
      weight: '2000',
      dimensions: '15.0 x 16.0 x 8.6 cm',
      warranty: '120 meses'
    }),
    stock: 18
  },
  {
    name: 'ASUS ROG Thor 1200W',
    category: 'Fonte',
    price: 2499.99,
    image: '/images/psu.jpg',
    description: JSON.stringify({
      descriptionText: 'Fonte de alimentação premium com painel OLED integrado para exibição de potência e certificação 80 Plus Platinum.',
      sku: 'RTX-PSU-THOR1200',
      barcode: '7891000120014',
      costPrice: '1750.00',
      brand: 'ASUS',
      status: 'ACTIVE',
      weight: '3100',
      dimensions: '19.0 x 15.0 x 8.6 cm',
      warranty: '120 meses'
    }),
    stock: 5
  },

  // Gabinetes (2 products)
  {
    name: 'Lian Li O11 Dynamic EVO',
    category: 'Gabinete',
    price: 1199.99,
    image: '/images/case.jpg',
    description: JSON.stringify({
      descriptionText: 'Gabinete torre média modular com painéis de vidro temperado e design de fluxo de ar de câmara dupla.',
      sku: 'RTX-CASE-O11DE',
      barcode: '7891000110022',
      costPrice: '820.00',
      brand: 'Lian Li',
      status: 'ACTIVE',
      weight: '12500',
      dimensions: '46.5 x 28.5 x 45.9 cm',
      warranty: '12 meses'
    }),
    stock: 15
  },
  {
    name: 'NZXT H9 Flow Black',
    category: 'Gabinete',
    price: 1099.99,
    image: '/images/case.jpg',
    description: JSON.stringify({
      descriptionText: 'Gabinete Gamer de câmara dupla com visualização panorâmica de vidro e excelente fluxo de ar.',
      sku: 'RTX-CASE-H9FLOW',
      barcode: '7891000090013',
      costPrice: '730.00',
      brand: 'NZXT',
      status: 'ACTIVE',
      weight: '12100',
      dimensions: '49.5 x 29.0 x 46.6 cm',
      warranty: '24 meses'
    }),
    stock: 20
  },

  // Refrigeração (2 products)
  {
    name: 'NZXT Kraken Elite 360mm',
    category: 'Refrigeração',
    price: 1899.99,
    image: '/images/cooler.jpg',
    description: JSON.stringify({
      descriptionText: 'Water Cooler topo de linha com tela LCD de 2.36 polegadas integrada para exibir GIFs e temperaturas.',
      sku: 'RTX-COOL-K360E',
      barcode: '7891000360012',
      costPrice: '1300.00',
      brand: 'NZXT',
      status: 'ACTIVE',
      weight: '2100',
      dimensions: '39.4 x 12.1 x 2.7 cm (Radiador)',
      warranty: '72 meses'
    }),
    stock: 15
  },
  {
    name: 'Noctua NH-D15 Black',
    category: 'Refrigeração',
    price: 899.99,
    image: '/images/cooler.jpg',
    description: JSON.stringify({
      descriptionText: 'Refrigerador de ar de torre dupla premium de alta performance, super silencioso e confiável.',
      sku: 'RTX-COOL-NHD15B',
      barcode: '7891000150027',
      costPrice: '620.00',
      brand: 'Noctua',
      status: 'ACTIVE',
      weight: '1320',
      dimensions: '16.5 x 15.0 x 16.1 cm',
      warranty: '72 meses'
    }),
    stock: 24
  },

  // Monitor (2 products)
  {
    name: 'ASUS ROG Swift 32" OLED 4K',
    category: 'Monitor',
    price: 9499.99,
    image: '/images/monitor.png',
    description: JSON.stringify({
      descriptionText: 'Monitor gamer definitivo com painel QD-OLED 4K, taxa de atualização de 240Hz e tempo de resposta de 0.03ms.',
      sku: 'RTX-MON-ROG32',
      barcode: '7891000320499',
      costPrice: '7100.00',
      brand: 'ASUS',
      status: 'ACTIVE',
      weight: '8400',
      dimensions: '71.8 x 42.6 x 8.0 cm',
      warranty: '36 meses'
    }),
    stock: 8
  },
  {
    name: 'Samsung Odyssey G9 49"',
    category: 'Monitor',
    price: 8299.99,
    image: '/images/monitor.png',
    description: JSON.stringify({
      descriptionText: 'Monitor super ultra-wide curvo de 49 polegadas com curvatura 1000R e display QLED de 240Hz.',
      sku: 'RTX-MON-G949',
      barcode: '7891000490010',
      costPrice: '6100.00',
      brand: 'Samsung',
      status: 'ACTIVE',
      weight: '14500',
      dimensions: '114.7 x 36.3 x 29.1 cm',
      warranty: '12 meses'
    }),
    stock: 6
  },

  // Periféricos (2 products)
  {
    name: 'Razer DeathAdder V3 Pro',
    category: 'Periféricos',
    price: 899.99,
    image: '/images/peripherals.png',
    description: JSON.stringify({
      descriptionText: 'Mouse gamer sem fio ergonômico ultraleve com peso de apenas 63g e sensor óptico de 30.000 DPI.',
      sku: 'RTX-PER-DAV3P',
      barcode: '7891000530022',
      costPrice: '520.00',
      brand: 'Razer',
      status: 'ACTIVE',
      weight: '63',
      dimensions: '12.8 x 6.8 x 4.4 cm',
      warranty: '24 meses'
    }),
    stock: 23
  },
  {
    name: 'Logitech G Pro X Superlight 2',
    category: 'Periféricos',
    price: 999.99,
    image: '/images/peripherals.png',
    description: JSON.stringify({
      descriptionText: 'Mouse sem fio de nível de competição e-sports, com switches híbridos LIGHTFORCE e taxa de polling de 2000Hz.',
      sku: 'RTX-PER-GPXS2',
      barcode: '7891000500018',
      costPrice: '580.00',
      brand: 'Logitech',
      status: 'ACTIVE',
      weight: '60',
      dimensions: '12.5 x 6.35 x 4.0 cm',
      warranty: '24 meses'
    }),
    stock: 18
  },

  // Cadeiras Gamer (2 products)
  {
    name: 'Cadeira Gamer Razer Iskur X',
    category: 'Cadeira Gamer',
    price: 2499.99,
    image: '/images/chair.png',
    description: JSON.stringify({
      descriptionText: 'Cadeira gamer ergonômica projetada para suporte postural ideal e revestimento reforçado.',
      sku: 'RTX-CHR-ISKUX',
      barcode: '7891000789019',
      costPrice: '1600.00',
      brand: 'Razer',
      status: 'ACTIVE',
      weight: '22700',
      dimensions: '137.0 x 71.0 x 63.5 cm',
      warranty: '36 meses'
    }),
    stock: 10
  },
  {
    name: 'Cadeira Gamer Corsair T3 Rush',
    category: 'Cadeira Gamer',
    price: 1999.99,
    image: '/images/chair.png',
    description: JSON.stringify({
      descriptionText: 'Cadeira gamer premium inspirada no automobilismo, com tecido macio respirável e encosto reclinável de 180°.',
      sku: 'RTX-CHR-T3RSH',
      barcode: '7891000789026',
      costPrice: '1350.00',
      brand: 'Corsair',
      status: 'ACTIVE',
      weight: '21500',
      dimensions: '138.0 x 69.0 x 60.0 cm',
      warranty: '24 meses'
    }),
    stock: 12
  },

  // Acessórios (4 products)
  {
    name: 'Suporte de Headset RGB Razer Base Station V2 Chroma',
    category: 'Acessórios',
    price: 499.99,
    image: '/images/accessories.png',
    description: JSON.stringify({
      descriptionText: 'Suporte de fone de ouvido de alumínio premium com hub USB 3.1 e iluminação Razer Chroma RGB integrada.',
      sku: 'RTX-ACC-BSV2C',
      barcode: '7891000889016',
      costPrice: '310.00',
      brand: 'Razer',
      status: 'ACTIVE',
      weight: '500',
      dimensions: '27.8 x 12.0 x 12.0 cm',
      warranty: '12 meses'
    }),
    stock: 25
  },
  {
    name: 'Mousepad Gamer Corsair MM300 Extended',
    category: 'Acessórios',
    price: 199.99,
    image: '/images/accessories.png',
    description: JSON.stringify({
      descriptionText: 'Mousepad de tecido texturizado de alta resistência com bordas costuradas e base de borracha antiderrapante.',
      sku: 'RTX-ACC-MM300',
      barcode: '7891000889023',
      costPrice: '110.00',
      brand: 'Corsair',
      status: 'ACTIVE',
      weight: '540',
      dimensions: '93.0 x 30.0 x 0.3 cm',
      warranty: '12 meses'
    }),
    stock: 40
  },
  {
    name: 'Controle Xbox Wireless Carbon Black',
    category: 'Acessórios',
    price: 449.99,
    image: '/images/accessories.png',
    description: JSON.stringify({
      descriptionText: 'Controle sem fio oficial do Xbox com design moderno, empunhadura texturizada e compartilhamento instantâneo.',
      sku: 'RTX-ACC-XWCCB',
      barcode: '7891000889030',
      costPrice: '280.00',
      brand: 'Microsoft',
      status: 'ACTIVE',
      weight: '460',
      dimensions: '17.8 x 17.7 x 7.2 cm',
      warranty: '12 meses'
    }),
    stock: 15
  },
  {
    name: 'Microfone HyperX QuadCast S RGB',
    category: 'Acessórios',
    price: 999.99,
    image: '/images/accessories.png',
    description: JSON.stringify({
      descriptionText: 'Microfone condensador USB premium com efeitos de luz RGB radiantes, base antivibração e sensor de toque para silenciar.',
      sku: 'RTX-ACC-HQCS',
      barcode: '7891000889047',
      costPrice: '620.00',
      brand: 'HyperX',
      status: 'ACTIVE',
      weight: '710',
      dimensions: '25.0 x 12.0 x 10.0 cm',
      warranty: '24 meses'
    }),
    stock: 18
  }
];

async function main() {
  try {
    console.log('Seeding real products...');
    
    // Clean dependent cart, wishlist, and order items first to avoid integrity constraints
    await prisma.cartItem.deleteMany({});
    await prisma.wishlistItem.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    
    console.log('Cleared existing products, orders, cart, and wishlist items.');

    for (const p of REAL_PRODUCTS) {
      await prisma.product.create({
        data: p
      });
    }

    console.log('Database products seeded successfully with real URLs and hardware specs!');
  } catch (error) {
    console.error('Error seeding real products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
