// ============================================================
// OrderTimeline Component — Farm Dispatch Progress
// ============================================================
// Visual progress of produce harvest, sorting, packing & delivery
// with warm earthy status nodes and spring animations.

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { BorderRadius, Spacing } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface OrderTimelineProps {
  status: string;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  const theme = useThemeColor();
  const { t, language } = useTranslation();
  const isRTL = language === 'he';
  const flexDirection = isRTL ? 'row-reverse' : 'row';

  const timelineSteps = [
    { id: 'pending', icon: 'schedule', label: t.order.statuses.pending, farmSub: isRTL ? 'ההזמנה התקבלה במערכת' : 'Order received' },
    { id: 'confirmed', icon: 'eco', label: t.order.statuses.confirmed, farmSub: isRTL ? 'אושר לליקוט מהמטעים' : 'Confirmed for picking' },
    { id: 'packing', icon: 'inventory-2', label: t.order.statuses.packing, farmSub: isRTL ? 'נארז בקפידה בסלסילת המשק' : 'Packed in farm crate' },
    { id: 'out_for_delivery', icon: 'local-shipping', label: t.order.statuses.out_for_delivery, farmSub: isRTL ? 'השליח בדרך אליכם' : 'Courier on the way' },
    { id: 'delivered', icon: 'home', label: t.order.statuses.delivered, farmSub: isRTL ? 'התוצרת הגיעה לדלתכם' : 'Delivered fresh' },
  ];

  let currentIndex = timelineSteps.findIndex((step) => step.id === status);

  if (status === 'cancelled') {
    return (
      <View style={[styles.cancelledContainer, { backgroundColor: '#FEE2E2' }]}>
        <MaterialIcons name="cancel" size={36} color="#DC2626" style={{ marginBottom: 6 }} />
        <Text variant="lg" weight="bold" color="#DC2626">
          {t.order.statuses.cancelled}
        </Text>
      </View>
    );
  }

  if (currentIndex === -1) currentIndex = 0;

  return (
    <View style={styles.container}>
      {timelineSteps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === timelineSteps.length - 1;

        let dotBg = theme.borderLight;
        let iconColor = theme.textTertiary;
        let textColor = theme.textTertiary;

        if (isCompleted) {
          dotBg = theme.primary;
          iconColor = '#FFFFFF';
          textColor = theme.textSecondary;
        } else if (isCurrent) {
          dotBg = theme.primaryDark;
          iconColor = '#FFFFFF';
          textColor = theme.primaryDark;
        }

        return (
          <Animated.View
            key={step.id}
            entering={FadeInDown.delay(index * 60).springify()}
            style={[styles.stepContainer, { flexDirection }]}
          >
            {/* Dot & Connecting line */}
            <View style={styles.indicatorContainer}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: dotBg,
                    borderColor: isCurrent ? theme.primaryLight : 'transparent',
                    borderWidth: isCurrent ? 3 : 0,
                  },
                ]}
              >
                <MaterialIcons
                  name={step.icon as any}
                  size={16}
                  color={iconColor}
                />
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted ? theme.primary : theme.border,
                    },
                  ]}
                />
              )}
            </View>

            {/* Step label & subtitle */}
            <View
              style={[
                styles.contentContainer,
                isRTL ? { paddingRight: Spacing.md } : { paddingLeft: Spacing.md },
              ]}
            >
              <Text
                variant="md"
                weight={isCurrent ? 'bold' : isCompleted ? 'semiBold' : 'regular'}
                color={textColor}
              >
                {step.label}
              </Text>
              <Text variant="xs" color={theme.textTertiary} style={{ marginTop: 2 }}>
                {step.farmSub}
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
    paddingVertical: Spacing.xs,
  },
  stepContainer: {
    alignItems: 'flex-start',
    minHeight: 56,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginVertical: 2,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 4,
  },
  cancelledContainer: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
