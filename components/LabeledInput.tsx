import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  textarea?: boolean;
};

export default function LabeledInput({ label, textarea, style, ...rest }: Props) {

  return (
    <View>
      <Text style={[styles.label]}>{label}</Text>
      <TextInput
        multiline={textarea}
        numberOfLines={textarea ? 5 : 1}
        style={[
          textarea ? styles.textarea : styles.input,
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
  },
  textarea: {
    minHeight: 105,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginTop: 10,
    width: "100%",
    textAlignVertical: "top", // ensures top alignment on Android
  },
});
