import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-highlight">RTX</span> Shop
            </Link>
            <p style={{ marginTop: '1.5rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              {t('footerDesc')}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%', transition: 'all 0.3s ease' }} className="social-icon"><FaFacebook size={20} /></a>
              <a href="#" style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%', transition: 'all 0.3s ease' }} className="social-icon"><FaTwitter size={20} /></a>
              <a href="#" style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%', transition: 'all 0.3s ease' }} className="social-icon"><FaInstagram size={20} /></a>
              <a href="#" style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%', transition: 'all 0.3s ease' }} className="social-icon"><FaYoutube size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>{t('footerCompany')}</h4>
              <Link to="/sobre">{t('footerAbout')}</Link>
              <Link to="/carreiras">{t('footerCareers')}</Link>
              <Link to="/imprensa">{t('footerPress')}</Link>
              <Link to="/afiliados">{t('footerAffiliates')}</Link>
            </div>
            
            <div className="link-group">
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>{t('footerSupport')}</h4>
              <Link to="/faq">{t('footerFaq')}</Link>
              <Link to="/envio">{t('footerShipping')}</Link>
              <Link to="/devolucoes">{t('footerReturns')}</Link>
              <Link to="/garantia">{t('footerWarranty')}</Link>
            </div>
            
            <div className="link-group">
              <h4 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>{t('footerContact')}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <Mail size={18} color="var(--primary-color)" /> suporte@rtxshop.com.br
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <Phone size={18} color="var(--primary-color)" /> (11) 4002-8922
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-muted)' }}>
                <MapPin size={18} color="var(--primary-color)" style={{ flexShrink: 0, marginTop: '4px' }} /> Av. Paulista, 1578 - Bela Vista<br/>São Paulo, SP
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} RTX Shop. {t('footerRights')}</p>
          
          {/* Payment Badges */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('checkoutPaymentMethod') || 'Pagamento'}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {/* PIX */}
              <div className="payment-badge pix" title="PIX" style={{ height: '28px', width: '48px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <svg viewBox="0 0 512 512" fill="none" style={{ height: '100%', width: '100%', color: '#32BCAD' }}>
                  <path d="M110.2 256L256 110.2L401.8 256L256 401.8L110.2 256Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M256 46.2L46.2 256L256 465.8L465.8 256L256 46.2ZM256 0L512 256L256 512L0 256L256 0Z" fill="currentColor"/>
                </svg>
              </div>
              {/* Visa */}
              <div className="payment-badge visa" title="Visa" style={{ height: '28px', width: '48px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <svg viewBox="0 0 48 16" fill="none" style={{ height: '100%', width: '100%', color: 'var(--text-main)' }}>
                  <path d="M18.2 1.2l-3.2 10.4h-2.5L10 3.7c-.2-.7-.7-1.1-1.3-1.4L6.1 1.2h6.1c.6 0 1.1.4 1.2 1l1.4 7.4 3.1-9.4h2.5L18.2 1.2zm14 0l-2 10.4h-2.4L29.8 1.2h2.4zm10.7 0c-1.1 0-2 .6-2.4 1.6l-3.8 8.8h2.5l.5-1.4h3.1l.3 1.4h2.2l-1.9-10.4h-.5zm-3 6.9l1.1-3 1.3 3h-2.4zm-19.4-6.9H16L12.5 10c-.1.3-.4.5-.7.5H9.6c-.2 0-.3-.1-.4-.2l.1-.6 2.5-6.7c.2-.6.7-1 1.3-1h5.8v.1z" fill="currentColor"/>
                </svg>
              </div>
              {/* Mastercard */}
              <div className="payment-badge mastercard" title="Mastercard" style={{ height: '28px', width: '48px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <svg viewBox="0 0 32 20" fill="none" style={{ height: '100%', width: '100%' }}>
                  <circle cx="10" cy="10" r="10" fill="#EB001B"/>
                  <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.85"/>
                  <path d="M16 10a9.96 9.96 0 012.37-6.52A9.97 9.97 0 0010 0a10 10 0 000 20c2.47 0 4.72-.9 6.48-2.39A9.98 9.98 0 0116 10z" fill="#FF5F00"/>
                </svg>
              </div>
              {/* Bitcoin */}
              <div className="payment-badge bitcoin" title="Bitcoin" style={{ height: '28px', width: '48px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '2px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                <svg viewBox="0 0 20 20" fill="none" style={{ height: '18px', width: '18px' }}>
                  <circle cx="10" cy="10" r="10" fill="#F7931A"/>
                  <path d="M13.6 7.4c.2-1.3-.8-2-2.1-2.5l.4-1.7h-1l-.4 1.7c-.3-.1-.5-.1-.8-.1l.4-1.7h-1l-.4 1.7c-.2 0-.4 0-.6-.1L7.7 3v4.6l-1 .2v.9l1-.2c.3 1.2.7 2.1 2.2 2.1.6 0 1.2-.2 1.6-.6.3.6.8 1 1.7 1 1.4 0 2.4-1.1 2.4-2.8 0-1.1-.6-1.9-1.5-2.2zM9.5 7h1.6c.4 0 .7.2.7.6 0 .4-.3.6-.7.6H9.5V7zm2 3H9.5V8.6h2c.4 0 .7.2.7.7 0 .5-.3.7-.7.7z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/termos" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('footerTerms')}</Link>
            <Link to="/privacidade" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t('footerPrivacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
