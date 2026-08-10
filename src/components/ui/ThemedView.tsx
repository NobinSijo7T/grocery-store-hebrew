// ============================================================
// ThemedView Component
// ============================================================

import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface ThemedViewProps extends ViewProps {
  surface?: 'background' | 'surface' | 'surfaceElevated';
}

export function ThemedView({
  style,
  surface = 'background',
  children,
  ...props
}: ThemedViewProps) {
  const theme = useThemeColor();

  return (
    <View
      style={[
        { backgroundColor: theme[surface] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
