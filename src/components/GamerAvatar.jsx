import { AVATAR_PRESETS, DEFAULT_AVATAR } from '../constants/avatars';
import { useTheme } from '../context/ThemeContext';

export default function GamerAvatar({ avatar, size = 40, className = '' }) {
  const { isDarkMode } = useTheme();

  const customStyles = {
    width: `${size}px`,
    height: `${size}px`,
    minWidth: `${size}px`,
    minHeight: `${size}px`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
    background: isDarkMode
      ? 'radial-gradient(circle, rgba(15, 23, 42, 0.6) 0%, rgba(5, 5, 10, 0.8) 100%)'
      : 'radial-gradient(circle, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.9) 100%)',
    boxShadow: isDarkMode
      ? `0 0 ${Math.max(size * 0.12, 4)}px rgba(0, 255, 136, 0.15), inset 0 0 ${Math.max(size * 0.08, 2)}px rgba(0, 255, 136, 0.05)`
      : `0 2px ${Math.max(size * 0.1, 4)}px rgba(0, 0, 0, 0.1), 0 0 ${Math.max(size * 0.06, 2)}px rgba(0, 255, 136, 0.1)`,
    border: isDarkMode
      ? '2px solid rgba(0, 255, 136, 0.12)'
      : '2px solid rgba(0, 200, 100, 0.15)',
    transition: 'all 0.3s ease'
  };

  if (!avatar) {
    return (
      <div style={customStyles} className={`gamer-avatar ${className}`}>
        {DEFAULT_AVATAR}
      </div>
    );
  }

  if (avatar.startsWith('preset:') && AVATAR_PRESETS[avatar]) {
    return (
      <div style={customStyles} className={`gamer-avatar ${className}`}>
        {AVATAR_PRESETS[avatar]}
      </div>
    );
  }

  // Fallback to URL
  return (
    <div style={customStyles} className={`gamer-avatar ${className}`}>
      <img
        src={avatar}
        alt="Avatar"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentNode.innerHTML = `<svg viewBox="0 0 64 64" fill="none" class="gamer-avatar-svg"><defs><linearGradient id="err-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stop-color="#1a0a1e"/><stop offset="100%" stop-color="#2d0a2e"/></linearGradient></defs><rect width="64" height="64" rx="32" fill="url(#err-bg)"/><circle cx="32" cy="24" r="9" stroke="#ff2a5f" stroke-width="1.5" fill="none"/><path d="M16 48C16 40 23 34 32 34C41 34 48 40 48 48" stroke="#ff2a5f" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`;
        }}
      />
    </div>
  );
}
