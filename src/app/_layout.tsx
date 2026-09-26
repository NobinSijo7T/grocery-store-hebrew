// ============================================================
// Root Layout
// ============================================================

import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';
import { useLanguageStore } from '@/stores/languageStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { I18nManager, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Ignore specific warnings if needed
LogBox.ignoreLogs(['Warning: ...']);

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Ensure native I18nManager is kept in standard LTR mode so that Android's native
// ReactEditText does not have its IME/keyboard focus corrupted. RTL layout is fully handled
// at the UI level in JavaScript styles (flexDirection: row-reverse, textAlign).
if (I18nManager.isRTL) {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}

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
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
