// ============================================================
// Stack Layout for Sub-screens
// ============================================================

import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';

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
