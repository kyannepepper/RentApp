// components/SearchBar.tsx
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Search...",
  style
}: SearchBarProps) {
  return (
    <View style={[styles.searchBox, style]} pointerEvents="box-none">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: { 
    fontSize: 16 
  },
});