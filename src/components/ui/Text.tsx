// ============================================================
// Text Component — Theme and RTL Aware
// ============================================================

import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Typography } from '@/constants/theme';

export interface TextProps extends RNTextProps {
  variant?: keyof typeof Typography.fontSize;
  weight?: keyof typeof Typography.fontFamily;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  secondary?: boolean;
}

export function Text({
  style,
  variant = 'md',
  weight = 'regular',
  color,
  align = 'left', // Defaulting to left for RTL (React Native handles the flip)
  secondary,
  children,
  ...props
}: TextProps) {
  const theme = useThemeColor();

  const textColor = color || (secondary ? theme.textSecondary : theme.text);

  return (
    <RNText
      style={[
        {
          color: textColor,
          fontSize: Typography.fontSize[variant],
          lineHeight: Typography.lineHeight[variant],
          fontFamily: Typography.fontFamily[weight],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
