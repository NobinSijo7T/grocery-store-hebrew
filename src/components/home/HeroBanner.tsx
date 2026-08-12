// ============================================================
// HeroBanner Component
// ============================================================

import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import type { Banner } from '@/types/models';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Carousel } from 'react-native-reanimated-carousel';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import { Text } from '../ui/Text';

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
        style={{ width: PAGE_WIDTH, height: 180 }}
        itemSize={PAGE_WIDTH}
        autoplay={true}
        autoplayInterval={4000}
        data={banners}
        animation={{ type: 'timing', duration: 1000 }}
        layout={{
          type: 'parallax',
          scale: 0.9,
          offset: 50,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // Darken image so text pops
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing['2xl'],
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
