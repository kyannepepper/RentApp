// components/AddButton.tsx
import { Plus } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";




type AddButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  size?: number;      // optional: override button size
  color?: string;     // optional: override button color
};

export default function AddButton({
  onPress,
  style,
  size = 60,
  color = "#F7931E", // orange like your screenshot
}: AddButtonProps) {

    
  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Add"
        style={({ pressed }) => [
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
      >
        <Plus size={28} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // positioned to float above a bottom nav bar by default
  wrapper: {
    position: "absolute",
    right: 24,
    bottom: 130,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    ...(Platform.OS === "android" ? { elevation: 6 } : null),
  },
});
