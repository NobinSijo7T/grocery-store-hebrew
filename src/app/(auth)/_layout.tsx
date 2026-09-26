// ============================================================
// Auth Layout
// ============================================================

import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const theme = useThemeColor();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
