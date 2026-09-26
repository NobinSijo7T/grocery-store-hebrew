// ============================================================
// Design System — Theme Tokens
// ============================================================
// Fresh-produce-inspired color palette, Heebo typography,
// spacing scale, shadows, border radii, and animation configs.
// Farm-to-table warmth: earthy greens, harvest oranges, cream surfaces.

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// -------------------------
// Color Palette
// -------------------------
export const Colors = {
  light: {
    // Brand — Farm Green Family
    primary: '#2D8A4E',        // Farm green, verdant and alive
    primaryLight: '#E8F5ED',   // Morning dew
    primaryDark: '#245C38',    // Deep forest
    primaryTint: '#C8E6D4',    // Soft sage

    // Accent — Harvest Orange
    secondary: '#FF8243',      // Ripe citrus, for CTAs and highlights
    secondaryLight: '#FFF1E8', // Peachy dawn
    accent: '#FF8243',
    accentLight: '#FFF1E8',

    // Sale / Discount
    sale: '#D84315',           // Terracotta earthy red
    saleLight: '#FBE9E7',

    // Surfaces — Warm naturals
    background: '#FFFEF7',     // Warm cream, not sterile white
    surface: '#FFFFFF',
    surfaceElevated: '#F5F4EC', // Linen
    card: '#FFFFFF',

    // Text — Organic Neutrals
    text: '#4A4A43',            // Charcoal
    textSecondary: '#6B6B63',   // Stone
    textTertiary: '#9A9A8F',    // Ash
    textInverse: '#FFFFFF',

    // Semantic
    success: '#2D8A4E',         // Uses primary green
    warning: '#F57C00',         // Pumpkin
    error: '#D84315',           // Terracotta
    info: '#5C7FA3',            // Dusty blue

    // Borders & Dividers
    border: '#E8E6DC',          // Sand
    borderLight: '#F0EFE6',     // Lighter sand
    divider: '#EDE9DF',

    // Shadows
    shadowColor: '#2D4A35',     // Green-tinted shadow for organic feel

    // Specific UI
    tabBar: '#FFFEF7',
    tabBarBorder: '#E8E6DC',
    tabBarActive: '#2D8A4E',
    tabBarInactive: '#9A9A8F',
    skeleton: '#EDE9DF',
    skeletonHighlight: '#F5F4EC',
    overlay: 'rgba(45, 74, 53, 0.5)', // Green-tinted overlay
    badge: '#D84315',
    badgeText: '#FFFFFF',
    priceOld: '#9A9A8F',
    priceNew: '#D84315',
    inStock: '#2D8A4E',
    outOfStock: '#D84315',
    organic: '#2D8A4E',
    seasonal: '#7C6B3F',        // Earthy wheat
  },
  dark: {
    // Brand
    primary: '#5DBE7A',         // Lighter farm green for dark mode
    primaryLight: '#1A2E22',
    primaryDark: '#8AD9A0',
    primaryTint: '#1F3828',

    // Accent
    secondary: '#FF9D6E',
    secondaryLight: '#2A1B12',
    accent: '#FF9D6E',
    accentLight: '#2A1B12',

    // Sale
    sale: '#FF6B44',
    saleLight: '#2A1A14',

    // Surfaces — Warm dark, not cold
    background: '#1C1C19',      // Deep charcoal with warm tint
    surface: '#252522',
    surfaceElevated: '#2E2E2A',
    card: '#252522',

    // Text
    text: '#FEFEF7',            // Warm white
    textSecondary: '#B8B8AE',
    textTertiary: '#787870',
    textInverse: '#1C1C19',

    // Semantic
    success: '#5DBE7A',
    warning: '#FFB347',
    error: '#FF6B44',
    info: '#7FB3D3',

    // Borders & Dividers
    border: '#3C3C38',
    borderLight: '#333330',
    divider: '#2E2E2A',

    // Shadows
    shadowColor: '#000000',

    // Specific UI
    tabBar: '#252522',
    tabBarBorder: '#3C3C38',
    tabBarActive: '#5DBE7A',
    tabBarInactive: '#787870',
    skeleton: '#2E2E2A',
    skeletonHighlight: '#3C3C38',
    overlay: 'rgba(0, 0, 0, 0.65)',
    badge: '#FF6B44',
    badgeText: '#FFFFFF',
    priceOld: '#787870',
    priceNew: '#FF6B44',
    inStock: '#5DBE7A',
    outOfStock: '#FF6B44',
    organic: '#5DBE7A',
    seasonal: '#D4AA70',
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
  md: 12,   // Buttons, inputs — hand-carved feel
  lg: 16,   // Cards
  xl: 20,
  '2xl': 24, // Bottom sheets, modals
  '3xl': 32, // Hero elements
  full: 9999,
};

// -------------------------
// Shadows — Soft, natural, warm
// -------------------------
export const Shadows = {
  sm: {
    shadowColor: '#2D4A35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#2D4A35',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2D4A35',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 12,
  },
  // Organic glow for primary CTA
  glow: {
    shadowColor: '#2D8A4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 6,
  },
};

// -------------------------
// Animation Configs
// -------------------------
export const AnimationConfig = {
  // Spring presets — physics-based, natural feel
  spring: {
    gentle: { damping: 20, stiffness: 90, mass: 0.6 },
    bouncy: { damping: 12, stiffness: 180, mass: 0.5 },
    snappy: { damping: 22, stiffness: 280, mass: 0.5 },
    smooth: { damping: 30, stiffness: 200, mass: 0.8 },
    wobbly: { damping: 8, stiffness: 120, mass: 0.5 },
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
