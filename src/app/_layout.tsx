// ============================================================
// Root Layout
// ============================================================

import React, { useEffect, useState } from 'react';
import { I18nManager, LogBox } from 'react-native';
import { Stack, SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useFonts } from 'expo-font';
import { useAuth } from '@/hooks/useAuth';

// Ignore specific warnings if needed
LogBox.ignoreLogs(['Warning: ...']);

// Force RTL immediately
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // Note: in a real app, if this flips, it requires an app restart.
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Heebo-Regular': 'https://github.com/OdedEzer/heebo/raw/master/fonts/ttf/Heebo-Regular.ttf',
    'Heebo-Medium': 'https://github.com/OdedEzer/heebo/raw/master/fonts/ttf/Heebo-Medium.ttf',
    'Heebo-SemiBold': 'https://github.com/OdedEzer/heebo/raw/master/fonts/ttf/Heebo-SemiBold.ttf',
    'Heebo-Bold': 'https://github.com/OdedEzer/heebo/raw/master/fonts/ttf/Heebo-Bold.ttf',
    'Heebo-Black': 'https://github.com/OdedEzer/heebo/raw/master/fonts/ttf/Heebo-Black.ttf',
  });

  const { isLoading: authLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded && !authLoading) {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoading]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
