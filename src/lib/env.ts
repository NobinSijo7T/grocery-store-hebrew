// ============================================================
// Environment Configuration
// ============================================================
// Reads from app.config.ts extra field.

import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

export const ENV = {
  SUPABASE_URL: extra?.supabaseUrl ?? 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: extra?.supabaseAnonKey ?? 'YOUR_ANON_KEY',
  APP_NAME: 'משק קירשנר',
  FREE_DELIVERY_THRESHOLD: 150,
  DELIVERY_FEE: 25,
} as const;
