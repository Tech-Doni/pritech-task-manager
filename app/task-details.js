import { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import EmptyState from "@/components/EmptyState";
import { deleteTask, getTaskById, updateTask } from "@/utils/storage";

function formatCreatedDate(createdAt) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const routeId = Array.isArray(id) ? id[0] : id;
  const taskId =
    typeof routeId === "string" && routeId.trim() ? routeId.trim() : null;
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadTask() {
        setIsLoading(true);
        setTask(null);
        const storedTask = taskId ? await getTaskById(taskId) : null;

        if (isActive) {
          setTask(storedTask);
          setIsLoading(false);
        }
      }

      loadTask();

      return () => {
        isActive = false;
      };
    }, [taskId]),
  );

  function returnToTasks() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  async function handleToggle() {
    if (!task) {
      return;
    }

    const updatedTask = { ...task, completed: !task.completed };

    setTask(updatedTask);
    await updateTask(updatedTask);
  }

  async function handleDelete() {
    if (!task || isDeleting) {
      return;
    }

    const taskIdToDelete = task.id;

    setIsDeleting(true);
    await deleteTask(taskIdToDelete);
    returnToTasks();
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color="#2563EB" size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Task not found."
          message="Return to My Tasks and choose an available task."
        />
        <Pressable
          accessibilityRole="button"
          onPress={returnToTasks}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Back to My Tasks</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>TITLE</Text>
        <Text style={styles.title}>{task.title}</Text>

        <Text style={styles.label}>DESCRIPTION</Text>
        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.label}>STATUS</Text>
            <Text
              style={[
                styles.status,
                task.completed && styles.completedStatus,
              ]}
            >
              {task.completed ? "Completed" : "Pending"}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>CREATED</Text>
            <Text style={styles.date}>{formatCreatedDate(task.createdAt)}</Text>
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={handleToggle}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>
          Mark as {task.completed ? "Pending" : "Completed"}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        disabled={isDeleting}
        onPress={handleDelete}
        style={[styles.deleteButton, isDeleting && styles.disabledButton]}
      >
        <Text style={styles.deleteButtonText}>
          {isDeleting ? "Deleting..." : "Delete Task"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 24 },
  centered: { alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20 },
  label: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    color: "#0F172A",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
  },
  description: {
    color: "#475569",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  status: { color: "#D97706", fontSize: 15, fontWeight: "700" },
  completedStatus: { color: "#16A34A" },
  dateContainer: { alignItems: "flex-end" },
  date: { color: "#475569", fontSize: 15 },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    marginTop: 12,
    padding: 15,
  },
  deleteButtonText: { color: "#DC2626", fontSize: 15, fontWeight: "700" },
  disabledButton: { opacity: 0.6 },
});
