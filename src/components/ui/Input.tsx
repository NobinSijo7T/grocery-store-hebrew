// ============================================================
// Input Component — Organic Farm Form Field
// ============================================================

import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    icon,
    style,
    onFocus,
    onBlur,
    textAlign: customTextAlign,
    editable = true,
    ...props
  },
  ref
) {
  const theme = useThemeColor();
  const { language } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => inputRef.current as TextInput);

  const isRTL = language === 'he';
  const resolvedTextAlign = customTextAlign || (isRTL ? 'right' : 'left');

  const handleFocus: TextInputProps['onFocus'] = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputProps['onBlur'] = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const focusInput = () => {
    if (!editable) return;
    inputRef.current?.focus();
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Pressable onPress={focusInput} disabled={!editable}>
          <Text
            variant="sm"
            weight="semiBold"
            color={isFocused ? theme.primary : theme.text}
            style={[styles.label, { textAlign: resolvedTextAlign }]}
          >
            {label}
          </Text>
        </Pressable>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: error ? theme.error : isFocused ? theme.primary : theme.border,
            borderWidth: 1.5,
            ...(Platform.OS === 'ios' && isFocused ? Shadows.sm : {}),
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {icon && (
          <Pressable
            onPress={focusInput}
            hitSlop={8}
            disabled={!editable}
            style={isRTL ? { marginLeft: Spacing.sm } : { marginRight: Spacing.sm }}
          >
            <MaterialIcons
              name={icon}
              size={22}
              color={error ? theme.error : isFocused ? theme.primary : theme.textTertiary}
            />
          </Pressable>
        )}

        <TextInput
          ref={inputRef}
          {...props}
          editable={editable}
          style={[
            styles.input,
            {
              color: theme.text,
              fontFamily: Typography.fontFamily.regular,
              fontSize: Typography.fontSize.md,
              textAlign: resolvedTextAlign,
            },
            style,
          ]}
          placeholderTextColor={theme.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={props.autoCapitalize ?? 'none'}
          autoCorrect={props.autoCorrect ?? false}
          keyboardAppearance={theme.text === '#FEFEF7' ? 'dark' : 'light'}
        />
      </View>

      {error && (
        <Text
          variant="xs"
          color={theme.error}
          style={[styles.error, { textAlign: resolvedTextAlign }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    height: 52,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: Platform.OS === 'android' ? 0 : 0,
  },
  error: {
    marginTop: Spacing.xs,
  },
});
