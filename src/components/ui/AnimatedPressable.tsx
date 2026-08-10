// ============================================================
// AnimatedPressable — Smooth Tap Feedback
// ============================================================

import React, { useCallback } from 'react';
import { Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SPRING_CONFIGS } from '@/utils/animations';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleDown?: number;
  haptic?: boolean;
  children: React.ReactNode;
}

export function AnimatedPressable({
  style,
  scaleDown = 0.97,
  haptic = true,
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
      scale.value = withSpring(scaleDown, SPRING_CONFIGS.snappy);
      onPressIn?.(e);
    },
    [scaleDown, onPressIn, scale]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      scale.value = withSpring(1, SPRING_CONFIGS.gentle);
      onPressOut?.(e);
    },
    [onPressOut, scale]
  );

  const handlePress = useCallback(
    (e: any) => {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.(e);
    },
    [haptic, onPress]
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
