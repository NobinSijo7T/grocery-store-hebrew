// ============================================================
// Badge Component — Organic Label Pill
// ============================================================
// Earthy color palette — no harsh red/blue, only natural tones.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing } from '@/constants/theme';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  style?: any;
}

export function Badge({ label, variant = 'primary', style }: BadgeProps) {
  const theme = useThemeColor();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return theme.primaryLight;       // Sage green
      case 'secondary': return theme.secondaryLight;   // Peachy
      case 'accent': return theme.accentLight;         // Peach
      case 'success': return theme.primaryLight;       // Morning dew green
      case 'warning': return '#FFF3CD';                // Warm golden
      case 'error': return theme.saleLight;            // Warm terracotta tint
      default: return theme.primaryLight;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return theme.primary;
      case 'secondary': return theme.secondary;
      case 'accent': return theme.accent;
      case 'success': return theme.success;
      case 'warning': return theme.warning;
      case 'error': return theme.sale;
      default: return theme.primary;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      <Text variant="xs" weight="semiBold" color={getTextColor()}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
});
