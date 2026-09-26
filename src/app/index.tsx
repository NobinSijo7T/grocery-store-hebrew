// ============================================================
// App Entry Route — PRISM Splash Screen
// ============================================================
// Launches the animated splash screen on app start, then
// smoothly routes to the main application root (tabs).
// Easily enabled/disabled via SPLASH_CONFIG.enabled.

import React, { useCallback } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { SPLASH_CONFIG } from '@/constants/splashConfig';

export default function Index() {
  const router = useRouter();

  const handleAnimationComplete = useCallback(() => {
    // Navigate to the existing root application route
    router.replace('/(tabs)');
  }, [router]);

  // If disabled, immediately redirect to main app without splash delay
  if (!SPLASH_CONFIG.enabled) {
    return <Redirect href="/(tabs)" />;
  }

  return <SplashScreen onAnimationComplete={handleAnimationComplete} />;
}
