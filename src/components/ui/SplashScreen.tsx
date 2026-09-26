// ============================================================
// Kirshner Farm — SplashScreen Component
// ============================================================
// Redesigned with the Kirshner Farm design system:
// Verdant forest green (#245C38), morning dew warmth, Heebo typography,
// artisanal farm emblem badge, and silky Reanimated UI-thread animations.

import React, { useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import * as ExpoSplashScreen from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
  useReducedMotion,
  Easing,
} from 'react-native-reanimated';
import { useLanguageStore } from '@/stores/languageStore';
import { SPLASH_CONFIG } from '@/constants/splashConfig';
import { BorderRadius, Spacing } from '@/constants/theme';

export interface SplashScreenProps {
  /** Callback fired once the entire splash animation and fade-out complete */
  onAnimationComplete?: () => void;
  /** App name displayed below the emblem. Overrides localized default */
  appName?: string;
  /** Tagline displayed below the app name. Overrides localized default */
  tagline?: string;
  /** Badge chip text displayed below tagline. Overrides localized default */
  badgeText?: string;
  /** Custom logo source. Defaults to splash-icon */
  logoSource?: ImageSourcePropType;
  /** Background color. Defaults to Colors.light.primaryDark (#245C38) */
  backgroundColor?: string;
  /** Whether to automatically dismiss expo-splash-screen on mount. Defaults to true */
  autoHideNativeSplash?: boolean;
  /** Custom duration multiplier (1.0 = normal, 0.5 = 2x speed) */
  durationMultiplier?: number;
}

// Gold-standard UI easing curves
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);

