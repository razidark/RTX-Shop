import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Clock, Globe } from 'lucide-react';

const TICKER_MESSAGES = [
  {
    pt: '⚡ ENVIO EXPRESSO E GARANTIA MÁXIMA DE 3 ANOS',
    en: '⚡ FAST EXPRESS SHIPPING AND 3-YEAR FULL WARRANTY'
  },
  {
    pt: '🔥 PARTICIPE DO NOSSO CANAL DE SETUP GAMER E PRESET LOGS',
    en: '🔥 JOIN OUR GAMING SETUP COMMUNITY FOR EXCLUSIVE REWARDS'
  },
  {
    pt: '💻 USE O CUPOM "RTX2026" PARA 10% DE DESCONTO EM TODA A LOJA',
    en: '💻 USE CODE "RTX2026" TO GET 10% OFF STOREWIDE'
  }
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [time, setTime] = useState(new Date());
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const tickerTimer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % TICKER_MESSAGES.length);
    }, 4500);
    return () => {
      clearInterval(timer);
      clearInterval(tickerTimer);
    };
  }, []);

  const formatDate = () => {
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(time);
  };

  return (
    <div className="top-header glass-panel">
      <div className="container header-container">
        {/* Left Side: Live Ticker & Clock */}
        <div className="header-left">
          <div className="clock-wrapper">
            <Clock size={14} className="clock-icon" />
            <span className="live-clock">{formatDate()}</span>
          </div>
          <span className="separator desktop-only">|</span>
          <span key={tickerIndex} className="ticker-text desktop-only ticker-fade" style={{ display: 'inline-block' }}>
            {TICKER_MESSAGES[tickerIndex][language]}
          </span>
        </div>

        {/* Right Side: Theme & Language Switchers */}
        <div className="header-right">
          {/* Language Selector */}
          <div className="language-selector">
            <Globe size={14} className="globe-icon" />
            <button 
              onClick={() => setLanguage('pt')} 
              className={`lang-btn ${language === 'pt' ? 'active' : ''}`}
            >
              PT
            </button>
            <span className="divider">/</span>
            <button 
              onClick={() => setLanguage('en')} 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
          </div>

          <span className="separator">|</span>

          {/* Theme Switcher Button */}
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn" 
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={16} className="sun-icon animate-pulse" />
            ) : (
              <Moon size={16} className="moon-icon" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
