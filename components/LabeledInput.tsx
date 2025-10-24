import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  textarea?: boolean;
  description?: string;
  required?: boolean;
};

export default function LabeledInput({ 
  label, 
  textarea, 
  style, 
  description,
  required = false,
  ...rest 
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <TextInput
        multiline={textarea}
        numberOfLines={textarea ? 4 : 1}
        style={[
          textarea ? styles.textarea : styles.input,
          style,
        ]}
        placeholderTextColor="#9ca3af"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  required: {
    color: "#dc2626",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
    lineHeight: 18,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
});