export function SplashScreen({
  onAnimationComplete,
  appName,
  tagline,
  badgeText,
  logoSource = require('@/assets/images/splash-icon.png'),
  backgroundColor = SPLASH_CONFIG.colors.background,
  autoHideNativeSplash = true,
  durationMultiplier = 1.0,
}: SplashScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const hasTriggeredComplete = useRef(false);

  // Active language from store for authentic bilingual branding
  const language = useLanguageStore((s) => s.language);
  const isHebrew = language === 'he';

  const resolvedAppName =
    appName ??
    (isHebrew
      ? SPLASH_CONFIG.typography.appNameHe
      : SPLASH_CONFIG.typography.appNameEn);

  const resolvedTagline =
    tagline ??
    (isHebrew
      ? SPLASH_CONFIG.typography.taglineHe
      : SPLASH_CONFIG.typography.taglineEn);

  const resolvedBadge =
    badgeText ??
    (isHebrew
      ? SPLASH_CONFIG.typography.badgeHe
      : SPLASH_CONFIG.typography.badgeEn);

  // -------------------------------------------------------------
  // Animation Shared Values (all run on the UI thread)
  // -------------------------------------------------------------
  const containerOpacity = useSharedValue<number>(1);

  // Emblem entrance (Phase 1)
  const emblemOpacity = useSharedValue<number>(0);
  const emblemScale = useSharedValue<number>(
    prefersReducedMotion ? 1 : SPLASH_CONFIG.motion.emblemInitialScale
  );
  const emblemTranslateY = useSharedValue<number>(
    prefersReducedMotion ? 0 : SPLASH_CONFIG.motion.emblemTranslateDistance
  );

  // Ambient aura pulse (Phase 2)
  const glowOpacity = useSharedValue<number>(SPLASH_CONFIG.motion.glowInitialOpacity);
  const glowScale = useSharedValue<number>(
    prefersReducedMotion ? 1 : SPLASH_CONFIG.motion.glowInitialScale
  );

  // Title entrance (Phase 3)
  const titleOpacity = useSharedValue<number>(0);
  const titleTranslateY = useSharedValue<number>(
    prefersReducedMotion ? 0 : SPLASH_CONFIG.motion.titleTranslateDistance
  );

  // Tagline entrance (Phase 4)
  const taglineOpacity = useSharedValue<number>(0);
  const taglineTranslateY = useSharedValue<number>(
    prefersReducedMotion ? 0 : SPLASH_CONFIG.motion.taglineTranslateDistance
  );

  // Badge entrance (Phase 5)
  const badgeOpacity = useSharedValue<number>(0);
  const badgeTranslateY = useSharedValue<number>(
    prefersReducedMotion ? 0 : SPLASH_CONFIG.motion.badgeTranslateDistance
  );

  // Safe callback dispatcher back to the JS thread
  const notifyComplete = React.useCallback(() => {
    if (hasTriggeredComplete.current) return;
    hasTriggeredComplete.current = true;
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  useEffect(() => {
    // 1. Immediately hide the native splash screen on first frame mount.
    // Matched background color guarantees zero white flash.
    if (autoHideNativeSplash) {
      ExpoSplashScreen.hideAsync().catch(() => {});
    }

    const m = durationMultiplier;
    const { timing, motion, reducedMotion } = SPLASH_CONFIG;

    if (prefersReducedMotion) {
      // Accessible Reduced Motion Flow (pure soft opacity transitions)
      emblemOpacity.value = withTiming(1, {
        duration: reducedMotion.fadeDuration * m,
        easing: EASE_OUT,
      });

      titleOpacity.value = withDelay(
        reducedMotion.fadeDuration * 0.5 * m,
        withTiming(1, {
          duration: reducedMotion.fadeDuration * m,
          easing: EASE_OUT,
        })
      );

      taglineOpacity.value = withDelay(
        reducedMotion.fadeDuration * 0.75 * m,
        withTiming(1, {
          duration: reducedMotion.fadeDuration * m,
          easing: EASE_OUT,
        })
      );

      badgeOpacity.value = withDelay(
        reducedMotion.fadeDuration * m,
        withTiming(1, {
          duration: reducedMotion.fadeDuration * m,
          easing: EASE_OUT,
        })
      );

      const totalHoldDelay =
        (reducedMotion.fadeDuration + reducedMotion.holdDuration) * m;

      containerOpacity.value = withDelay(
        totalHoldDelay,
        withTiming(
          0,
          {
            duration: reducedMotion.screenFadeDuration * m,
            easing: EASE_OUT,
          },
          (finished) => {
            if (finished) {
              runOnJS(notifyComplete)();
            }
          }
        )
      );
      return;
    }

    // -----------------------------------------------------------
    // Production Choreography
    // -----------------------------------------------------------

    // Phase 1: Emblem fades in, scales from 0.88 -> 1.0, drifts upward
    emblemOpacity.value = withDelay(
      timing.emblemFadeDelay * m,
      withTiming(1, {
        duration: timing.emblemFadeDuration * m,
        easing: EASE_OUT,
      })
    );

    emblemScale.value = withDelay(
      timing.emblemFadeDelay * m,
      withTiming(motion.emblemTargetScale, {
        duration: timing.emblemScaleDuration * m,
        easing: EASE_OUT,
      })
    );

    emblemTranslateY.value = withDelay(
      timing.emblemFadeDelay * m,
      withTiming(0, {
        duration: timing.emblemTranslateDuration * m,
        easing: EASE_OUT,
      })
    );

    // Phase 2: Ambient morning dew glow pulse
    glowOpacity.value = withDelay(
      timing.glowDelay * m,
      withSequence(
        withTiming(motion.glowPeakOpacity, {
          duration: timing.glowPulseInDuration * m,
          easing: EASE_OUT,
        }),
        withTiming(motion.glowSettleOpacity, {
          duration: timing.glowPulseOutDuration * m,
          easing: EASE_IN_OUT,
        })
      )
    );

    glowScale.value = withDelay(
      timing.glowDelay * m,
      withSequence(
        withTiming(motion.glowPeakScale, {
          duration: timing.glowPulseInDuration * m,
          easing: EASE_OUT,
        }),
        withTiming(motion.glowSettleScale, {
          duration: timing.glowPulseOutDuration * m,
          easing: EASE_IN_OUT,
        })
      )
    );

    // Phase 3: Brand title cascade
    titleOpacity.value = withDelay(
      timing.titleDelay * m,
      withTiming(1, {
        duration: timing.titleFadeDuration * m,
        easing: EASE_OUT,
      })
    );

    titleTranslateY.value = withDelay(
      timing.titleDelay * m,
      withTiming(0, {
        duration: timing.titleTranslateDuration * m,
        easing: EASE_OUT,
      })
    );

    // Phase 4: Tagline cascade
    taglineOpacity.value = withDelay(
      timing.taglineDelay * m,
      withTiming(1, {
        duration: timing.taglineFadeDuration * m,
        easing: EASE_OUT,
      })
    );

    taglineTranslateY.value = withDelay(
      timing.taglineDelay * m,
      withTiming(0, {
        duration: timing.taglineTranslateDuration * m,
        easing: EASE_OUT,
      })
    );

    // Phase 5: Heritage quality pill cascade
    badgeOpacity.value = withDelay(
      timing.badgeDelay * m,
      withTiming(1, {
        duration: timing.badgeFadeDuration * m,
        easing: EASE_OUT,
      })
    );

    badgeTranslateY.value = withDelay(
      timing.badgeDelay * m,
      withTiming(0, {
        duration: timing.badgeTranslateDuration * m,
        easing: EASE_OUT,
      })
    );

    // Phase 6 & 7: Hold lockup briefly, then smoothly fade out entire screen
    const lockupSettledTime = (timing.badgeDelay + timing.badgeFadeDuration) * m;
    const fadeOutDelay = lockupSettledTime + timing.holdDuration * m;

    containerOpacity.value = withDelay(
      fadeOutDelay,
      withTiming(
        0,
        {
          duration: timing.screenFadeDuration * m,
          easing: EASE_OUT,
        },
        (finished) => {
          if (finished) {
            runOnJS(notifyComplete)();
          }
        }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion, durationMultiplier, autoHideNativeSplash]);

  // -------------------------------------------------------------
  // Animated Styles
  // -------------------------------------------------------------
  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const emblemStyle = useAnimatedStyle(() => ({
    opacity: emblemOpacity.value,
    transform: [
      { translateY: emblemTranslateY.value },
      { scale: emblemScale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ translateY: badgeTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.rootContainer,
        { backgroundColor },
        containerStyle,
      ]}
    >
      <StatusBar style="light" />

      {/* Center Lockup Anchor */}
      <View style={styles.centerAnchor}>
        {/* Phase 2: Ambient Dew Glow */}
        <Animated.View
          pointerEvents="none"
          style={[styles.glowWrapper, glowStyle]}
        >
          <Image
            source={require('@/assets/images/logo-glow.png')}
            style={styles.glowImage}
            contentFit="contain"
            tintColor={SPLASH_CONFIG.colors.glowTint}
          />
        </Animated.View>

        {/* Phase 1: Artisanal Emblem Badge */}
        <Animated.View style={[styles.emblemBadge, emblemStyle]}>
          <Image
            source={logoSource}
            style={styles.emblemImage}
            contentFit="contain"
            priority="high"
          />
        </Animated.View>

        {/* Phase 3: Brand Name */}
        <Animated.View style={[styles.titleWrapper, titleStyle]}>
          <Animated.Text
            style={[
              styles.appNameText,
              {
                letterSpacing: SPLASH_CONFIG.typography.letterSpacing.title,
                fontSize: SPLASH_CONFIG.typography.fontSize.title,
                color: SPLASH_CONFIG.colors.text,
              },
            ]}
          >
            {resolvedAppName}
          </Animated.Text>
        </Animated.View>

        {/* Phase 4: Tagline */}
        <Animated.View style={[styles.taglineWrapper, taglineStyle]}>
          <Animated.Text
            style={[
              styles.taglineText,
              {
                letterSpacing: SPLASH_CONFIG.typography.letterSpacing.tagline,
                fontSize: SPLASH_CONFIG.typography.fontSize.tagline,
                color: SPLASH_CONFIG.colors.textSecondary,
              },
            ]}
          >
            {resolvedTagline}
          </Animated.Text>
        </Animated.View>

        {/* Phase 5: Heritage Quality Seal */}
        <Animated.View style={[styles.badgeChip, badgeStyle]}>
          <Animated.Text
            style={[
              styles.badgeText,
              {
                letterSpacing: SPLASH_CONFIG.typography.letterSpacing.badge,
                fontSize: SPLASH_CONFIG.typography.fontSize.badge,
                color: SPLASH_CONFIG.colors.morningDew,
              },
            ]}
          >
            {resolvedBadge}
          </Animated.Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------
// Styles
// ---------------------------------------------------------------
const BADGE_SIZE = 120;
const GLOW_SIZE = 280;

const styles = StyleSheet.create({
  rootContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: Spacing['2xl'],
  },
  glowWrapper: {
    position: 'absolute',
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowImage: {
    width: '100%',
    height: '100%',
  },
  emblemBadge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emblemImage: {
    width: '100%',
    height: '100%',
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  appNameText: {
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: SPLASH_CONFIG.typography.fontFamily.bold,
    }),
    fontWeight: '700',
    includeFontPadding: false,
  },
  taglineWrapper: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  taglineText: {
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: SPLASH_CONFIG.typography.fontFamily.medium,
    }),
    fontWeight: '500',
    includeFontPadding: false,
  },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    borderWidth: 1,
    borderColor: 'rgba(200, 230, 212, 0.22)',
  },
  badgeText: {
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: SPLASH_CONFIG.typography.fontFamily.regular,
    }),
    fontWeight: '400',
    includeFontPadding: false,
  },
});
