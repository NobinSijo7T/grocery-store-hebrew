// ============================================================
// OrderTimeline Component
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { HE } from '@/constants/hebrew';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface OrderTimelineProps {
  status: string;
}

const TIMELINE_STEPS = [
  { id: 'pending', icon: 'schedule', label: HE.order.statuses.pending },
  { id: 'confirmed', icon: 'check-circle', label: HE.order.statuses.confirmed },
  { id: 'packing', icon: 'inventory-2', label: HE.order.statuses.packing },
  { id: 'out_for_delivery', icon: 'local-shipping', label: HE.order.statuses.out_for_delivery },
  { id: 'delivered', icon: 'home', label: HE.order.statuses.delivered },
];

export function OrderTimeline({ status }: OrderTimelineProps) {
  const theme = useThemeColor();

  // Determine current step index
  let currentIndex = TIMELINE_STEPS.findIndex((step) => step.id === status);
  
  // Handle cancelled state specially
  if (status === 'cancelled') {
    return (
      <View style={[styles.cancelledContainer, { backgroundColor: theme.error + '20' }]}>
        <MaterialIcons name="cancel" size={32} color={theme.error} style={{ marginBottom: 8 }} />
        <Text variant="lg" weight="bold" color={theme.error}>
          {HE.order.statuses.cancelled}
        </Text>
      </View>
    );
  }

  // If status not found, assume pending
  if (currentIndex === -1) currentIndex = 0;

  return (
    <View style={styles.container}>
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === TIMELINE_STEPS.length - 1;

        let iconColor = theme.border;
        let textColor = theme.textTertiary;
        
        if (isCompleted) {
          iconColor = theme.primary;
          textColor = theme.textSecondary;
        } else if (isCurrent) {
          iconColor = theme.primary;
          textColor = theme.primaryDark;
        }

        return (
          <Animated.View 
            key={step.id} 
            entering={FadeInRight.delay(index * 150)}
            style={styles.stepContainer}
          >
            {/* Dot & Line (RTL: items flow right-to-left, so line is on left) */}
            <View style={styles.indicatorContainer}>
              <View 
                style={[
                  styles.dot, 
                  { 
                    backgroundColor: isCompleted || isCurrent ? theme.primary : theme.surfaceElevated,
                    borderColor: isCompleted || isCurrent ? theme.primary : theme.border,
                  }
                ]}
              >
                <MaterialIcons 
                  name={step.icon as any} 
                  size={16} 
                  color={isCompleted || isCurrent ? '#FFFFFF' : theme.border} 
                />
              </View>
              
              {!isLast && (
                <View 
                  style={[
                    styles.line, 
                    { backgroundColor: isCompleted ? theme.primary : theme.border }
                  ]} 
                />
              )}
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <Text 
                variant="md" 
                weight={isCurrent ? 'bold' : 'medium'} 
                color={textColor}
              >
                {step.label}
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  stepContainer: {
    flexDirection: 'row-reverse', // RTL Support
    alignItems: 'flex-start',
    minHeight: 60,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 28, // Matches minHeight of container - dot height
    marginVertical: -2, // Slight overlap
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 6,
    paddingRight: Spacing.md, // Spacing from the dot (RTL)
  },
  cancelledContainer: {
    padding: Spacing.xl,
    borderRadius: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
