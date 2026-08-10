// ============================================================
// Stack Layout for Sub-screens
// ============================================================

import React from 'react';
import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function StackLayout() {
  const theme = useThemeColor();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen 
        name="product/[id]" 
        options={{ 
          presentation: 'modal', // Use modal presentation for product details (optional, nice for mobile)
        }} 
      />
      {/* Add other stack screens like checkout, order, etc. here as needed */}
    </Stack>
  );
}
