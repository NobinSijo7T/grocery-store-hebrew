// ============================================================
// Admin Layout
// ============================================================

import React, { useEffect } from 'react';
import { Tabs, router } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import { Typography } from '@/constants/theme';
import { Platform, View, ActivityIndicator } from 'react-native';

export default function AdminLayout() {
  const { isAdmin, session } = useAuthStore();
  const theme = useThemeColor();

  useEffect(() => {
    // Basic protection: if not admin, kick them out.
    if (!isAdmin) {
      router.replace('/(tabs)/account');
    }
  }, [isAdmin]);

  if (!isAdmin || !session) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true, // We want headers for admin screens
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerTitleStyle: { fontFamily: Typography.fontFamily.bold, fontSize: 18 },
        headerTitleAlign: 'center',
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.medium,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'דאשבורד',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'dashboard' : 'dashboard'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'ניהול הזמנות',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'list-alt' : 'list-alt'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'מוצרים',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'inventory' : 'inventory-2'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
