// ============================================================
// ProductLoadingAnimation — Organic Farm Harvest Loading Experience
// ============================================================
// A joyful, tactile, 60/120fps Reanimated loading animation
// replacing static skeletons with living, bouncing fresh produce
// (🥑, 🥕, 🍎, 🥦, 🍇), floating leaves, ambient harvest aura,
// animated gradient progress beam, and localized status messages.

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  FadeIn,
  FadeOut,
  FadeInDown,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { useThemeStore } from '@/stores/themeStore';
import { BorderRadius, Shadows, Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// -------------------------------------------------------------
// Produce Items Configuration
// -------------------------------------------------------------
interface ProduceItemData {
  id: string;
  emoji: string;
  labelHe: string;
  labelEn: string;
  accentColor: string;
  bounceDelay: number;
}

const PRODUCE_ITEMS: ProduceItemData[] = [
  { id: 'avocado', emoji: '🥑', labelHe: 'אבוקדו', labelEn: 'Avocado', accentColor: '#4A7C59', bounceDelay: 0 },
  { id: 'carrot', emoji: '🥕', labelHe: 'גזר', labelEn: 'Carrot', accentColor: '#E07A5F', bounceDelay: 140 },
  { id: 'apple', emoji: '🍎', labelHe: 'תפוח', labelEn: 'Apple', accentColor: '#D90429', bounceDelay: 280 },
  { id: 'broccoli', emoji: '🥦', labelHe: 'ברוקולי', labelEn: 'Broccoli', accentColor: '#2D6A4F', bounceDelay: 420 },
  { id: 'grapes', emoji: '🍇', labelHe: 'ענבים', labelEn: 'Grapes', accentColor: '#7209B7', bounceDelay: 560 },
];

// -------------------------------------------------------------
// Floating Ambient Particles (Leaves & Sparkles)
// -------------------------------------------------------------
interface FloatingParticleProps {
  symbol: string;
  startX: number;
  startY: number;
  delay: number;
  size: number;
}

function FloatingParticle({ symbol, startX, startY, delay, size }: FloatingParticleProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2600,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        -1,
        false
      )
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, -42]);
    const translateX = interpolate(
      progress.value,
      [0, 0.3, 0.7, 1],
      [0, 8, -6, 2]
    );
    const opacity = interpolate(
      progress.value,
      [0, 0.2, 0.75, 1],
      [0, 0.75, 0.6, 0]
    );
    const rotate = `${interpolate(progress.value, [0, 1], [-15, 25])}deg`;
    const scale = interpolate(progress.value, [0, 0.3, 0.8, 1], [0.5, 1, 0.9, 0.4]);

    return {
      transform: [{ translateY }, { translateX }, { rotate }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        { left: startX, top: startY },
        animatedStyle,
      ]}
    >
      <Text style={{ fontSize: size }}>{symbol}</Text>
    </Animated.View>
  );
}

// -------------------------------------------------------------
// Individual Bouncing Produce Card
// -------------------------------------------------------------
interface BouncingProduceProps {
  item: ProduceItemData;
}

function BouncingProduce({ item }: BouncingProduceProps) {
  const theme = useThemeColor();
  const isDark = useThemeStore((s) => s.isDark);
  const bounceY = useSharedValue(0);
  const squash = useSharedValue(1);

  useEffect(() => {
    // Synchronized rhythmic bounce with squash & stretch physics
    const bounceDuration = 480;
    const settleDuration = 460;

    bounceY.value = withDelay(
      item.bounceDelay,
      withRepeat(
        withSequence(
          // Jump upward
          withTiming(-20, { duration: bounceDuration, easing: Easing.out(Easing.cubic) }),
          // Fall down with gravity acceleration
          withTiming(0, { duration: settleDuration, easing: Easing.in(Easing.quad) }),
          // Brief rest at ground
          withTiming(0, { duration: 240 })
        ),
        -1,
        false
      )
    );

    squash.value = withDelay(
      item.bounceDelay,
      withRepeat(
        withSequence(
          // Stretch vertically as it ascends
          withTiming(1.1, { duration: bounceDuration * 0.5, easing: Easing.out(Easing.ease) }),
          withTiming(1.0, { duration: bounceDuration * 0.5 }),
          // Squash horizontally as it hits ground
          withTiming(0.88, { duration: 120, easing: Easing.in(Easing.quad) }),
          // Spring back to normal
          withTiming(1.0, { duration: 180, easing: Easing.out(Easing.elastic(1.2)) }),
          withTiming(1.0, { duration: 240 })
        ),
        -1,
        false
      )
    );
  }, [bounceY, item.bounceDelay, squash]);

  const produceStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: bounceY.value },
        { scaleY: squash.value },
        { scaleX: 2 - squash.value },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    // Shadow shrinks and fades as item goes higher
    const scaleX = interpolate(bounceY.value, [-20, 0], [0.55, 1.15]);
    const opacity = interpolate(bounceY.value, [-20, 0], [0.12, 0.45]);
    return {
      transform: [{ scaleX }],
      opacity,
    };
  });

  return (
    <View style={styles.produceWrapper}>
      {/* Animated Emoji Badge */}
      <Animated.View
        style={[
          styles.produceBadge,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: theme.border,
            ...Shadows.sm,
          },
          produceStyle,
        ]}
      >
        <Text style={styles.produceEmoji}>{item.emoji}</Text>
      </Animated.View>

      {/* Dynamic Ground Shadow */}
      <Animated.View
        style={[
          styles.groundShadow,
          { backgroundColor: isDark ? '#000000' : '#8A7E72' },
          shadowStyle,
        ]}
      />
    </View>
  );
}

