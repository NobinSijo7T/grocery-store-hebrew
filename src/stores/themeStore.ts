// ============================================================
// Theme Store — Zustand
// ============================================================

import { create } from 'zustand';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;

  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const getIsDark = (mode: ThemeMode): boolean => {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark';
  }
  return mode === 'dark';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'light',
  isDark: false,

  setMode: (mode) => set({ mode, isDark: getIsDark(mode) }),
  toggle: () => {
    const current = get().mode;
    const next = current === 'dark' ? 'light' : 'dark';
    set({ mode: next, isDark: getIsDark(next) });
  },
}));
