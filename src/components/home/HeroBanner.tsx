// ============================================================
// HeroBanner Component
// ============================================================

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Image } from 'expo-image';
import { Text } from '../ui/Text';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing, Layout } from '@/constants/theme';
import type { Banner } from '@/types/models';

interface HeroBannerProps {
  banners: Banner[];
  onPressBanner: (banner: Banner) => void;
}

const { width: PAGE_WIDTH } = Dimensions.get('window');

export function HeroBanner({ banners, onPressBanner }: HeroBannerProps) {
  const theme = useThemeColor();

  if (!banners || banners.length === 0) return null;

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={PAGE_WIDTH}
        height={180}
        autoPlay={true}
        autoPlayInterval={4000}
        data={banners}
        scrollAnimationDuration={1000}
        // Basic scaling animation
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        renderItem={({ item, index }) => (
          <AnimatedPressable
            key={item.id}
            style={styles.bannerContainer}
            onPress={() => onPressBanner(item)}
            scaleDown={0.98}
          >
            <Image
              source={item.image_url}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            {/* Overlay for better text readability */}
            <View style={styles.overlay} />
            
            <View style={styles.content}>
              <Text variant="2xl" weight="bold" color="#FFFFFF" style={styles.title}>
                {item.title_he}
              </Text>
              {item.subtitle_he && (
                <Text variant="md" color="#FFFFFF" style={styles.subtitle}>
                  {item.subtitle_he}
                </Text>
              )}
            </View>
          </AnimatedPressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginBottom: Spacing.lg,
  },
  bannerContainer: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: Spacing.sm,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Darken image so text pops
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.2xl,
    alignItems: 'flex-start', // RTL: text starts on the right if I18nManager is active, but we can explicitly set textAlign in Text
  },
  title: {
    marginBottom: Spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
