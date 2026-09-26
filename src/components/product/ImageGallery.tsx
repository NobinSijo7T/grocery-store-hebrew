// ============================================================
// ImageGallery Component — Farm Produce Showcase
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { AnimatedPressable } from '../ui/AnimatedPressable';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ImageGalleryProps {
  images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THUMBNAIL_SIZE = 58;

export function ImageGallery({ images }: ImageGalleryProps) {
  const theme = useThemeColor();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Main Hero Image */}
      <View style={[styles.mainImageContainer, { backgroundColor: theme.surfaceElevated }]}>
        <Image
          source={images[activeIndex]}
          style={styles.mainImage}
          contentFit="cover"
          transition={300}
        />

        {/* Gallery count pill if multiple */}
        {images.length > 1 && (
          <View style={styles.countBadge}>
            <Animated.Text style={styles.countText}>
              {activeIndex + 1}/{images.length}
            </Animated.Text>
          </View>
        )}
      </View>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailsContainer}
        >
          {images.map((img, index) => {
            const isActive = index === activeIndex;
            return (
              <AnimatedPressable
                key={index}
                onPress={() => setActiveIndex(index)}
                style={[
                  styles.thumbnailWrapper,
                  {
                    borderColor: isActive ? theme.primary : 'transparent',
                    borderWidth: 2,
                    ...Shadows.sm,
                    shadowColor: theme.shadowColor,
                  },
                ]}
              >
                <Image
                  source={img}
                  style={styles.thumbnail}
                  contentFit="cover"
                />
              </AnimatedPressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  mainImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  countBadge: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: 'rgba(26, 46, 34, 0.72)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    gap: Spacing.sm,
  },
  thumbnailWrapper: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: '#FAF7F2',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});
