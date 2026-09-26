// ============================================================
// ThemedView Component
// ============================================================

import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, View, type ViewProps } from 'react-native';

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
      style={StyleSheet.flatten([
        { backgroundColor: theme[surface] },
        style,
      ])}
      {...props}
    >
      {children}
    </View>
  );
}
