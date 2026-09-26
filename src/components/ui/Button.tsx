// ============================================================
// Button Component — Organic Farm Feel
// ============================================================
// Primary: Filled farm green, glow shadow on press, spring scale
// Secondary: Harvest orange CTA
// Outline: Sand border, green text
// Ghost: Text-only
// Danger: Terracotta

import React, { useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { SPRING_CONFIGS } from '@/utils/animations';
import { MaterialIcons } from '@expo/vector-icons';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: 'start' | 'end';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  haptic = true,
}: ButtonProps) {
  const theme = useThemeColor();
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const getBackgroundColor = () => {
    if (disabled) return theme.border;
    switch (variant) {
      case 'primary': return theme.primary;
      case 'secondary': return theme.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      case 'danger': return theme.error;
      default: return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.textTertiary;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger': return '#FFFFFF';
      case 'outline':
      case 'ghost': return theme.primary;
      default: return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.border;
    if (variant === 'outline') return theme.primary;
    return 'transparent';
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 38;
      case 'md': return 50;
      case 'lg': return 56;
      default: return 50;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 'sm' as const;
      case 'md': return 'md' as const;
      case 'lg': return 'lg' as const;
      default: return 'md' as const;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return Spacing.md;
      case 'md': return Spacing.xl;
      case 'lg': return Spacing['2xl'];
      default: return Spacing.xl;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity:
      variant === 'primary' && !disabled
        ? interpolate(glow.value, [0, 1], [0.0, 0.35], Extrapolation.CLAMP)
        : 0,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIGS.snappy);
    if (variant === 'primary') {
      glow.value = withSpring(1, SPRING_CONFIGS.snappy);
    }
  }, [variant, scale, glow]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIGS.gentle);
    glow.value = withSpring(0, SPRING_CONFIGS.gentle);
  }, [scale, glow]);

  const handlePress = useCallback(() => {
    if (haptic && !disabled) {
      Haptics.impactAsync(
        size === 'lg'
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );
    }
    onPress?.();
  }, [haptic, disabled, size, onPress]);

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 20;

  return (
    <AnimatedPressableBase
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          height: getHeight(),
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : 1,
          paddingHorizontal: getPadding(),
          // Glow shadow for primary
          ...(variant === 'primary' && !disabled
            ? {
                shadowColor: theme.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 16,
                elevation: 4,
              }
            : {}),
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'start' && (
              <MaterialIcons
                name={icon}
                size={iconSize}
                color={getTextColor()}
                style={styles.iconStart}
              />
            )}
            <Text
              variant={getFontSize()}
              weight="semiBold"
              color={getTextColor()}
            >
              {title}
            </Text>
            {icon && iconPosition === 'end' && (
              <MaterialIcons
                name={icon}
                size={iconSize}
                color={getTextColor()}
                style={styles.iconEnd}
              />
            )}
          </>
        )}
      </View>
    </AnimatedPressableBase>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStart: {
    marginEnd: Spacing.sm, // RTL aware
  },
  iconEnd: {
    marginStart: Spacing.sm,
  },
});
