import { Cpu, CircuitBoard, MemoryStick, MonitorPlay, HardDrive, Zap, Box, Fan, Monitor, Mouse, Armchair, Gamepad2 } from 'lucide-react';

export default function CategoryIcon({ category, size = 16, className = '', style = {} }) {
  const normalizedCategory = category ? category.trim() : '';

  switch (normalizedCategory) {
    case 'Processador':
      return <Cpu size={size} className={className} style={{ color: '#00ff88', ...style }} />;
    case 'Placa Mãe':
      return <CircuitBoard size={size} className={className} style={{ color: '#00ccff', ...style }} />;
    case 'Memória RAM':
      return <MemoryStick size={size} className={className} style={{ color: '#9d4edd', ...style }} />;
    case 'Placa de Vídeo':
      return <MonitorPlay size={size} className={className} style={{ color: '#ff2a5f', ...style }} />;
    case 'Armazenamento':
      return <HardDrive size={size} className={className} style={{ color: '#00f5d4', ...style }} />;
    case 'Fonte':
      return <Zap size={size} className={className} style={{ color: '#fb8500', ...style }} />;
    case 'Gabinete':
      return <Box size={size} className={className} style={{ color: '#ffb703', ...style }} />;
    case 'Refrigeração':
      return <Fan size={size} className={className} style={{ color: '#00e5ff', ...style }} />;
    case 'Monitor':
      return <Monitor size={size} className={className} style={{ color: '#3b82f6', ...style }} />;
    case 'Periféricos':
      return <Mouse size={size} className={className} style={{ color: '#ff007f', ...style }} />;
    case 'Cadeira Gamer':
      return <Armchair size={size} className={className} style={{ color: '#e0aaff', ...style }} />;
    case 'Acessórios':
      return <Gamepad2 size={size} className={className} style={{ color: '#ccff33', ...style }} />;
    default:
      return <Cpu size={size} className={className} style={style} />;
  }
}
