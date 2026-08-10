// ============================================================
// Animation Utilities
// ============================================================
// Shared animation configs for Reanimated.

import {
  withSpring,
  withTiming,
  Easing,
  type WithSpringConfig,
  type WithTimingConfig,
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  FadeInRight,
  FadeInLeft,
  SlideInRight,
  SlideInLeft,
  SlideOutRight,
  SlideOutLeft,
  ZoomIn,
  ZoomOut,
  Layout,
} from 'react-native-reanimated';

// -------------------------
// Spring Configs
// -------------------------
export const SPRING_CONFIGS = {
  gentle: { damping: 20, stiffness: 150, mass: 0.5 } satisfies WithSpringConfig,
  bouncy: { damping: 12, stiffness: 180, mass: 0.6 } satisfies WithSpringConfig,
  snappy: { damping: 18, stiffness: 300, mass: 0.5 } satisfies WithSpringConfig,
  smooth: { damping: 28, stiffness: 200, mass: 0.8 } satisfies WithSpringConfig,
  // For cart button bounce
  cartBounce: { damping: 10, stiffness: 350, mass: 0.4 } satisfies WithSpringConfig,
};

// -------------------------
// Timing Configs
// -------------------------
export const TIMING_CONFIGS = {
  fast: { duration: 150, easing: Easing.out(Easing.cubic) } satisfies WithTimingConfig,
  normal: { duration: 250, easing: Easing.inOut(Easing.cubic) } satisfies WithTimingConfig,
  slow: { duration: 400, easing: Easing.inOut(Easing.cubic) } satisfies WithTimingConfig,
};

// -------------------------
// Entering Animations (RTL-aware: use Left for RTL entry)
// -------------------------
export const ENTER_ANIMATIONS = {
  fadeIn: FadeIn.duration(300),
  fadeInDown: FadeInDown.duration(400).springify().damping(18),
  fadeInUp: FadeInUp.duration(400).springify().damping(18),
  // For RTL, items slide in from the left
  slideInRTL: FadeInLeft.duration(350).springify().damping(20),
  slideInLTR: FadeInRight.duration(350).springify().damping(20),
  zoomIn: ZoomIn.duration(300).springify().damping(15),
};

// -------------------------
// Exiting Animations
// -------------------------
export const EXIT_ANIMATIONS = {
  fadeOut: FadeOut.duration(200),
  slideOutRTL: SlideOutLeft.duration(250),
  slideOutLTR: SlideOutRight.duration(250),
  zoomOut: ZoomOut.duration(200),
};

// -------------------------
// Layout Animation
// -------------------------
export const LAYOUT_ANIMATION = Layout.springify().damping(18).stiffness(200);

// -------------------------
// Stagger delay helper
// -------------------------
export function staggerDelay(index: number, baseDelay: number = 50): number {
  return index * baseDelay;
}

// -------------------------
// Skeleton shimmer timing
// -------------------------
export const SKELETON_DURATION = 1200;
