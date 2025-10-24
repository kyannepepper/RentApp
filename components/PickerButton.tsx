// components/PickerButton.tsx
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PickerButtonProps {
  label: string;
  value: string;
  placeholder?: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function PickerButton({
  label,
  value,
  placeholder = 'Select an option',
  onPress,
  disabled = false,
}: PickerButtonProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.button, disabled && styles.disabledButton]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[styles.text, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color="#6b7280" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  text: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
});
