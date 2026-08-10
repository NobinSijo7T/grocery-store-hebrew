// ============================================================
// Button Component
// ============================================================

import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { Text } from './Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const theme = useThemeColor();

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
      case 'danger': return '#FFFFFF'; // Force white text on solid buttons
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
      case 'sm': return 36;
      case 'md': return 48;
      case 'lg': return 56;
      default: return 48;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 'sm';
      case 'md': return 'md';
      case 'lg': return 'lg';
      default: return 'md';
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          height: getHeight(),
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.7 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {icon && (
              <MaterialIcons
                name={icon}
                size={size === 'sm' ? 16 : 20}
                color={getTextColor()}
                style={styles.icon}
              />
            )}
            <Text
              variant={getFontSize()}
              weight="semiBold"
              color={getTextColor()}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginEnd: Spacing.sm, // RTL aware
  },
});
