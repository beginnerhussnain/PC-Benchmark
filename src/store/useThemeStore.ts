import { create } from 'zustand';
import { ThemeName, themes } from '../theme/themes';

interface ThemeStore {
  activeTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  activeTheme: 'cyberDark', // Default theme
  setTheme: (theme) => set({ activeTheme: theme }),
  cycleTheme: () => set((state) => {
    const themeKeys = Object.keys(themes) as ThemeName[];
    const currentIndex = themeKeys.indexOf(state.activeTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    return { activeTheme: themeKeys[nextIndex] };
  }),
}));