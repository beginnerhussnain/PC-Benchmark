export const themes = {
  // --- Original Themes ---
  arcticLight: {
    name: 'Arctic Light',
    background: '#f1f5f9',
    card: '#ffffff',
    border: '#cbd5e1',
    textMain: '#0f172a',
    textMuted: '#475569',
    primary: '#0ea5e9', // Deep Blue
    danger: '#ef4444',
    success: '#10b981'
  },
  cyberDark: {
    name: 'Cyber Dark',
    background: '#020617',
    card: '#0f172a',
    border: '#1e293b',
    textMain: '#f8fafc',
    textMuted: '#64748b',
    primary: '#38bdf8', // Neon Blue
    danger: '#ff3b3b',
    success: '#2eff7b'
  },
  forge: {
    name: 'The Forge',
    background: '#0a0a0a',   // Almost pure black
    card: '#171717',         // Charcoal
    border: '#333333',       // Gunmetal
    textMain: '#f5f5f5',
    textMuted: '#737373',
    primary: '#f59e0b',      // Glowing Amber / Gold
    danger: '#ef4444',       // Standard red
    success: '#10b981'       // Standard green
  },
  matrix: {
    name: 'Matrix',
    background: '#000000',
    card: '#051209',
    border: '#064e3b',
    textMain: '#2eff7b',
    textMuted: '#065f46',
    primary: '#2eff7b', // Neon Green
    danger: '#ff3b3b',
    success: '#2eff7b'
  },

  // --- New Advanced Themes ---
  synthwave: {
    name: 'Synthwave',
    background: '#0d0221',   // Deepened to near-black purple for better contrast
    card: '#1a0b3b',         // Dark rich violet
    border: '#4c1d95',       // Deep neon purple border
    textMain: '#fdf4ff',     // Crisp white with a tiny hint of pink
    textMuted: '#9d8fba',    // Desaturated purple-gray (no longer fights the primary colors)
    primary: '#9e4dfa',      // Pure Synthwave Cyan
    danger: '#ff007f',       // Pure Neon Pink
    success: '#39ff14'       // Toxic Neon Green
  },
  dracula: {
    name: 'Dracula Midnight',
    background: '#282a36',   // Classic Dracula background
    card: '#383a59',         // Slightly darkened card to make text pop
    border: '#6272a4',       // Classic Dracula comment color
    textMain: '#f8f8f2',     // Classic Dracula foreground
    textMuted: '#a2b0ce',    // Swapped from Cyan to a soft, readable slate-blue
    primary: '#bd93f9',      // Dracula Purple
    danger: '#ff5555',       
    success: '#50fa7b'       
  },
};

export type ThemeName = keyof typeof themes;