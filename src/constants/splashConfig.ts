// ============================================================
// Kirshner Farm — Splash Screen Configuration
// ============================================================
// Aligned directly with the app's design system tokens:
// Farm-to-table warmth, verdant greens, morning dew, Heebo typography.

import { Colors, Typography } from '@/constants/theme';

export const SPLASH_CONFIG = {
  /** Master switch to easily enable or disable the splash screen */
  enabled: true,

  /** Colors derived directly from the Kirshner Farm design system */
  colors: {
    /** Primary background: Deep Forest Green (#245C38) */
    background: Colors.light.primaryDark,
    /** Verdant Farm Green */
    primary: Colors.light.primary,
    /** Soft sage tint for secondary typography */
    sage: Colors.light.primaryTint,
    /** Morning dew light */
    morningDew: Colors.light.primaryLight,
    /** Harvest citrus accent */
    accent: Colors.light.secondary,
    /** Pure optical white for the emblem and title */
    text: '#FFFFFF',
    /** Soft sage for tagline */
    textSecondary: Colors.light.primaryTint,
    /** Subtle organic glow tint */
    glowTint: '#5DBE7A',
  },

  /** Brand typography aligned with Heebo font tokens */
  typography: {
    appNameHe: 'משק קירשנר',
    appNameEn: 'KIRSHNER FARM',
    taglineHe: 'טרי מהשדה ישר אליך',
    taglineEn: 'Fresh from the field to you',
    badgeHe: 'תוצרת חקלאית פרימיום 🌿',
    badgeEn: 'Farm Fresh Produce 🌿',
    fontFamily: Typography.fontFamily,
    fontSize: {
      title: 24,
      tagline: 13,
      badge: 11,
    },
    letterSpacing: {
      title: 3,
      tagline: 1.5,
      badge: 1,
    },
  },

  /** Millisecond timings for the Reanimated UI-thread choreography */
  timing: {
    // Phase 1: Emblem entrance
    emblemFadeDelay: 60,
    emblemFadeDuration: 700,
    emblemScaleDuration: 750,
    emblemTranslateDuration: 750,

    // Phase 2: Ambient morning dew glow bloom
    glowDelay: 720,
    glowPulseInDuration: 450,
    glowPulseOutDuration: 550,

    // Phase 3: Brand title cascade
    titleDelay: 620,
    titleFadeDuration: 520,
    titleTranslateDuration: 540,

    // Phase 4: Tagline cascade
    taglineDelay: 840,
    taglineFadeDuration: 480,
    taglineTranslateDuration: 500,

    // Phase 5: Heritage quality pill cascade
    badgeDelay: 1040,
    badgeFadeDuration: 450,
    badgeTranslateDuration: 480,

    // Phase 6: Savor completed lockup
    holdDuration: 450,

    // Phase 7: Silky screen exit fade
    screenFadeDuration: 420,
  },

  /** Motion & transform values */
  motion: {
    emblemInitialScale: 0.88,
    emblemTargetScale: 1.0,
    emblemTranslateDistance: 14,

    titleTranslateDistance: 8,
    taglineTranslateDistance: 6,
    badgeTranslateDistance: 6,

    glowInitialScale: 0.85,
    glowPeakScale: 1.18,
    glowSettleScale: 1.04,

    glowInitialOpacity: 0,
    glowPeakOpacity: 0.40,
    glowSettleOpacity: 0.18,
  },

  /** Accessible reduced motion */
  reducedMotion: {
    fadeDuration: 400,
    holdDuration: 500,
    screenFadeDuration: 350,
  },
} as const;

export type SplashConfig = typeof SPLASH_CONFIG;