// -------------------------------------------------------------
// Main ProductLoadingAnimation Component
// -------------------------------------------------------------
export interface ProductLoadingAnimationProps {
  customMessage?: string;
}

export function ProductLoadingAnimation({ customMessage }: ProductLoadingAnimationProps) {
  const theme = useThemeColor();
  const { language } = useTranslation();
  const isRTL = language === 'he';

  // Cycling message index
  const [messageIndex, setMessageIndex] = useState(0);


  // Animated gradient shimmer beam for progress track
  const shimmerProgress = useSharedValue(0);
  useEffect(() => {
    shimmerProgress.value = withRepeat(
      withTiming(1, {
        duration: 1400,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      false
    );
  }, [shimmerProgress]);

  const shimmerBeamStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerProgress.value, [0, 1], [-80, 200]);
    return {
      transform: [{ translateX }],
    };
  });

  // Dynamic status messages in Hebrew and English
  const messagesHe = [
    'מלקטים תוצרת טרייה מהשדה...',
    'בוחרים את הפירות והירקות המובחרים...',
    'בודקים איכות וטריות אורגנית...',
    'המדפים מתמלאים ברגעים אלו...',
  ];

  const messagesEn = [
    'Harvesting fresh produce from the fields...',
    'Selecting the finest organic harvest...',
    'Inspecting crisp freshness & quality...',
    'Stocking the freshest shelves for you...',
  ];

  const activeMessages = isRTL ? messagesHe : messagesEn;

  // Cycle messages smoothly every 2.4 seconds
  useEffect(() => {
    if (customMessage) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % activeMessages.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [activeMessages.length, customMessage]);

  // Rhythm wave dots animation
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const animConfig = { duration: 420, easing: Easing.inOut(Easing.ease) };
    dot1.value = withRepeat(
      withSequence(withTiming(1, animConfig), withTiming(0.25, animConfig)),
      -1,
      true
    );
    dot2.value = withDelay(
      140,
      withRepeat(
        withSequence(withTiming(1, animConfig), withTiming(0.25, animConfig)),
        -1,
        true
      )
    );
    dot3.value = withDelay(
      280,
      withRepeat(
        withSequence(withTiming(1, animConfig), withTiming(0.25, animConfig)),
        -1,
        true
      )
    );
  }, [dot1, dot2, dot3]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: dot1.value,
    transform: [{ scale: interpolate(dot1.value, [0.25, 1], [0.75, 1.25]) }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    opacity: dot2.value,
    transform: [{ scale: interpolate(dot2.value, [0.25, 1], [0.75, 1.25]) }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    opacity: dot3.value,
    transform: [{ scale: interpolate(dot3.value, [0.25, 1], [0.75, 1.25]) }],
  }));

  const currentMessageText = customMessage || activeMessages[messageIndex];

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(250)}
      style={styles.container}
    >
      {/* Background Soft Ambient Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: theme.border,
            ...Shadows.sm,
          },
        ]}
      >

        {/* Floating Particles (Leaves & Sparkles) */}
        <FloatingParticle symbol="🌿" startX={30} startY={40} delay={0} size={15} />
        <FloatingParticle symbol="🍃" startX={SCREEN_WIDTH * 0.72} startY={50} delay={500} size={14} />
        <FloatingParticle symbol="✨" startX={SCREEN_WIDTH * 0.42} startY={20} delay={1000} size={13} />
        <FloatingParticle symbol="🌱" startX={SCREEN_WIDTH * 0.18} startY={60} delay={1400} size={14} />

        {/* Central Stage: Row of Bouncing Produce Characters */}
        <View style={[styles.produceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {PRODUCE_ITEMS.map((item) => (
            <BouncingProduce key={item.id} item={item} />
          ))}
        </View>

        {/* Shimmer Progress Track */}
        <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
          <Animated.View style={[styles.shimmerBeam, shimmerBeamStyle]}>
            <LinearGradient
              colors={['transparent', theme.primary, theme.accent ?? '#F4A261', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        {/* Status Message & Rhythm Dots */}
        <View style={styles.messageContainer}>
          <Animated.View
            key={`msg-${messageIndex}`}
            entering={FadeInDown.duration(280).springify().damping(18)}
            exiting={FadeOut.duration(200)}
          >
            <Text
              variant="md"
              weight="semiBold"
              color={theme.text}
              style={[styles.messageText, { textAlign: isRTL ? 'right' : 'left' }]}
            >
              {currentMessageText}
            </Text>
          </Animated.View>

          {/* Rhythm Wave Dots */}
          <View style={styles.dotsRow}>
            <Animated.View
              style={[styles.dot, { backgroundColor: theme.primary }, dot1Style]}
            />
            <Animated.View
              style={[styles.dot, { backgroundColor: theme.primary }, dot2Style]}
            />
            <Animated.View
              style={[styles.dot, { backgroundColor: theme.primary }, dot3Style]}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// -------------------------------------------------------------
// Stylesheet
// -------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 280,
  },
  particle: {
    position: 'absolute',
    zIndex: 1,
  },
  produceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.sm + 4,
    marginBottom: Spacing.xl,
    zIndex: 2,
    height: 76,
  },
  produceWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 52,
    height: 74,
  },
  produceBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  produceEmoji: {
    fontSize: 24,
  },
  groundShadow: {
    width: 26,
    height: 5,
    borderRadius: 3,
  },
  progressTrack: {
    width: 170,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    position: 'relative',
  },
  shimmerBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 90,
  },
  messageContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  messageText: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
