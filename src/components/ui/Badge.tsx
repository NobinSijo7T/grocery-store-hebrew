// ============================================================
// Badge Component
// ============================================================

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
      case 'primary': return theme.primaryLight;
      case 'secondary': return theme.secondaryLight;
      case 'accent': return theme.accentLight;
      case 'success': return '#D1FAE5'; // emerald-100
      case 'warning': return '#FEF3C7'; // amber-100
      case 'error': return '#FEE2E2';   // red-100
      default: return theme.primaryLight;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary': return theme.primaryDark;
      case 'secondary': return theme.secondary;
      case 'accent': return theme.accent;
      case 'success': return theme.success;
      case 'warning': return theme.warning;
      case 'error': return theme.error;
      default: return theme.primaryDark;
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
      <Text variant="xs" weight="medium" color={getTextColor()}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
});
