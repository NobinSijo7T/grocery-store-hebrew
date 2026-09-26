// ============================================================
// Input Component — Organic Farm Form Field
// ============================================================

import { BorderRadius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from '@/hooks/useTranslation';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    TextInput,
    type NativeSyntheticEvent,
    type TextInputFocusEventData,
    type TextInputProps,
} from 'react-native';
import { Text } from './Text';

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
  textAlign: customTextAlign,
  editable = true,
  ...props
}: InputProps) {
  const theme = useThemeColor();
  const { language } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

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

  // Programmatic focus — ensures taps on any part of the container still
  // focus the TextInput even if gesture-handler overlays are intercepting.
  const focusInput = () => {
    if (!editable) return;
    inputRef.current?.focus();
  };

  return (
    <Pressable style={styles.wrapper} onPress={focusInput}>
      {label && (
        <Text
          variant="sm"
          weight="semiBold"
          color={isFocused ? theme.primary : theme.text}
          style={[styles.label, { textAlign: resolvedTextAlign }]}
        >
          {label}
        </Text>
      )}

      <Pressable
        onPress={focusInput}
        style={({ pressed }) => [
          styles.inputContainer,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: error ? theme.error : isFocused ? theme.primary : theme.border,
            borderWidth: isFocused || error ? 1.5 : 1,
            opacity: pressed && editable ? 0.95 : 1,
            ...(isFocused ? Shadows.sm : {}),
            shadowColor: isFocused ? theme.primary : undefined,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={22}
            color={error ? theme.error : isFocused ? theme.primary : theme.textTertiary}
            style={isRTL ? { marginLeft: Spacing.sm } : { marginRight: Spacing.sm }}
          />
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
          autoCapitalize="none"
          autoCorrect={false}
          keyboardAppearance={theme.text === '#FEFEF7' ? 'dark' : 'light'}
          pointerEvents={editable ? 'auto' : 'none'}
        />
      </Pressable>

      {error && (
        <Text
          variant="xs"
          color={theme.error}
          style={[styles.error, { textAlign: resolvedTextAlign }]}
        >
          {error}
        </Text>
      )}
    </Pressable>
  );
}

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
  },
  error: {
    marginTop: Spacing.xs,
  },
});
