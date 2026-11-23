import { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  ArrowRight, 
  Clock, 
  Eye, 
  Award,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // '7' or '30'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const { addToast } = useToast();
  const { language, formatPrice } = useLanguage();

  const labels = {
    title: language === 'pt' ? 'Painel de Controle' : 'Control Panel',
    subtitle: language === 'pt' ? 'Estatísticas e análise operacional em tempo real' : 'Real-time business statistics and operations',
    revenue: language === 'pt' ? 'Faturamento' : 'Total Revenue',
    growth: language === 'pt' ? 'Crescimento ativo' : 'Active Growth',
    ticket: language === 'pt' ? 'Ticket Médio' : 'Average Ticket',
    ticketDesc: language === 'pt' ? 'Por pedido fechado' : 'Per settled transaction',
    orders: language === 'pt' ? 'Total de Pedidos' : 'Total Orders',
    ordersDesc: language === 'pt' ? 'Transações registradas' : 'Registered transactions',
    customers: language === 'pt' ? 'Clientes' : 'Customers',
    customersDesc: language === 'pt' ? 'Contas de consumidores' : 'Consumer accounts',
    staff: language === 'pt' ? 'Equipe (Staff)' : 'Staff Members',
    staffDesc: language === 'pt' ? 'Admins e Funcionários' : 'Admins and Employees',
    products: language === 'pt' ? 'Produtos Ativos' : 'Active Products',
    productsDesc: language === 'pt' ? 'Itens no catálogo' : 'Items in catalog',
    trendTitle: language === 'pt' ? 'Histórico de Vendas' : 'Sales Trend History',
    live: language === 'pt' ? 'Ao Vivo' : 'Live',
    last7: language === 'pt' ? 'Últimos 7 dias' : 'Last 7 Days',
    last30: language === 'pt' ? 'Últimos 30 dias' : 'Last 30 Days',
    topSellers: language === 'pt' ? 'Mais Vendidos' : 'Top Selling Products',
    viewCatalog: language === 'pt' ? 'Ver Catálogo' : 'View Catalog',
    unitsSold: language === 'pt' ? 'unidades vendidas' : 'units sold',
    recentOrders: language === 'pt' ? 'Últimos Pedidos' : 'Recent Orders',
    manageOrders: language === 'pt' ? 'Gerenciar Pedidos' : 'Manage Orders',
    buyer: language === 'pt' ? 'Cliente' : 'Buyer',
    noSellers: language === 'pt' ? 'Nenhum produto vendido ainda.' : 'No items sold yet.',
    noOrders: language === 'pt' ? 'Nenhum pedido efetuado ainda.' : 'No orders placed yet.',
    stockAlerts: language === 'pt' ? 'Alertas de Estoque' : 'Stock Alerts',
    viewAll: language === 'pt' ? 'Ver Todos' : 'View All',
    noAlerts: language === 'pt' ? 'Nenhum produto com estoque crítico!' : 'No critical stock items!',
    stockLabel: language === 'pt' ? 'Estoque' : 'Stock',
    refillBtn: language === 'pt' ? 'Repor (+10)' : 'Refill (+10)',
  };

  const handleRefillStock = async (productId) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/refill`, {
        method: 'POST'
      });
      if (res.ok) {
        addToast(
          language === 'pt' 
            ? 'Estoque reabastecido (+10 unidades)!' 
            : 'Stock refilled (+10 units)!', 
          'success'
        );
        setStats(prev => {
          if (!prev) return prev;
          const updatedLowStock = prev.lowStockProducts.map(p => {
            if (p.id === productId) {
              return { ...p, stock: p.stock + 10 };
            }
            return p;
          }).filter(p => p.stock <= 5);
          return {
            ...prev,
            lowStockProducts: updatedLowStock
          };
        });
      } else {
        const errData = await res.json();
        addToast(
          errData.error || (language === 'pt' ? 'Erro ao reabastecer estoque.' : 'Error refilling stock.'), 
          'error'
        );
      }
    } catch (err) {
      console.error(err);
      addToast(
        language === 'pt' ? 'Erro de conexão ao reabastecer estoque.' : 'Connection error during refill.', 
        'error'
      );
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Erro ao buscar estatísticas', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', { day: '2-digit', month: '2-digit' }).format(date);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade-in">
        <div style={{ height: '3.5rem', width: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel" style={{ height: '100px', borderRadius: 'var(--radius-lg)', padding: '2rem', animation: 'pulse 1.5s infinite' }}></div>
          ))}
        </div>
        <div className="glass-panel" style={{ height: '350px', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>
          {language === 'pt' ? 'Erro ao Carregar Dashboard' : 'Error Loading Dashboard'}
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {language === 'pt' 
            ? 'Não foi possível buscar as estatísticas do servidor. Verifique a conexão com o banco de dados.' 
            : 'Could not retrieve server statistics. Verify the database connection.'}
        </p>
      </div>
    );
  }

  // Filter trend data based on selection
  const trendData = timeRange === '7' ? stats.salesTrend.slice(-7) : stats.salesTrend;

  // Chart dimension constants
  const svgWidth = 800;
  const svgHeight = 250;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Max value calculation for scaling
  const maxRevenue = Math.max(...trendData.map(d => d.revenue), 0) || 1000;

  // Generate path points
  const points = trendData.map((d, index) => {
    const x = paddingLeft + (index / (trendData.length - 1 || 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.revenue / maxRevenue) * chartHeight;
    return { x, y, date: d.date, revenue: d.revenue };
  });

  const linePath = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  // Get status color styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: 'rgba(0, 255, 136, 0.1)', color: '#00FF88', label: language === 'pt' ? 'Entregue' : 'Delivered' };
      case 'SHIPPED':
        return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: language === 'pt' ? 'Enviado' : 'Shipped' };
      case 'PROCESSING':
        return { bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', label: language === 'pt' ? 'Processando' : 'Processing' };
      case 'PENDING':
        return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', label: language === 'pt' ? 'Pendente' : 'Pending' };
      case 'CANCELLED':
        return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: language === 'pt' ? 'Cancelado' : 'Cancelled' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-main)', label: status };
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #FFF 0%, var(--text-muted) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {labels.title}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>{labels.subtitle}</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        
        {/* Total Revenue */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(0, 255, 136, 0.15) 0%, transparent 70%)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels.revenue}</span>
            <div style={{ background: 'rgba(0, 255, 136, 0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
              <DollarSign size={20} color="var(--primary-color)" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatPrice(stats.totalRevenue)}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
              <TrendingUp size={14} color="var(--primary-color)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>{labels.growth}</span>
            </div>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels.ticket}</span>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={20} color="var(--accent-color)" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{formatPrice(stats.averageTicket)}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{labels.ticketDesc}</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels.orders}</span>
            <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
              <ShoppingBag size={20} color="#a855f7" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.totalOrders}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{labels.ordersDesc}</span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels.customers}</span>
            <div style={{ background: 'rgba(236, 72, 153, 0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
              <Users size={20} color="#ec4899" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.totalUsers}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{labels.customersDesc}</span>
          </div>
        </div>

        {/* Staff Members */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels.staff}</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
              <Shield size={20} color="#f59e0b" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.staffCount}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{labels.staffDesc}</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{labels.products}</span>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
              <Package size={20} color="#06b6d4" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.totalProducts}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{labels.productsDesc}</span>
          </div>
        </div>

      </div>

      {/* Sales Trend Chart Section */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        
        {/* Chart Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{labels.trendTitle}</h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(0, 255, 136, 0.1)', color: 'var(--primary-color)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              {labels.live}
            </span>
          </div>
          
          {/* Time range selectors */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setTimeRange('7')}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: timeRange === '7' ? '#000' : 'var(--text-muted)',
                background: timeRange === '7' ? 'var(--primary-color)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {labels.last7}
            </button>
            <button 
              onClick={() => setTimeRange('30')}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: timeRange === '30' ? '#000' : 'var(--text-muted)',
                background: timeRange === '30' ? 'var(--primary-color)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              {labels.last30}
            </button>
          </div>
        </div>

        {/* SVG Sales Trend Chart */}
        <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            style={{ width: '100%', minWidth: '700px', display: 'block' }}
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent-color)" />
                <stop offset="100%" stopColor="var(--primary-color)" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = paddingTop + chartHeight * ratio;
              const value = maxRevenue * (1 - ratio);
              return (
                <g key={index}>
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={svgWidth - paddingRight} 
                    y2={y} 
                    stroke="rgba(255,255,255,0.04)" 
                    strokeDasharray="4,4" 
                  />
                  <text 
                    x={paddingLeft - 10} 
                    y={y + 4} 
                    fill="var(--text-muted)" 
                    fontSize="10px" 
                    textAnchor="end"
                    fontFamily="var(--font-body)"
                  >
                    {formatPrice(value).replace(/,00$/, '')}
                  </text>
                </g>
              );
            })}

            {/* Area under the line */}
            {points.length > 0 && (
              <path 
                d={areaPath} 
                fill="url(#chartGradient)" 
              />
            )}

            {/* Line Path */}
            {points.length > 0 && (
              <path 
                d={linePath} 
                fill="none" 
                stroke="url(#strokeGradient)" 
                strokeWidth="3.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 255, 136, 0.2))'
                }}
              />
            )}

            {/* Dynamic Hover Dots */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={hoveredPoint && hoveredPoint.index === i ? 7 : 4}
                fill={hoveredPoint && hoveredPoint.index === i ? 'var(--primary-color)' : 'var(--accent-color)'}
                stroke="#05050A"
                strokeWidth={2}
                style={{ transition: 'all 0.15s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint({ ...p, index: i })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}

            {/* Date Labels on X axis */}
            {points.filter((_, idx) => {
              // Conditionally display labels to avoid overlap
              if (timeRange === '7') return true;
              return idx % 4 === 0 || idx === points.length - 1;
            }).map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={svgHeight - 12}
                fill="var(--text-muted)"
                fontSize="10px"
                textAnchor="middle"
                fontFamily="var(--font-body)"
              >
                {formatDate(p.date)}
              </text>
            ))}
          </svg>

          {/* Interactive Tooltip Box */}
          {hoveredPoint && (
            <div style={{
              position: 'absolute',
              left: `${(hoveredPoint.x / svgWidth) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100 - 20}%`,
              transform: 'translate(-50%, -100%)',
              background: 'rgba(10, 15, 25, 0.95)',
              border: '1px solid var(--primary-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 0.75rem',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: 'var(--shadow-glow)',
              textAlign: 'center',
              fontSize: '0.8rem',
              transition: 'left 0.1s ease, top 0.1s ease',
              whiteSpace: 'nowrap'
            }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600 }}>{hoveredPoint.date}</div>
              <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.1rem' }}>{formatPrice(hoveredPoint.revenue)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Top Products */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--primary-color)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{labels.topSellers}</h3>
            </div>
            <Link to="/admin/produtos" style={{ fontSize: '0.875rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              {labels.viewCatalog} <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {stats.topProducts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                {labels.noSellers}
              </div>
            ) : (
              stats.topProducts.map((product, idx) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: idx !== stats.topProducts.length - 1 ? '1.25rem' : '0', borderBottom: idx !== stats.topProducts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                      />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-main)', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>{product.quantity} {labels.unitsSold}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{formatPrice(product.totalSales)}</div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{labels.revenue}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--accent-color)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{labels.recentOrders}</h3>
            </div>
            <Link to="/admin/pedidos" style={{ fontSize: '0.875rem', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              {labels.manageOrders} <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.recentOrders.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                {labels.noOrders}
              </div>
            ) : (
              stats.recentOrders.map((order, idx) => {
                const statusStyle = getStatusStyle(order.status);
                return (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: idx !== stats.recentOrders.length - 1 ? '1rem' : '0', borderBottom: idx !== stats.recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{order.user?.name || labels.buyer}</span>
                        <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '0.1rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '10px' }}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDateTime(order.createdAt)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{formatPrice(order.total)}</span>
                      <Link to="/admin/pedidos" className="btn btn-outline btn-sm" style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', minWidth: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Eye size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{labels.stockAlerts}</h3>
            </div>
            <Link to="/admin/produtos" style={{ fontSize: '0.875rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              {labels.viewAll} <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!stats.lowStockProducts || stats.lowStockProducts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                {labels.noAlerts}
              </div>
            ) : (
              stats.lowStockProducts.map((product, idx) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: idx !== stats.lowStockProducts.length - 1 ? '1rem' : '0', borderBottom: idx !== stats.lowStockProducts.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.target.src = '/images/placeholder.png'; }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '120px' }} title={product.name}>
                        {product.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>{labels.stockLabel}: {product.stock} un</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRefillStock(product.id)}
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: 'auto' }}
                  >
                    <Plus size={12} /> {labels.refillBtn}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
