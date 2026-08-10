// ============================================================
// Tabs Layout
// ============================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { HE } from '@/constants/hebrew';
import { Platform } from 'react-native';
import { Typography } from '@/constants/theme';
import { useCartStore } from '@/stores/cartStore';

export default function TabLayout() {
  const theme = useThemeColor();
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.medium,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: HE.nav.home,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'home' : 'home-filled'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: HE.nav.categories,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'grid-view' : 'grid-on'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: HE.nav.cart,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.badge,
            color: theme.badgeText,
          },
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'shopping-cart' : 'shopping-cart'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: HE.nav.orders,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'receipt_long' : 'receipt'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: HE.nav.account,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
