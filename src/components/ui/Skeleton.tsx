// ============================================================
// Skeleton Loader — Warm Organic Shimmer
// ============================================================
// Uses cream/linen tones instead of cold gray.
// Shimmer sweep moves diagonally for more organic feel.

import React, { useEffect } from 'react';
import { View, type ViewStyle, type DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
}: SkeletonProps) {
  const theme = useThemeColor();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-250, 250]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.skeleton,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, left: -100, right: -100 }, animatedStyle]}>
        <LinearGradient
          colors={[
            theme.skeleton,
            theme.skeletonHighlight,
            theme.skeleton,
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}
