// ============================================================
// Auth Layout
// ============================================================

import React from 'react';
import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

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
