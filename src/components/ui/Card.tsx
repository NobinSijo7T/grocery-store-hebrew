// ============================================================
// Card Component — Organic Farm Surface
// ============================================================
// Warm cream background, soft green-tinted shadow, rounded corners
// that feel hand-carved. No harsh 1px border under shadow.

import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Shadows, Spacing } from '@/constants/theme';
import { AnimatedPressable } from './AnimatedPressable';

export interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export function Card({
  style,
  elevated = true,
  padding = true,
  onPress,
  children,
  ...props
}: CardProps) {
  const theme = useThemeColor();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.card,
      padding: padding ? Spacing.md : 0,
    },
    elevated ? Shadows.sm : undefined,
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable style={cardStyle} onPress={onPress} scaleDown={0.975} {...(props as any)}>
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    // Elevation declared once via shadow, no border to avoid ghost-card effect
  },
});
