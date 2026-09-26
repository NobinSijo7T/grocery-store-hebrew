// ============================================================
// HeroBanner Component — Farm Market Showcase
// ============================================================
// Organic hero carousel with warm overlays, handcrafted typography,
// natural shadow depth, spring physics, and delightful micro-interactions.

import { BorderRadius, Layout, Spacing } from '@/constants/theme';
import { useTranslation } from '@/hooks/useTranslation';
import type { Banner } from '@/types/models';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { Carousel } from 'react-native-reanimated-carousel';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { Text } from '../ui/Text';

interface HeroBannerProps {
  banners: Banner[];
  onPressBanner: (banner: Banner) => void;
}

const BANNER_HEIGHT = Layout.isSmallScreen ? 200 : 220;
const CARD_MARGIN = Spacing.lg;

const CarouselComponent: any =
  typeof Carousel === 'function' || (Carousel && typeof (Carousel as any).$$typeof === 'symbol')
    ? Carousel
    : (Carousel as any)?.Carousel || (Carousel as any)?.default || Carousel;

function PaginationDot({
  progress,
  index,
  count,
}: {
  progress: SharedValue<number>;
  index: number;
  count: number;
}) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(progress.value) % count === index;
    const scale = isActive ? 1 + pulse.value * 0.15 : 1;

    return {
      width: withSpring(isActive ? 24 : 8, { damping: 18, stiffness: 180 }),
      height: withSpring(8, { damping: 18, stiffness: 180 }),
      opacity: withSpring(isActive ? 1 : 0.45, { damping: 20, stiffness: 150 }),
      transform: [{ scale: withSpring(scale, { damping: 14, stiffness: 140 }) }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        {
          backgroundColor: '#FFFEF7',
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.4,
          shadowRadius: 2,
          elevation: 2,
        },
      ]}
    />
  );
}

export function HeroBanner({ banners, onPressBanner }: HeroBannerProps) {
  const { language } = useTranslation();
  const progressValue = useSharedValue<number>(0);

  const carouselWidth = Layout.screenWidth - CARD_MARGIN * 2;
  const cardWidth = carouselWidth;

  if (!banners || banners.length === 0) return null;

  return (
    <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
      <CarouselComponent
        loop
        style={{ width: carouselWidth, height: BANNER_HEIGHT, alignSelf: 'center' }}
        width={carouselWidth}
        height={BANNER_HEIGHT}
        autoPlay={true}
        autoPlayInterval={5000}
        data={banners}
        scrollAnimationDuration={900}
        onProgressChange={(_: any, absoluteProgress: number) => {
          progressValue.value = absoluteProgress;
        }}
        renderItem={({ item }: { item: Banner }) => {
          const title = language === 'he' ? item.title_he : item.title_en || item.title_he;
          const subtitle =
            language === 'he' ? item.subtitle_he : item.subtitle_en || item.subtitle_he;
          const textAlign = language === 'he' ? ('right' as const) : ('left' as const);
          const alignItems = language === 'he' ? ('flex-end' as const) : ('flex-start' as const);

          return (
            <View
              style={{
                width: carouselWidth,
                height: BANNER_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatedPressable
                style={[
                  styles.bannerContainer,
                  {
                    width: cardWidth,
                    height: BANNER_HEIGHT - Spacing.sm,
                  },
                ]}
                onPress={() => onPressBanner(item)}
                scaleDown={0.97}
                haptic
              >
                <Image
                  source={item.image_url}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  transition={500}
                  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
                />

                <LinearGradient
                  colors={[
                    'rgba(29,68,45,0)',
                    'rgba(29,68,45,0.12)',
                    'rgba(29,68,45,0.58)',
                  ]}
                  locations={[0, 0.5, 1]}
                  style={StyleSheet.absoluteFill}
                />

                <LinearGradient
                  colors={[
                    'rgba(20,30,25,0.15)',
                    'transparent',
                    'transparent',
                    'rgba(20,30,25,0.15)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />

                <View style={[styles.content, { alignItems }]}>
                  {subtitle && (
                    <View
                      style={[
                        styles.badge,
                        { alignSelf: alignItems === 'flex-end' ? 'flex-end' : 'flex-start' },
                      ]}
                    >
                      <Text
                        variant="xs"
                        weight="bold"
                        color="#2D8A4E"
                        style={[styles.badgeText, { textAlign }]}
                        numberOfLines={1}
                      >
                        {subtitle}
                      </Text>
                    </View>
                  )}

                  <Text
                    variant={Layout.isSmallScreen ? 'xl' : '2xl'}
                    weight="black"
                    color="#FFFEF7"
                    style={[
                      styles.title,
                      { textAlign, lineHeight: Layout.isSmallScreen ? 28 : 34 },
                    ]}
                    numberOfLines={2}
                  >
                    {title}
                  </Text>
                </View>

                {banners.length > 1 && (
                  <View style={styles.dotsContainer}>
                    {banners.map((_, i) => (
                      <PaginationDot
                        key={i}
                        progress={progressValue}
                        index={i}
                        count={banners.length}
                      />
                    ))}
                  </View>
                )}
              </AnimatedPressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: BANNER_HEIGHT,
    marginBottom: Spacing.lg,
  },
  bannerContainer: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1D442D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(255,254,247,0.95)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
    maxWidth: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  badgeText: {
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  title: {
    textShadowColor: 'rgba(20,30,25,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    letterSpacing: -0.3,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: Spacing.md,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(20,30,25,0.25)',
    borderRadius: BorderRadius.full,
    maxWidth: '90%',
  },
  dot: {
    borderRadius: BorderRadius.full,
  },
});
