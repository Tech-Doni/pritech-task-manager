import { Pressable, StyleSheet, Text, View } from "react-native";

function formatCreatedDate(createdAt) {
  const date = new Date(createdAt);

  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleDateString();
}

export default function TaskItem({ task, onPress, onToggle, onDelete }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(task)}
      style={styles.container}
    >
      <Text style={[styles.title, task.completed && styles.completedTitle]}>
        {task.title}
      </Text>
      {task.description ? (
        <Text numberOfLines={2} style={styles.description}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.metaRow}>
        <Text
          style={[
            styles.statusText,
            task.completed && styles.completedStatusText,
          ]}
        >
          {task.completed ? "Completed" : "Pending"}
        </Text>
        <Text style={styles.date}>{formatCreatedDate(task.createdAt)}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            onToggle(task);
          }}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>
            Mark {task.completed ? "Pending" : "Completed"}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            onDelete(task.id);
          }}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  title: { color: "#0F172A", fontSize: 16, fontWeight: "600" },
  completedTitle: {
    color: "#94A3B8",
    textDecorationLine: "line-through",
  },
  description: { color: "#64748B", fontSize: 14, marginTop: 4 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statusText: { color: "#D97706", fontSize: 12, fontWeight: "700" },
  completedStatusText: { color: "#16A34A" },
  date: { color: "#94A3B8", fontSize: 12 },
  actions: { flexDirection: "row", gap: 8, marginTop: 14 },
  actionButton: {
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionText: { color: "#2563EB", fontSize: 12, fontWeight: "600" },
  deleteButton: { backgroundColor: "#FEF2F2" },
  deleteText: { color: "#DC2626" },
});
