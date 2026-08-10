// ============================================================
// Design System — Theme Tokens
// ============================================================
// Fresh-produce-inspired color palette, Heebo typography,
// spacing scale, shadows, border radii, and animation configs.

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// -------------------------
// Color Palette
// -------------------------
export const Colors = {
  light: {
    // Brand
    primary: '#2D8A4E',        // Fresh Green
    primaryLight: '#E8F5E9',
    primaryDark: '#1B5E20',
    secondary: '#F97316',      // Warm Orange
    secondaryLight: '#FFF3E0',
    accent: '#E11D48',         // Sale Red
    accentLight: '#FFF1F2',

    // Surfaces
    background: '#FAFAF5',     // Warm Cream
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',

    // Text
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Semantic
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',

    // Borders & Dividers
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#F0F0EB',

    // Shadows
    shadowColor: '#000000',

    // Specific UI
    tabBar: '#FFFFFF',
    tabBarBorder: '#F0F0EB',
    tabBarActive: '#2D8A4E',
    tabBarInactive: '#9CA3AF',
    skeleton: '#E5E7EB',
    skeletonHighlight: '#F3F4F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
    badge: '#E11D48',
    badgeText: '#FFFFFF',
    priceOld: '#9CA3AF',
    priceNew: '#E11D48',
    inStock: '#059669',
    outOfStock: '#DC2626',
    organic: '#059669',
    seasonal: '#7C3AED',
  },
  dark: {
    // Brand
    primary: '#4ADE80',
    primaryLight: '#1A2E1F',
    primaryDark: '#86EFAC',
    secondary: '#FB923C',
    secondaryLight: '#2A1F14',
    accent: '#FB7185',
    accentLight: '#2A1A1D',

    // Surfaces
    background: '#0F1419',
    surface: '#1A2332',
    surfaceElevated: '#243447',
    card: '#1A2332',

    // Text
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F1419',

    // Semantic
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',

    // Borders & Dividers
    border: '#334155',
    borderLight: '#1E293B',
    divider: '#1E293B',

    // Shadows
    shadowColor: '#000000',

    // Specific UI
    tabBar: '#1A2332',
    tabBarBorder: '#243447',
    tabBarActive: '#4ADE80',
    tabBarInactive: '#64748B',
    skeleton: '#243447',
    skeletonHighlight: '#334155',
    overlay: 'rgba(0, 0, 0, 0.7)',
    badge: '#FB7185',
    badgeText: '#FFFFFF',
    priceOld: '#64748B',
    priceNew: '#FB7185',
    inStock: '#34D399',
    outOfStock: '#F87171',
    organic: '#34D399',
    seasonal: '#A78BFA',
  },
};

export type ThemeColors = typeof Colors.light;

// -------------------------
// Typography
// -------------------------
export const Typography = {
  // Font family (Heebo loaded via expo-font)
  fontFamily: {
    regular: 'Heebo-Regular',
    medium: 'Heebo-Medium',
    semiBold: 'Heebo-SemiBold',
    bold: 'Heebo-Bold',
    black: 'Heebo-Black',
  },

  // Font sizes — large for Hebrew readability
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 22,
    lg: 26,
    xl: 28,
    '2xl': 32,
    '3xl': 38,
    '4xl': 44,
    '5xl': 56,
  },
};

// -------------------------
// Spacing
// -------------------------
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// -------------------------
// Border Radius
// -------------------------
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// -------------------------
// Shadows
// -------------------------
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
};

// -------------------------
// Animation Configs
// -------------------------
export const AnimationConfig = {
  // Spring presets
  spring: {
    gentle: { damping: 20, stiffness: 150, mass: 0.5 },
    bouncy: { damping: 12, stiffness: 180, mass: 0.6 },
    snappy: { damping: 18, stiffness: 300, mass: 0.5 },
    smooth: { damping: 28, stiffness: 200, mass: 0.8 },
  },

  // Timing presets
  timing: {
    fast: 150,
    normal: 250,
    slow: 400,
    verySlow: 600,
  },

  // Stagger delay for lists
  stagger: {
    fast: 30,
    normal: 50,
    slow: 80,
  },
};

// -------------------------
// Layout
// -------------------------
export const Layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallScreen: SCREEN_WIDTH < 375,
  contentPadding: 16,
  tabBarHeight: Platform.OS === 'ios' ? 88 : 64,
  headerHeight: Platform.OS === 'ios' ? 96 : 56,
  productCardWidth: (SCREEN_WIDTH - 48) / 2,  // 2-column grid with gaps
  bottomSheetSnapPoints: ['25%', '50%', '90%'],
};

// -------------------------
// Product unit display map
// -------------------------
export const UnitLabels: Record<string, string> = {
  'ק"ג': 'ק"ג',
  'יחידה': 'יח\'',
  'חבילה': 'חב\'',
  'ליטר': 'ל\'',
  'תבנית': 'תבנית',
};
