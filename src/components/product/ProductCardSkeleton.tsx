// ============================================================
// ProductCardSkeleton — High-Fidelity Organic Shimmer Card
// ============================================================
// Replicates the exact layout of ProductCard with a continuous,
// smooth diagonal linear-gradient sweep and subtle breathing glow.

import { BorderRadius, Layout, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export interface ProductCardSkeletonProps {
  index?: number;
}

export function ProductCardSkeleton({ index = 0 }: ProductCardSkeletonProps) {
  const theme = useThemeColor();
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
  }, [shimmerProgress]);

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-Layout.productCardWidth * 1.5, Layout.productCardWidth * 1.5]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn.delay(index * 60).duration(350)}
      style={[
        styles.card,
        {
          width: Layout.productCardWidth,
          backgroundColor: theme.surface,
          borderColor: theme.border,
          ...Shadows.sm,
          shadowColor: theme.shadowColor,
        },
      ]}
    >
      {/* 1. Product Image Skeleton */}
      <View style={[styles.imageContainer, { backgroundColor: theme.surfaceElevated }]}>
        <View style={styles.imageWatermark}>
          <Text style={{ fontSize: 28, opacity: 0.18 }}>🌾</Text>
        </View>

        {/* Small badge placeholder in top corner */}
        <View
          style={[
            styles.badgePlaceholder,
            { backgroundColor: theme.skeleton },
          ]}
        />

        {/* Shimmer sweep over image */}
        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
          <LinearGradient
            colors={['transparent', theme.skeletonHighlight, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1, opacity: 0.65 }}
          />
        </Animated.View>
      </View>

      {/* 2. Content Info Area */}
      <View style={styles.content}>
        {/* Category tag skeleton */}
        <View
          style={[
            styles.tagSkeleton,
            { backgroundColor: theme.skeleton },
          ]}
        />

        {/* Product Title Skeletons (2 lines) */}
        <View
          style={[
            styles.titleLine1,
            { backgroundColor: theme.skeleton },
          ]}
        />
        <View
          style={[
            styles.titleLine2,
            { backgroundColor: theme.skeleton },
          ]}
        />

        {/* 3. Bottom Row: Price & Add-Button */}
        <View style={styles.bottomRow}>
          {/* Price Tag Skeleton */}
          <View style={styles.priceContainer}>
            <View
              style={[
                styles.priceSkeleton,
                { backgroundColor: theme.skeleton },
              ]}
            />
            <View
              style={[
                styles.unitSkeleton,
                { backgroundColor: theme.skeleton },
              ]}
            />
          </View>

          {/* Add-to-cart circle button skeleton */}
          <View
            style={[
              styles.actionButtonSkeleton,
              { backgroundColor: theme.skeleton },
            ]}
          />
        </View>
      </View>

      {/* Global Card Shimmer Sweep */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          shimmerStyle,
          { pointerEvents: 'none' },
        ]}
      >
        <LinearGradient
          colors={['transparent', theme.skeletonHighlight, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, opacity: 0.35 }}
        />
      </Animated.View>
    </Animated.View>
  );
}

// Local helper to avoid importing Text when only emoji is needed
import { Text } from 'react-native';

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWatermark: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgePlaceholder: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    width: 48,
    height: 18,
    borderRadius: BorderRadius.full,
  },
  content: {
    padding: Spacing.sm,
  },
  tagSkeleton: {
    width: 44,
    height: 10,
    borderRadius: 5,
    marginBottom: Spacing.xs,
  },
  titleLine1: {
    width: '85%',
    height: 14,
    borderRadius: 7,
    marginBottom: 6,
  },
  titleLine2: {
    width: '55%',
    height: 14,
    borderRadius: 7,
    marginBottom: Spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  priceContainer: {
    gap: 4,
  },
  priceSkeleton: {
    width: 60,
    height: 18,
    borderRadius: 9,
  },
  unitSkeleton: {
    width: 36,
    height: 10,
    borderRadius: 5,
  },
  actionButtonSkeleton: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
