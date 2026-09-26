// ============================================================
// SmoothLoader — Organic Farm-Fresh Loading Experience
// ============================================================
// 60fps/120fps continuous Reanimated animations:
// - Rotating orbital gradient ring
// - Breathing ambient halo glow
// - Levitating organic farm emblem
// - Animated wave rhythm dots
// - Supports 'fullscreen', 'inline', and 'pill' variants.

import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Text } from './Text';

export interface SmoothLoaderProps {
  variant?: 'fullscreen' | 'inline' | 'pill';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  style?: ViewStyle;
}

export function SmoothLoader({
  variant = 'inline',
  message,
  size = 'md',
  icon = '🌿',
  style,
}: SmoothLoaderProps) {
  const theme = useThemeColor();
  const { language } = useTranslation();
  const isRTL = language === 'he';

  // 1. Smooth 360-degree rotation for the gradient orbit
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1250,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // 2. Breathing ambient pulse for the background glow ring
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, {
        duration: 1600,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [pulse]);

  const haloStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [0.92, 1.22]);
    const opacity = interpolate(pulse.value, [0, 1], [0.35, 0.08]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // 3. Floating levitation for the center emblem
  const floatY = useSharedValue(0);
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [floatY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  // 4. Dot rhythm wave animation
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const animConfig = { duration: 450, easing: Easing.inOut(Easing.ease) };
    dot1.value = withRepeat(
      withSequence(withTiming(1, animConfig), withTiming(0.25, animConfig)),
      -1,
      true
    );
    dot2.value = withDelay(
      150,
      withRepeat(
        withSequence(withTiming(1, animConfig), withTiming(0.25, animConfig)),
        -1,
        true
      )
    );
    dot3.value = withDelay(
      300,
      withRepeat(
        withSequence(withTiming(1, animConfig), withTiming(0.25, animConfig)),
        -1,
        true
      )
    );
  }, [dot1, dot2, dot3]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: interpolate(dot1.value, [0.25, 1], [0.75, 1.15]) }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: interpolate(dot2.value, [0.25, 1], [0.75, 1.15]) }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: interpolate(dot3.value, [0.25, 1], [0.75, 1.15]) }],
  }));

  // Default localized message
  const defaultText =
    message ??
    (isRTL ? 'טוען תוצרת טרייה מהשדה...' : 'Harvesting farm fresh produce...');

  // Dimensions based on size
  const ringSize = size === 'sm' ? 44 : size === 'lg' ? 76 : 58;
  const badgeSize = size === 'sm' ? 34 : size === 'lg' ? 62 : 46;
  const iconFontSize = size === 'sm' ? 18 : size === 'lg' ? 30 : 22;

  // --- FLOATING PILL VARIANT (Ideal for top of lists / category changes) ---
  if (variant === 'pill') {
    return (
      <Animated.View
        entering={FadeInDown.duration(300).springify().damping(18)}
        exiting={FadeOut.duration(200)}
        style={[styles.pillContainer, style]}
      >
        <View
          style={[
            styles.pillCard,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
              ...Shadows.md,
            },
          ]}
        >
          {/* Mini Rotating Halo */}
          <View style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View
              style={[
                styles.miniHalo,
                {
                  borderColor: theme.primary,
                  borderTopColor: 'transparent',
                },
                orbitStyle,
              ]}
            />
            <Text style={{ fontSize: 14 }}>{icon}</Text>
          </View>

          {/* Label */}
          <Text
            variant="sm"
            weight="semiBold"
            color={theme.text}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            {defaultText}
          </Text>

          {/* Rhythmic dots */}
          <View style={styles.dotsRow}>
            <Animated.View
              style={[styles.dot, { backgroundColor: theme.primary }, dot1Style]}
            />
            <Animated.View
              style={[styles.dot, { backgroundColor: theme.primary }, dot2Style]}
            />
            <Animated.View
              style={[styles.dot, { backgroundColor: theme.primary }, dot3Style]}
            />
          </View>
        </View>
      </Animated.View>
    );
  }

  // --- FULLSCREEN & INLINE VARIANTS ---
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={[
        variant === 'fullscreen' ? styles.fullscreen : styles.inline,
        style,
      ]}
    >
      {/* Halo & Spinner Orb */}
      <View
        style={{
          width: ringSize * 1.5,
          height: ringSize * 1.5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Soft Ambient Glow Halo */}
        <Animated.View
          style={[
            styles.haloGlow,
            {
              width: ringSize * 1.4,
              height: ringSize * 1.4,
              borderRadius: (ringSize * 1.4) / 2,
              backgroundColor: theme.primary,
            },
            haloStyle,
          ]}
        />

        {/* Orbit Ring */}
        <Animated.View
          style={[
            styles.orbitRing,
            {
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
            },
            orbitStyle,
          ]}
        >
          <LinearGradient
            colors={[
              theme.primary,
              theme.primaryDark ?? theme.primary,
              'rgba(45, 138, 78, 0.05)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, borderRadius: ringSize / 2 }}
          />
        </Animated.View>

        {/* Central Organic Badge */}
        <View
          style={[
            styles.innerBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: theme.surface,
              ...Shadows.sm,
            },
          ]}
        >
          <Animated.View style={floatStyle}>
            <Text style={{ fontSize: iconFontSize }}>{icon}</Text>
          </Animated.View>
        </View>
      </View>

      {/* Message and pulsating dots */}
      <View style={styles.textWrapper}>
        <Text
          variant={size === 'lg' ? 'md' : 'sm'}
          weight="semiBold"
          color={theme.textSecondary}
          style={{ textAlign: 'center' }}
        >
          {defaultText}
        </Text>

        <View style={styles.dotsRowCenter}>
          <Animated.View
            style={[styles.dot, { backgroundColor: theme.primary }, dot1Style]}
          />
          <Animated.View
            style={[styles.dot, { backgroundColor: theme.primary }, dot2Style]}
          />
          <Animated.View
            style={[styles.dot, { backgroundColor: theme.primary }, dot3Style]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  inline: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  pillContainer: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
    zIndex: 10,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  miniHalo: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.2,
  },
  haloGlow: {
    position: 'absolute',
  },
  orbitRing: {
    position: 'absolute',
    padding: 3,
  },
  innerBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    marginTop: Spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: Spacing.xs,
  },
  dotsRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
