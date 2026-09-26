// ============================================================
// AnimatedPressable — Organic Tap Feedback
// ============================================================
// Spring-physics press: scale down on press, spring back on release.
// Paired with haptic feedback for a physical, alive feeling.

import React, { useCallback } from 'react';
import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SPRING_CONFIGS } from '@/utils/animations';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleDown?: number;
  haptic?: boolean;
  hapticStyle?: 'light' | 'medium' | 'heavy';
  children: React.ReactNode;
}

export function AnimatedPressable({
  style,
  scaleDown = 0.96,
  haptic = true,
  hapticStyle = 'light',
  onPressIn,
  onPressOut,
  onPress,
  children,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: any) => {
      // Snap down with a snappy spring for immediate feedback
      scale.value = withSpring(scaleDown, SPRING_CONFIGS.snappy);
      onPressIn?.(e);
    },
    [scaleDown, onPressIn, scale]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      // Spring back with gentle overshoot — feels elastic and alive
      scale.value = withSpring(1, SPRING_CONFIGS.gentle);
      onPressOut?.(e);
    },
    [onPressOut, scale]
  );

  const handlePress = useCallback(
    (e: any) => {
      if (haptic) {
        const style =
          hapticStyle === 'medium'
            ? Haptics.ImpactFeedbackStyle.Medium
            : hapticStyle === 'heavy'
            ? Haptics.ImpactFeedbackStyle.Heavy
            : Haptics.ImpactFeedbackStyle.Light;
        Haptics.impactAsync(style);
      }
      onPress?.(e);
    },
    [haptic, hapticStyle, onPress]
  );

  return (
    <AnimatedPressableBase
      style={[animatedStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      {...props}
    >
      {children}
    </AnimatedPressableBase>
  );
}
