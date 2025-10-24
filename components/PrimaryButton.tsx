// components/PrimaryButton.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'success' | 'danger';
}

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  variant = 'primary',
}: PrimaryButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (variant === 'success') {
      baseStyle.push(styles.successButton);
    } else if (variant === 'danger') {
      baseStyle.push(styles.dangerButton);
    } else {
      baseStyle.push(styles.primaryButton);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !disabled && !loading && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text style={[styles.text, (disabled || loading) && styles.disabledText]}>
        {loading ? 'Processing...' : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  successButton: {
    backgroundColor: '#16a34a',
  },
  dangerButton: {
    backgroundColor: '#dc2626',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#e5e7eb',
  },
});
