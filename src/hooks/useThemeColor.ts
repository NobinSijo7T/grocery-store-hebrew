// ============================================================
// useThemeColor Hook
// ============================================================
// Returns the correct color value based on the current theme.

import { Colors, type ThemeColors } from '@/constants/theme';
import { useThemeStore } from '@/stores/themeStore';

export function useThemeColor(): ThemeColors {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? Colors.dark : Colors.light;
}

export function useThemeValue<T>(lightValue: T, darkValue: T): T {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? darkValue : lightValue;
}
