import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container animate-fade-in" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ maxWidth: '500px', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,0,0,0.3)', boxShadow: '0 0 30px rgba(255,0,0,0.1)' }}>
        <AlertTriangle size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.5))' }} />
        
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff4444' }}>GARGALO 404</h1>
        
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Módulo em Desenvolvimento</h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
          O recurso que você tentou acessar está temporariamente fora de serviço ou ainda está sendo construído pela nossa equipe de engenharia cibernética.
        </p>
        
        <Link to="/" className="btn btn-primary btn-cyber">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
