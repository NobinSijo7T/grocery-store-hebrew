// ============================================================
// iOS 26 Floating Glass Dynamic Island Tab Bar
// ============================================================
// Futuristic floating frosted glass capsule, sliding fluid-morphic
// active indicator, micro-spring physics, luminous specular reflections,
// and tactile organic farm micro-interactions.

import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import {
    Dimensions,
    Platform,
    Pressable,
    StyleSheet,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface BottomTabBarProps {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: any }>;
  };
  descriptors: Record<string, { options: any }>;
  navigation: {
    emit: (event: { type: string; target: string; canPreventDefault?: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: any) => void;
  };
  insets?: any;
}

import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useCartStore } from '@/stores/cartStore';
import { useThemeStore } from '@/stores/themeStore';
import { Text } from '../ui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DOCK_MARGIN = 16;
const DOCK_WIDTH = SCREEN_WIDTH - DOCK_MARGIN * 2;
const DOCK_HEIGHT = 68;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function IOS26TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const theme = useThemeColor();
  const { isDark } = useThemeStore();
  const { isRTL } = useTranslation();

  const itemCount = useCartStore((s) => s.itemCount());
  const prevCount = useSharedValue(0);
  const cartBadgeScale = useSharedValue(1);

  const numTabs = state.routes.length;
  const tabWidth = (DOCK_WIDTH - 8) / numTabs; // 4px padding inside dock

  // Slide animation for the active fluid capsule
  const activeSlideX = useSharedValue(0);

  useEffect(() => {
    // Use state.index directly — I18nManager handles native RTL flipping,
    // so the flex row already renders in the correct visual order.
    activeSlideX.value = withSpring(state.index * tabWidth, {
      damping: 18,
      stiffness: 220,
      mass: 0.7,
    });
  }, [state.index, tabWidth, numTabs]);

  // Cart badge bounce when items change
  useEffect(() => {
    if (itemCount > prevCount.value && itemCount > 0) {
      cartBadgeScale.value = withSequence(
        withSpring(1.4, { damping: 5, stiffness: 350 }),
        withSpring(1, { damping: 10, stiffness: 300 })
      );
    }
    prevCount.value = itemCount;
  }, [itemCount]);

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: activeSlideX.value }],
  }));

  const cartBadgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartBadgeScale.value }],
  }));

  // Bottom clearance for floating bar
  const bottomPosition = Math.max(insets.bottom + 6, Platform.OS === 'ios' ? 24 : 16);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.outerContainer,
        {
          bottom: bottomPosition,
        },
      ]}
    >
      {/* Outer Floating Glass Capsule */}
      <View
        style={[
          styles.dockShadowWrap,
          {
            shadowColor: isDark ? '#000000' : '#1A3F26',
            shadowOpacity: isDark ? 0.5 : 0.16,
          },
        ]}
      >
        <BlurView
          intensity={Platform.OS === 'ios' ? 80 : 100}
          tint={isDark ? 'systemMaterialDark' : 'systemMaterialLight'}
          style={[
            styles.dockBlur,
            {
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.14)'
                : 'rgba(255, 255, 255, 0.75)',
            },
          ]}
        >
          {/* Subtle Glass Tint Gradient for refraction sheen */}
          <LinearGradient
            colors={
              isDark
                ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)', 'rgba(0, 0, 0, 0.3)']
                : ['rgba(255, 255, 255, 0.85)', 'rgba(250, 248, 240, 0.75)', 'rgba(240, 235, 225, 0.70)']
            }
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Top Specular Rim Light */}
          <View
            style={[
              styles.specularRim,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.18)'
                  : 'rgba(255, 255, 255, 0.95)',
              },
            ]}
          />

          {/* Sliding Liquid Active Indicator Capsule */}
          <Animated.View
            style={[
              styles.slidingPill,
              {
                width: tabWidth,
              },
              indicatorAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={
                isDark
                  ? ['rgba(45, 138, 78, 0.38)', 'rgba(34, 197, 94, 0.18)']
                  : ['rgba(45, 138, 78, 0.16)', 'rgba(232, 245, 237, 0.75)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[
                styles.pillInner,
                {
                  borderColor: isDark
                    ? 'rgba(74, 222, 128, 0.32)'
                    : 'rgba(45, 138, 78, 0.28)',
                },
              ]}
            >
              {/* Luminous micro-glow dot at top of active pill */}
              <View
                style={[
                  styles.activeGlowDot,
                  {
                    backgroundColor: isDark ? '#4ADE80' : theme.primary,
                  },
                ]}
              />
            </LinearGradient>
          </Animated.View>

          {/* Tab Buttons Row — I18nManager handles native RTL flex direction */}
          <View style={[styles.tabsRow, { flexDirection: 'row' }]}>
            {state.routes.map((route: any, index: number) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;

              // Tab title translation
              let label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              // Determine icon
              let iconName: keyof typeof MaterialIcons.glyphMap = 'circle';
              if (route.name === 'index') iconName = 'home';
              else if (route.name === 'cart') iconName = 'shopping-basket';
              else if (route.name === 'orders') iconName = 'receipt-long';
              else if (route.name === 'account') iconName = 'person';

              const activeColor = isDark ? '#4ADE80' : theme.primaryDark;
              const inactiveColor = isDark ? '#8E8E93' : '#737373';
              const targetColor = isFocused ? activeColor : inactiveColor;

              const onPress = () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TabButton
                  key={route.key}
                  label={typeof label === 'string' ? label : route.name}
                  icon={iconName}
                  isFocused={isFocused}
                  isCart={route.name === 'cart'}
                  cartCount={itemCount}
                  cartBadgeStyle={cartBadgeAnimatedStyle}
                  color={targetColor}
                  onPress={onPress}
                  tabWidth={tabWidth}
                />
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

// Individual Tab Button with spring press physics
interface TabButtonProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isFocused: boolean;
  isCart: boolean;
  cartCount: number;
  cartBadgeStyle: any;
  color: string;
  onPress: () => void;
  tabWidth: number;
}

function TabButton({
  label,
  icon,
  isFocused,
  isCart,
  cartCount,
  cartBadgeStyle,
  color,
  onPress,
  tabWidth,
}: TabButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.91, { damping: 14, stiffness: 350 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 280 });
  };

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(isFocused ? 1.14 : 1.0, {
          damping: 14,
          stiffness: 300,
        }),
      },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.tabButton, { width: tabWidth }, buttonAnimStyle]}
    >
      <View style={styles.iconContainer}>
        <Animated.View style={iconAnimStyle}>
          <MaterialIcons name={icon} size={24} color={color} />
        </Animated.View>

        {/* Live Floating Cart Badge */}
        {isCart && cartCount > 0 && (
          <Animated.View style={[styles.cartBadge, cartBadgeStyle]}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </Animated.View>
        )}
      </View>

      <Text
        variant="xs"
        weight={isFocused ? 'bold' : 'medium'}
        style={[
          styles.tabLabel,
          {
            color,
            opacity: isFocused ? 1 : 0.82,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: DOCK_MARGIN,
    right: DOCK_MARGIN,
    alignItems: 'center',
    zIndex: 999,
  },
  dockShadowWrap: {
    width: DOCK_WIDTH,
    height: DOCK_HEIGHT,
    borderRadius: 34,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 16,
  },
  dockBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 1.2,
    position: 'relative',
    justifyContent: 'center',
  },
  specularRim: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1.2,
    borderRadius: 1,
    opacity: 0.85,
  },
  slidingPill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    paddingHorizontal: 3,
    zIndex: 1,
  },
  pillInner: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  activeGlowDot: {
    position: 'absolute',
    top: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.9,
  },
  tabsRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    paddingHorizontal: 4,
  },
  tabButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 3,
    letterSpacing: 0.15,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    end: -12,
    backgroundColor: '#D84315', // Warm terracotta farm badge
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    lineHeight: 12,
  },
});
