// ============================================================
// Root Layout
// ============================================================

import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';
import { useLanguageStore } from '@/stores/languageStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { I18nManager, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Ignore specific warnings if needed
LogBox.ignoreLogs(['Warning: ...']);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isRTL } = useLanguageStore();
  
  // Force RTL based on language setting
  useEffect(() => {
    if (isRTL !== I18nManager.isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL]);
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
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
