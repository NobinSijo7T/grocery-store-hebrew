// ============================================================
// Skeleton Loader Component
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, SKELETON_DURATION } from '@/constants/theme'; // Assuming you added this constant
import { LinearGradient } from 'expo-linear-gradient';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
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
      withTiming(1, { duration: 1200 }), // SKELETON_DURATION
      -1,
      false
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [-200, 200] // Rough translation range, can be refined based on width if needed
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
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={[
            theme.skeleton,
            theme.skeletonHighlight,
            theme.skeleton,
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
