// ============================================================
// Tabs Layout — iOS 26 Floating Glass Dynamic Island Bar
// ============================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { IOS26TabBar } from '@/components/navigation/IOS26TabBar';
import { useTranslation } from '@/hooks/useTranslation';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <IOS26TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: t.nav.home,
        }}
      />

      {/* Cart */}
      <Tabs.Screen
        name="cart"
        options={{
          title: t.nav.cart,
        }}
      />

      {/* Orders */}
      <Tabs.Screen
        name="orders"
        options={{
          title: t.nav.orders,
        }}
      />

      {/* Account */}
      <Tabs.Screen
        name="account"
        options={{
          title: t.nav.account,
        }}
      />
    </Tabs>
  );
}
