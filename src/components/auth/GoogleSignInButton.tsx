// ============================================================
// GoogleSignInButton Component
// ============================================================
// Clean, brand-compliant Google Sign-In button with organic farm styling.

import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Text } from '@/components/ui/Text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GoogleSignInButton({
  onPress,
  loading = false,
  disabled = false,
}: GoogleSignInButtonProps) {
  const theme = useThemeColor();
  const { t, isRTL } = useTranslation();

  const handlePress = () => {
    if (loading || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const flexDirection = isRTL ? 'row-reverse' : 'row';

  return (
    <AnimatedPressable
      onPress={handlePress}
      disabled={loading || disabled}
      style={[
        styles.button,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={t.auth.continueWithGoogle}
    >
      <View style={[styles.content, { flexDirection }]}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <>
            <Image
              source={require('../../../assets/images/google.svg')}
              style={styles.logo}
              contentFit="contain"
            />
            <Text
              variant="md"
              weight="semiBold"
              style={[styles.text, { color: theme.text }]}
            >
              {t.auth.continueWithGoogle}
            </Text>
          </>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: Spacing.sm,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  logo: {
    width: 22,
    height: 22,
  },
  text: {
    letterSpacing: 0.2,
  },
});
