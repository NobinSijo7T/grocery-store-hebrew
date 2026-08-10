// ============================================================
// Card Component
// ============================================================

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
      borderColor: theme.borderLight,
      padding: padding ? Spacing.md : 0,
    },
    elevated ? Shadows.sm : undefined,
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable style={cardStyle} onPress={onPress} {...(props as any)}>
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
    borderWidth: 1,
    overflow: 'hidden',
  },
});
