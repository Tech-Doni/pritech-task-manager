import { Pressable, StyleSheet, Text } from "react-native";

export default function FilterButton({
  label,
  isActive = false,
  onPress,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      style={[styles.button, isActive && styles.activeButton]}
    >
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E2E8F0",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  activeButton: { backgroundColor: "#2563EB" },
  label: { color: "#334155", fontSize: 14, fontWeight: "600" },
  activeLabel: { color: "#FFFFFF" },
});
