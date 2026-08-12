// ============================================================
// Tabs Layout
// ============================================================

import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

// Animated cart icon component with smooth, colorful animation
function AnimatedCartIcon({ color, focused }: { color: string; focused: boolean }) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  const itemCount = useCartStore((s) => s.itemCount());
  const [previousCount, setPreviousCount] = useState(0);
  
  // Smooth, colorful animation when items are added to cart
  useEffect(() => {
    if (itemCount > previousCount && itemCount > 0) {
      // Scale and rotation animation
      scale.value = withSequence(
        withSpring(1.4, { damping: 6, stiffness: 280 }),
        withSpring(0.85, { damping: 7, stiffness: 380 }),
        withSpring(1, { damping: 10, stiffness: 320 })
      );
      
      rotation.value = withSequence(
        withSpring(-15, { damping: 8, stiffness: 280 }),
        withSpring(15, { damping: 8, stiffness: 280 }),
        withSpring(-8, { damping: 9, stiffness: 300 }),
        withSpring(0, { damping: 12, stiffness: 340 })
      );
      
      // Colorful rainbow cycle animation
      colorProgress.value = withSequence(
        withTiming(1, { duration: 150, easing: Easing.ease }),
        withTiming(2, { duration: 150, easing: Easing.ease }),
        withTiming(3, { duration: 150, easing: Easing.ease }),
        withTiming(4, { duration: 150, easing: Easing.ease }),
        withTiming(0, { duration: 200, easing: Easing.ease })
      );
    }
    setPreviousCount(itemCount);
  }, [itemCount]);
  
  const animatedStyle = useAnimatedStyle(() => {
    // Colorful gradient: primary -> purple -> pink -> orange -> green -> back to primary
    const animatedColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3, 4],
      ['#208AEF', '#8B5CF6', '#EC4899', '#F97316', '#10B981'] // Blue -> Purple -> Pink -> Orange -> Green
    );
    
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });
  
  const colorStyle = useAnimatedStyle(() => {
    const animatedColor = interpolateColor(
      colorProgress.value,
      [0, 1, 2, 3, 4],
      ['#208AEF', '#8B5CF6', '#EC4899', '#F97316', '#10B981']
    );
    
    return {
      color: colorProgress.value > 0 ? animatedColor : color,
    };
  });
  
  const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);
  
  return (
    <Animated.View style={animatedStyle}>
      <AnimatedIcon 
        name="shopping-cart" 
        size={24} 
        style={colorStyle}
      />
    </Animated.View>
  );
}

export default function TabLayout() {
  const theme = useThemeColor();
  const { isDark } = useThemeStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // Show labels underneath icons
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 2,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 16,
          right: 16,
          height: Platform.OS === 'ios' ? 88 : 80,
          backgroundColor: isDark ? 'rgba(30,30,40,0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 32,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          paddingTop: Platform.OS === 'ios' ? 12 : 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 16,
        },
      }}
    >
      {/* Home - leftmost position */}
      <Tabs.Screen
        name="index"
        options={{
          title: t.nav.home,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      
      {/* Cart - second position with animated icon */}
      <Tabs.Screen
        name="cart"
        options={{
          title: t.nav.cart,
          tabBarBadge: itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.badge,
            color: theme.badgeText,
          },
          tabBarIcon: ({ color, focused }) => (
            <AnimatedCartIcon color={color} focused={focused} />
          ),
        }}
      />
      
      {/* Orders */}
      <Tabs.Screen
        name="orders"
        options={{
          title: t.nav.orders,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="receipt" size={24} color={color} />
          ),
        }}
      />
      
      {/* Account - rightmost position */}
      <Tabs.Screen
        name="account"
        options={{
          title: t.nav.account,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
