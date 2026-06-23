import { StyleSheet, Text, View } from "react-native";

export default function EmptyState({
  title = "Nothing here yet",
  message = "New items will appear here.",
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
  },
  icon: { color: "#2563EB", fontSize: 32, fontWeight: "700" },
  title: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },
  message: {
    color: "#64748B",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
});
