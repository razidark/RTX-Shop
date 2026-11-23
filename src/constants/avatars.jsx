export const AVATAR_PRESETS = {
  'preset:cyber-samurai': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="cs-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#1a0533"/><stop offset="100%" stopColor="#0d1b2a"/></linearGradient>
        <linearGradient id="cs-accent" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#ff00ff"/><stop offset="100%" stopColor="#00ffff"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#cs-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="url(#cs-accent)" strokeWidth="1.5" opacity="0.5"/>
      {/* Helmet */}
      <path d="M18 28C18 20 24 14 32 14C40 14 46 20 46 28V34C46 36 44 38 42 38H22C20 38 18 36 18 34V28Z" fill="#2d1459" stroke="#ff00ff" strokeWidth="1.5"/>
      {/* Visor */}
      <path d="M20 26H44V32H20V26Z" fill="#0a0a2e" stroke="#00ffff" strokeWidth="1"/>
      <line x1="22" y1="29" x2="42" y2="29" stroke="#00ffff" strokeWidth="0.5" opacity="0.8"/>
      {/* Eyes */}
      <rect x="24" y="27" width="6" height="3" rx="1" fill="#ff00ff" opacity="0.9"/>
      <rect x="34" y="27" width="6" height="3" rx="1" fill="#00ffff" opacity="0.9"/>
      {/* Jaw guard */}
      <path d="M24 38V44C24 46 28 48 32 48C36 48 40 46 40 44V38" stroke="#ff00ff" strokeWidth="1.5" fill="none"/>
      <line x1="32" y1="38" x2="32" y2="46" stroke="#9d4edd" strokeWidth="1" opacity="0.6"/>
      {/* Antenna */}
      <line x1="32" y1="14" x2="32" y2="8" stroke="#00ffff" strokeWidth="1.5"/>
      <circle cx="32" cy="7" r="2" fill="#00ffff" opacity="0.8"/>
    </svg>
  ),
  'preset:neon-fox': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="nf-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#1a0a00"/><stop offset="100%" stopColor="#2d1200"/></linearGradient>
        <linearGradient id="nf-fur" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#ff6b00"/><stop offset="100%" stopColor="#ffb347"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#nf-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#ff6b00" strokeWidth="1" opacity="0.3"/>
      {/* Ears */}
      <path d="M16 18L22 30L12 28Z" fill="#ff6b00" stroke="#ffb347" strokeWidth="1"/>
      <path d="M48 18L42 30L52 28Z" fill="#ff6b00" stroke="#ffb347" strokeWidth="1"/>
      <path d="M18 20L22 28L14 27Z" fill="#ff8c42" opacity="0.6"/>
      <path d="M46 20L42 28L50 27Z" fill="#ff8c42" opacity="0.6"/>
      {/* Head */}
      <ellipse cx="32" cy="34" rx="16" ry="15" fill="#ff6b00" stroke="#ffb347" strokeWidth="1"/>
      {/* Inner face */}
      <ellipse cx="32" cy="37" rx="10" ry="10" fill="#ffe0b2" opacity="0.3"/>
      {/* Eyes */}
      <ellipse cx="26" cy="31" rx="3.5" ry="4" fill="#0a0a2e"/>
      <ellipse cx="38" cy="31" rx="3.5" ry="4" fill="#0a0a2e"/>
      <ellipse cx="26.5" cy="30.5" rx="1.5" ry="2" fill="#7cff00"/>
      <ellipse cx="38.5" cy="30.5" rx="1.5" ry="2" fill="#7cff00"/>
      <circle cx="27.5" cy="29.5" r="0.7" fill="white" opacity="0.9"/>
      <circle cx="39.5" cy="29.5" r="0.7" fill="white" opacity="0.9"/>
      {/* Nose */}
      <ellipse cx="32" cy="37" rx="2.5" ry="1.5" fill="#2d1200"/>
      {/* Mouth */}
      <path d="M30 39C30 41 32 42 32 42C32 42 34 41 34 39" stroke="#2d1200" strokeWidth="1" fill="none"/>
      {/* Whiskers */}
      <line x1="14" y1="34" x2="23" y2="36" stroke="#ffb347" strokeWidth="0.8" opacity="0.7"/>
      <line x1="14" y1="38" x2="23" y2="38" stroke="#ffb347" strokeWidth="0.8" opacity="0.7"/>
      <line x1="50" y1="34" x2="41" y2="36" stroke="#ffb347" strokeWidth="0.8" opacity="0.7"/>
      <line x1="50" y1="38" x2="41" y2="38" stroke="#ffb347" strokeWidth="0.8" opacity="0.7"/>
    </svg>
  ),
  'preset:phantom': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="ph-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#0d0d1a"/><stop offset="100%" stopColor="#1a1a33"/></linearGradient>
        <linearGradient id="ph-glow" x1="0" y1="0" x2="0" y2="64"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#ph-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="url(#ph-glow)" strokeWidth="1.5" opacity="0.4"/>
      {/* Hood */}
      <path d="M14 36C14 22 22 12 32 12C42 12 50 22 50 36L46 42H18L14 36Z" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5"/>
      {/* Hood inner shadow */}
      <path d="M18 34C18 24 24 16 32 16C40 16 46 24 46 34L44 38H20L18 34Z" fill="#0f0e2e" opacity="0.7"/>
      {/* Eyes - glowing */}
      <ellipse cx="26" cy="30" rx="4" ry="2.5" fill="#818cf8"/>
      <ellipse cx="38" cy="30" rx="4" ry="2.5" fill="#818cf8"/>
      <ellipse cx="26" cy="30" rx="2.5" ry="1.5" fill="#c4b5fd"/>
      <ellipse cx="38" cy="30" rx="2.5" ry="1.5" fill="#c4b5fd"/>
      <ellipse cx="26" cy="30" rx="1" ry="0.6" fill="white"/>
      <ellipse cx="38" cy="30" rx="1" ry="0.6" fill="white"/>
      {/* Mouth mask */}
      <path d="M24 36H40V42C40 46 36 50 32 50C28 50 24 46 24 42V36Z" fill="#2e1065" stroke="#a855f7" strokeWidth="1"/>
      {/* Mask lines */}
      <line x1="28" y1="38" x2="28" y2="44" stroke="#7c3aed" strokeWidth="0.8" opacity="0.5"/>
      <line x1="32" y1="36" x2="32" y2="46" stroke="#7c3aed" strokeWidth="0.8" opacity="0.5"/>
      <line x1="36" y1="38" x2="36" y2="44" stroke="#7c3aed" strokeWidth="0.8" opacity="0.5"/>
    </svg>
  ),
  'preset:dragon': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="dr-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#1a0000"/><stop offset="100%" stopColor="#2d0a0a"/></linearGradient>
        <linearGradient id="dr-scale" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#f97316"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#dr-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#ef4444" strokeWidth="1" opacity="0.3"/>
      {/* Horns */}
      <path d="M20 22L16 10L24 20Z" fill="#f97316" stroke="#fbbf24" strokeWidth="0.8"/>
      <path d="M44 22L48 10L40 20Z" fill="#f97316" stroke="#fbbf24" strokeWidth="0.8"/>
      {/* Head */}
      <path d="M18 30C18 22 24 16 32 16C40 16 46 22 46 30V38C46 44 40 48 32 48C24 48 18 44 18 38V30Z" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5"/>
      {/* Scale pattern */}
      <path d="M24 24C26 22 30 22 32 24C34 22 38 22 40 24" stroke="#fbbf24" strokeWidth="0.8" opacity="0.4" fill="none"/>
      <path d="M22 28C24 26 28 26 32 28C36 26 40 26 42 28" stroke="#fbbf24" strokeWidth="0.8" opacity="0.3" fill="none"/>
      {/* Eyes */}
      <ellipse cx="26" cy="30" rx="4" ry="3.5" fill="#0a0a00"/>
      <ellipse cx="38" cy="30" rx="4" ry="3.5" fill="#0a0a00"/>
      <ellipse cx="26" cy="30" rx="2" ry="3" fill="#fbbf24"/>
      <ellipse cx="38" cy="30" rx="2" ry="3" fill="#fbbf24"/>
      <ellipse cx="26" cy="29" rx="0.8" ry="1" fill="white" opacity="0.7"/>
      <ellipse cx="38" cy="29" rx="0.8" ry="1" fill="white" opacity="0.7"/>
      {/* Nostrils */}
      <circle cx="29" cy="38" r="1.5" fill="#450a0a"/>
      <circle cx="35" cy="38" r="1.5" fill="#450a0a"/>
      {/* Jaw */}
      <path d="M24 42L28 44L32 42L36 44L40 42" stroke="#ef4444" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  'preset:arctic-wolf': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="aw-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#0c1929"/><stop offset="100%" stopColor="#1e3a5f"/></linearGradient>
        <linearGradient id="aw-fur" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#e2e8f0"/><stop offset="100%" stopColor="#94a3b8"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#aw-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#38bdf8" strokeWidth="1" opacity="0.3"/>
      {/* Ears */}
      <path d="M16 20L22 32L12 30Z" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1"/>
      <path d="M48 20L42 32L52 30Z" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1"/>
      <path d="M17 22L21 30L14 29Z" fill="#f8fafc" opacity="0.5"/>
      <path d="M47 22L43 30L50 29Z" fill="#f8fafc" opacity="0.5"/>
      {/* Head */}
      <ellipse cx="32" cy="34" rx="16" ry="15" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1"/>
      {/* Face markings */}
      <path d="M32 22L26 34H38Z" fill="#f1f5f9" opacity="0.5"/>
      {/* Eyes */}
      <ellipse cx="26" cy="31" rx="3" ry="3.5" fill="#0f172a"/>
      <ellipse cx="38" cy="31" rx="3" ry="3.5" fill="#0f172a"/>
      <ellipse cx="26.5" cy="30.5" rx="1.5" ry="2" fill="#38bdf8"/>
      <ellipse cx="38.5" cy="30.5" rx="1.5" ry="2" fill="#38bdf8"/>
      <circle cx="27" cy="29.5" r="0.7" fill="white"/>
      <circle cx="39" cy="29.5" r="0.7" fill="white"/>
      {/* Nose */}
      <ellipse cx="32" cy="37" rx="2.5" ry="2" fill="#334155"/>
      {/* Mouth */}
      <path d="M30 39.5C30 41 32 42 32 42C32 42 34 41 34 39.5" stroke="#475569" strokeWidth="0.8" fill="none"/>
      {/* Chin fur */}
      <ellipse cx="32" cy="44" rx="6" ry="4" fill="#f1f5f9" opacity="0.4"/>
    </svg>
  ),
  'preset:neon-skull': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="ns-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#0f0a1a"/><stop offset="100%" stopColor="#1a0a20"/></linearGradient>
        <linearGradient id="ns-glow" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#ff007f"/><stop offset="100%" stopColor="#ff00ff"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#ns-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="url(#ns-glow)" strokeWidth="1.5" opacity="0.4"/>
      {/* Skull */}
      <path d="M20 30C20 20 25 14 32 14C39 14 44 20 44 30C44 38 40 42 40 44H24C24 42 20 38 20 30Z" fill="#1e0a2e" stroke="#ff007f" strokeWidth="1.5"/>
      {/* Forehead detail */}
      <path d="M26 18C28 16 36 16 38 18" stroke="#ff00ff" strokeWidth="0.8" opacity="0.5" fill="none"/>
      {/* Eye sockets */}
      <ellipse cx="27" cy="28" rx="5" ry="5" fill="#0a0a1a" stroke="#ff007f" strokeWidth="1"/>
      <ellipse cx="37" cy="28" rx="5" ry="5" fill="#0a0a1a" stroke="#ff007f" strokeWidth="1"/>
      {/* Glowing pupils */}
      <circle cx="27" cy="28" r="2.5" fill="#ff007f" opacity="0.9"/>
      <circle cx="37" cy="28" r="2.5" fill="#ff00ff" opacity="0.9"/>
      <circle cx="27" cy="27" r="1" fill="white" opacity="0.6"/>
      <circle cx="37" cy="27" r="1" fill="white" opacity="0.6"/>
      {/* Nose */}
      <path d="M30 34L32 36L34 34" stroke="#ff007f" strokeWidth="1.2" fill="none"/>
      {/* Teeth */}
      <path d="M26 40H38" stroke="#ff007f" strokeWidth="1"/>
      <line x1="28" y1="38" x2="28" y2="42" stroke="#ff007f" strokeWidth="0.8"/>
      <line x1="30" y1="38" x2="30" y2="43" stroke="#ff007f" strokeWidth="0.8"/>
      <line x1="32" y1="38" x2="32" y2="42" stroke="#ff007f" strokeWidth="0.8"/>
      <line x1="34" y1="38" x2="34" y2="43" stroke="#ff007f" strokeWidth="0.8"/>
      <line x1="36" y1="38" x2="36" y2="42" stroke="#ff007f" strokeWidth="0.8"/>
      {/* Jaw */}
      <path d="M24 44L26 48H38L40 44" stroke="#ff007f" strokeWidth="1.2" fill="none"/>
    </svg>
  ),
  'preset:mech-warrior': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="mw-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#0a1a0a"/><stop offset="100%" stopColor="#0d2818"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#mw-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#00ff88" strokeWidth="1" opacity="0.3"/>
      {/* Helmet */}
      <path d="M16 30C16 20 23 12 32 12C41 12 48 20 48 30V36C48 38 46 40 44 40H20C18 40 16 38 16 36V30Z" fill="#14532d" stroke="#22c55e" strokeWidth="1.5"/>
      {/* Visor */}
      <rect x="18" y="24" width="28" height="10" rx="2" fill="#052e16" stroke="#4ade80" strokeWidth="1"/>
      {/* HUD lines */}
      <line x1="20" y1="27" x2="44" y2="27" stroke="#22c55e" strokeWidth="0.4" opacity="0.6"/>
      <line x1="20" y1="30" x2="44" y2="30" stroke="#22c55e" strokeWidth="0.4" opacity="0.4"/>
      {/* Eyes */}
      <rect x="22" y="26" width="8" height="4" rx="1" fill="#00ff88" opacity="0.85"/>
      <rect x="34" y="26" width="8" height="4" rx="1" fill="#00ff88" opacity="0.85"/>
      {/* Chin plate */}
      <path d="M22 40V46C22 48 26 50 32 50C38 50 42 48 42 46V40" fill="#14532d" stroke="#22c55e" strokeWidth="1"/>
      {/* Vent lines */}
      <line x1="26" y1="42" x2="26" y2="48" stroke="#166534" strokeWidth="1.5"/>
      <line x1="30" y1="42" x2="30" y2="48" stroke="#166534" strokeWidth="1.5"/>
      <line x1="34" y1="42" x2="34" y2="48" stroke="#166534" strokeWidth="1.5"/>
      <line x1="38" y1="42" x2="38" y2="48" stroke="#166534" strokeWidth="1.5"/>
      {/* Ear modules */}
      <rect x="12" y="26" width="4" height="8" rx="1" fill="#166534" stroke="#22c55e" strokeWidth="0.8"/>
      <rect x="48" y="26" width="4" height="8" rx="1" fill="#166534" stroke="#22c55e" strokeWidth="0.8"/>
    </svg>
  ),
  'preset:pixel-cat': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="pc-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#1a0a2e"/><stop offset="100%" stopColor="#2e0a3e"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#pc-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#e879f9" strokeWidth="1" opacity="0.3"/>
      {/* Ears */}
      <path d="M16 20L20 32L12 28Z" fill="#d946ef" stroke="#f0abfc" strokeWidth="1"/>
      <path d="M48 20L44 32L52 28Z" fill="#d946ef" stroke="#f0abfc" strokeWidth="1"/>
      <path d="M17 22L20 30L14 27Z" fill="#f0abfc" opacity="0.4"/>
      <path d="M47 22L44 30L50 27Z" fill="#f0abfc" opacity="0.4"/>
      {/* Head */}
      <ellipse cx="32" cy="35" rx="16" ry="14" fill="#d946ef" stroke="#f0abfc" strokeWidth="1"/>
      {/* Face */}
      <ellipse cx="32" cy="38" rx="10" ry="8" fill="#f0abfc" opacity="0.25"/>
      {/* Eyes - big anime style */}
      <ellipse cx="25" cy="32" rx="5" ry="5.5" fill="#0f0527"/>
      <ellipse cx="39" cy="32" rx="5" ry="5.5" fill="#0f0527"/>
      <ellipse cx="26" cy="31" rx="3" ry="3.5" fill="#67e8f9"/>
      <ellipse cx="40" cy="31" rx="3" ry="3.5" fill="#67e8f9"/>
      <circle cx="27" cy="29.5" r="1.2" fill="white"/>
      <circle cx="41" cy="29.5" r="1.2" fill="white"/>
      <circle cx="25" cy="32" r="0.6" fill="white" opacity="0.5"/>
      <circle cx="39" cy="32" r="0.6" fill="white" opacity="0.5"/>
      {/* Nose */}
      <path d="M31 38L32 39.5L33 38Z" fill="#701a75"/>
      {/* Mouth */}
      <path d="M29 40C30 41.5 32 42 32 42C32 42 34 41.5 35 40" stroke="#701a75" strokeWidth="0.8" fill="none"/>
      {/* Whiskers */}
      <line x1="12" y1="35" x2="22" y2="37" stroke="#f0abfc" strokeWidth="0.6"/>
      <line x1="12" y1="39" x2="22" y2="39" stroke="#f0abfc" strokeWidth="0.6"/>
      <line x1="52" y1="35" x2="42" y2="37" stroke="#f0abfc" strokeWidth="0.6"/>
      <line x1="52" y1="39" x2="42" y2="39" stroke="#f0abfc" strokeWidth="0.6"/>
      {/* Blush */}
      <circle cx="22" cy="38" r="2.5" fill="#fb7185" opacity="0.3"/>
      <circle cx="42" cy="38" r="2.5" fill="#fb7185" opacity="0.3"/>
    </svg>
  ),
  'preset:bolt': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="bo-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#1a1500"/><stop offset="100%" stopColor="#2d2000"/></linearGradient>
        <linearGradient id="bo-bolt" x1="0" y1="0" x2="0" y2="64"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#bo-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4"/>
      {/* Electric ring */}
      <circle cx="32" cy="32" r="22" stroke="#fbbf24" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 3"/>
      {/* Lightning bolt */}
      <path d="M36 10L20 34H30L24 54L44 28H34L36 10Z" fill="url(#bo-bolt)" stroke="#fde68a" strokeWidth="1" strokeLinejoin="round"/>
      {/* Inner highlight */}
      <path d="M34 16L24 32H30L26 46L40 30H34L34 16Z" fill="#fde68a" opacity="0.4"/>
      {/* Sparks */}
      <circle cx="16" cy="24" r="1.5" fill="#fbbf24" opacity="0.6"/>
      <circle cx="48" cy="40" r="1.5" fill="#fbbf24" opacity="0.6"/>
      <circle cx="46" cy="18" r="1" fill="#fde68a" opacity="0.5"/>
      <circle cx="18" cy="46" r="1" fill="#fde68a" opacity="0.5"/>
    </svg>
  ),
  'preset:space-helmet': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="sh-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#020617"/><stop offset="100%" stopColor="#0f172a"/></linearGradient>
        <linearGradient id="sh-visor" x1="0" y1="20" x2="64" y2="44"><stop offset="0%" stopColor="#3b82f6"/><stop offset="50%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#sh-bg)"/>
      {/* Stars */}
      <circle cx="8" cy="12" r="0.8" fill="white" opacity="0.6"/>
      <circle cx="52" cy="8" r="0.6" fill="white" opacity="0.5"/>
      <circle cx="56" cy="52" r="0.8" fill="white" opacity="0.6"/>
      <circle cx="10" cy="54" r="0.6" fill="white" opacity="0.4"/>
      {/* Helmet */}
      <ellipse cx="32" cy="32" rx="20" ry="21" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
      {/* Helmet shine */}
      <path d="M16 24C16 24 20 18 32 18C44 18 48 24 48 24" stroke="#64748b" strokeWidth="0.8" opacity="0.5" fill="none"/>
      {/* Visor */}
      <ellipse cx="32" cy="30" rx="14" ry="12" fill="url(#sh-visor)" opacity="0.75"/>
      {/* Visor reflection */}
      <ellipse cx="28" cy="26" rx="6" ry="4" fill="white" opacity="0.15"/>
      {/* Chin */}
      <path d="M22 44C22 44 26 48 32 48C38 48 42 44 42 44" stroke="#475569" strokeWidth="1.2" fill="none"/>
      {/* Ear comms */}
      <circle cx="12" cy="32" r="3" fill="#334155" stroke="#475569" strokeWidth="0.8"/>
      <circle cx="52" cy="32" r="3" fill="#334155" stroke="#475569" strokeWidth="0.8"/>
      <circle cx="12" cy="32" r="1" fill="#3b82f6" opacity="0.8"/>
      <circle cx="52" cy="32" r="1" fill="#3b82f6" opacity="0.8"/>
    </svg>
  ),
  'preset:crown': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="cr-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#1a0f00"/><stop offset="100%" stopColor="#2d1a00"/></linearGradient>
        <linearGradient id="cr-gold" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#d97706"/></linearGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#cr-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#fbbf24" strokeWidth="1" opacity="0.3"/>
      {/* Crown */}
      <path d="M14 28L20 18L26 26L32 14L38 26L44 18L50 28V36H14V28Z" fill="url(#cr-gold)" stroke="#fde68a" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Crown jewels */}
      <circle cx="32" cy="18" r="2" fill="#ef4444"/>
      <circle cx="20" cy="22" r="1.5" fill="#3b82f6"/>
      <circle cx="44" cy="22" r="1.5" fill="#22c55e"/>
      {/* Crown band */}
      <rect x="14" y="33" width="36" height="4" rx="1" fill="#b45309" stroke="#fbbf24" strokeWidth="0.5"/>
      {/* Band jewels */}
      <circle cx="22" cy="35" r="1" fill="#ef4444" opacity="0.8"/>
      <circle cx="28" cy="35" r="1" fill="#3b82f6" opacity="0.8"/>
      <circle cx="32" cy="35" r="1.2" fill="#fbbf24"/>
      <circle cx="36" cy="35" r="1" fill="#22c55e" opacity="0.8"/>
      <circle cx="42" cy="35" r="1" fill="#ef4444" opacity="0.8"/>
      {/* Face below crown */}
      <ellipse cx="32" cy="46" rx="12" ry="9" fill="#92400e" opacity="0.3"/>
      {/* Eyes */}
      <circle cx="27" cy="44" r="2" fill="#fbbf24"/>
      <circle cx="37" cy="44" r="2" fill="#fbbf24"/>
      <circle cx="27" cy="44" r="0.8" fill="#1a0f00"/>
      <circle cx="37" cy="44" r="0.8" fill="#1a0f00"/>
      {/* Smile */}
      <path d="M29 49C30 50.5 34 50.5 35 49" stroke="#fbbf24" strokeWidth="0.8" fill="none"/>
    </svg>
  ),
  'preset:cyber-eye': (
    <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
      <defs>
        <linearGradient id="ce-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#0a0f1a"/><stop offset="100%" stopColor="#0d1929"/></linearGradient>
        <radialGradient id="ce-iris" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#00ffff"/><stop offset="50%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#0e7490"/></radialGradient>
      </defs>
      <rect width="64" height="64" rx="32" fill="url(#ce-bg)"/>
      <circle cx="32" cy="32" r="30" stroke="#06b6d4" strokeWidth="1" opacity="0.3"/>
      {/* Outer rings */}
      <circle cx="32" cy="32" r="24" stroke="#06b6d4" strokeWidth="0.6" opacity="0.2"/>
      <circle cx="32" cy="32" r="20" stroke="#06b6d4" strokeWidth="0.6" opacity="0.15" strokeDasharray="3 2"/>
      {/* Eye shape */}
      <path d="M8 32C8 32 18 18 32 18C46 18 56 32 56 32C56 32 46 46 32 46C18 46 8 32 8 32Z" fill="#083344" stroke="#22d3ee" strokeWidth="1.5"/>
      {/* Iris */}
      <circle cx="32" cy="32" r="10" fill="url(#ce-iris)" stroke="#00ffff" strokeWidth="0.8"/>
      {/* Pupil */}
      <circle cx="32" cy="32" r="4" fill="#0a0f1a"/>
      {/* Pupil inner glow */}
      <circle cx="32" cy="32" r="2" fill="#06b6d4" opacity="0.4"/>
      {/* Iris details */}
      <line x1="32" y1="22" x2="32" y2="26" stroke="#67e8f9" strokeWidth="0.5" opacity="0.4"/>
      <line x1="32" y1="38" x2="32" y2="42" stroke="#67e8f9" strokeWidth="0.5" opacity="0.4"/>
      <line x1="22" y1="32" x2="26" y2="32" stroke="#67e8f9" strokeWidth="0.5" opacity="0.4"/>
      <line x1="38" y1="32" x2="42" y2="32" stroke="#67e8f9" strokeWidth="0.5" opacity="0.4"/>
      {/* Highlight */}
      <circle cx="28" cy="28" r="2.5" fill="white" opacity="0.25"/>
      <circle cx="36" cy="36" r="1" fill="white" opacity="0.15"/>
      {/* Circuit lines */}
      <path d="M8 32L14 32M50 32L56 32" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5"/>
      <path d="M32 18L32 14M32 50L32 46" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" strokeDasharray="2 1"/>
    </svg>
  )
};

export const DEFAULT_AVATAR = (
  <svg viewBox="0 0 64 64" fill="none" className="gamer-avatar-svg">
    <defs>
      <linearGradient id="da-bg" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#0f172a"/><stop offset="100%" stopColor="#1e293b"/></linearGradient>
      <linearGradient id="da-accent" x1="0" y1="0" x2="64" y2="64"><stop offset="0%" stopColor="#00ff88"/><stop offset="100%" stopColor="#00ccff"/></linearGradient>
    </defs>
    <rect width="64" height="64" rx="32" fill="url(#da-bg)"/>
    <circle cx="32" cy="32" r="30" stroke="url(#da-accent)" strokeWidth="1.5" opacity="0.3"/>
    <circle cx="32" cy="24" r="9" fill="#1e293b" stroke="url(#da-accent)" strokeWidth="1.5"/>
    <circle cx="32" cy="24" r="4" fill="#00ff88" opacity="0.2"/>
    <path d="M16 48C16 40 23 34 32 34C41 34 48 40 48 48" stroke="url(#da-accent)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M20 46C20 41 25 37 32 37C39 37 44 41 44 46" fill="#00ff88" opacity="0.06"/>
  </svg>
);
