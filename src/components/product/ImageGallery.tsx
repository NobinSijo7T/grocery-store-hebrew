// ============================================================
// ImageGallery Component
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius } from '@/constants/theme';
import { AnimatedPressable } from '../ui/AnimatedPressable';

interface ImageGalleryProps {
  images: string[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const THUMBNAIL_SIZE = 60;

export function ImageGallery({ images }: ImageGalleryProps) {
  const theme = useThemeColor();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Main Image */}
      <View style={[styles.mainImageContainer, { backgroundColor: theme.surfaceElevated }]}>
        <Image
          source={images[activeIndex]}
          style={styles.mainImage}
          contentFit="contain"
          transition={200}
        />
      </View>

      {/* Thumbnails */}
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
  },
  mainImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH, // Square aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailsContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  thumbnailWrapper: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
  },
});
