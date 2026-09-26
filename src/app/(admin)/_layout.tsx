// ============================================================
// Admin Layout
// ============================================================

import { Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuthStore } from '@/stores/authStore';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

export default function AdminLayout() {
  const { isAdmin, session } = useAuthStore();
  const theme = useThemeColor();

  const { t, language } = useTranslation();
  const isRTL = language === 'he';

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
        headerLeft: () => !isRTL ? (
          <View style={{ marginLeft: 16 }}>
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={theme.text} 
              onPress={() => router.push('/(tabs)/account')} 
            />
          </View>
        ) : null,
        headerRight: () => isRTL ? (
          <View style={{ marginRight: 16 }}>
            <MaterialIcons 
              name="arrow-forward" 
              size={24} 
              color={theme.text} 
              onPress={() => router.push('/(tabs)/account')} 
            />
          </View>
        ) : null,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          flexDirection: isRTL ? 'row-reverse' : 'row',
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
          title: language === 'he' ? 'דאשבורד' : 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'dashboard' : 'dashboard'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: language === 'he' ? 'ניהול הזמנות' : 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'list-alt' : 'list-alt'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: language === 'he' ? 'מוצרים' : 'Products',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'inventory' : 'inventory-2'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
