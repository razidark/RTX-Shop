import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="auth-card glass-panel">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem' }} className="text-gradient">{t('registerTitle')}</h1>
        
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{t('registerName')}</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{t('registerEmail')}</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{t('registerPassword')}</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', outline: 'none' }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-cyber" disabled={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
            {isLoading ? (t('registerSubmit') === 'Cadastrar' ? 'Criando conta...' : 'Creating account...') : t('registerSubmit')}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          {t('registerHaveAccount')} <Link to="/login" style={{ color: 'var(--primary-color)' }}>{t('registerLoginLink')}</Link>
        </p>
      </div>
    </div>
  );
}
