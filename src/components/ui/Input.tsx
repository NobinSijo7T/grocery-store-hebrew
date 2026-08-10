// ============================================================
// Input Component
// ============================================================

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { Text } from './Text';
import { useThemeColor } from '@/hooks/useThemeColor';
import { BorderRadius, Spacing, Typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export function Input({
  label,
  error,
  icon,
  style,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useThemeColor();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text variant="sm" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: error ? theme.error : isFocused ? theme.primary : theme.border,
          },
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? theme.primary : theme.textTertiary}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
              fontFamily: Typography.fontFamily.regular,
              fontSize: Typography.fontSize.md,
            },
            style,
          ]}
          placeholderTextColor={theme.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          textAlign="right" // Force RTL alignment for input text
          {...props}
        />
      </View>

      {error && (
        <Text variant="xs" color={theme.error} style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    height: 48,
    paddingHorizontal: Spacing.md,
  },
  icon: {
    marginEnd: Spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  error: {
    marginTop: Spacing.xs,
  },
});
