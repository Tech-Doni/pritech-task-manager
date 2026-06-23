import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import EmptyState from "@/components/EmptyState";
import FilterButton from "@/components/FilterButton";
import TaskItem from "@/components/TaskItem";
import { deleteTask, getTasks, updateTask } from "@/utils/storage";

const FILTERS = ["All", "Pending", "Completed"];
const QUOTE_API_URL = "https://api.quotable.io/random";
const FALLBACK_QUOTE = "Stay focused and complete your tasks today.";

export default function TaskListScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [motivation, setMotivation] = useState("");
  const [isMotivationLoading, setIsMotivationLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    async function loadMotivation() {
      try {
        const response = await fetch(QUOTE_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Quote request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (typeof data.content !== "string" || !data.content.trim()) {
          throw new Error("Quote response did not include valid content");
        }

        if (isActive) {
          setMotivation(data.content.trim());
        }
      } catch {
        if (isActive) {
          setMotivation(FALLBACK_QUOTE);
        }
      } finally {
        clearTimeout(timeout);

        if (isActive) {
          setIsMotivationLoading(false);
        }
      }
    }

    loadMotivation();

    return () => {
      isActive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadTasks() {
        setIsLoading(true);
        const storedTasks = await getTasks();

        if (isActive) {
          setTasks(storedTasks);
          setIsLoading(false);
        }
      }

      loadTasks();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const visibleTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Pending" && !task.completed) ||
        (activeFilter === "Completed" && task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchQuery, tasks]);

  async function handleToggle(task) {
    const updatedTask = { ...task, completed: !task.completed };

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? updatedTask : currentTask,
      ),
    );
    await updateTask(updatedTask);
  }

  async function handleDelete(taskId) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
    await deleteTask(taskId);
  }

  function openTaskDetails(task) {
    router.push(`/task-details?id=${encodeURIComponent(task.id)}`);
  }

  function renderEmptyState() {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#2563EB" size="large" />
        </View>
      );
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          title="No tasks yet"
          message="Create your first task to get started."
        />
      );
    }

    return (
      <EmptyState
        title="No matching tasks"
        message="Try changing your search or selected filter."
      />
    );
  }

  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>TASK MANAGER</Text>
            <Text style={styles.title}>My Tasks</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/add-task")}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add Task</Text>
          </Pressable>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteLabel}>DAILY MOTIVATION</Text>
          <Text style={styles.quoteText}>
            {isMotivationLoading ? "Loading motivation..." : motivation}
          </Text>
        </View>

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setSearchQuery}
          placeholder="Search tasks by title"
          placeholderTextColor="#94A3B8"
          returnKeyType="search"
          style={styles.searchInput}
          value={searchQuery}
        />

        <View style={styles.filters}>
          {FILTERS.map((filter) => (
            <FilterButton
              key={filter}
              label={filter}
              isActive={filter === activeFilter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </View>

        <FlatList
          contentContainerStyle={
            visibleTasks.length === 0
              ? styles.emptyListContent
              : styles.listContent
          }
          data={visibleTasks}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          keyExtractor={(task) => task.id}
          ListEmptyComponent={renderEmptyState}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onDelete={handleDelete}
              onPress={openTaskDetails}
              onToggle={handleToggle}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  eyebrow: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  title: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  quoteCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    marginBottom: 20,
    padding: 16,
  },
  quoteLabel: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  quoteText: {
    color: "#475569",
    fontSize: 15,
    marginTop: 6,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  listContent: { paddingBottom: 24 },
  emptyListContent: { flexGrow: 1 },
  separator: { height: 12 },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 32,
  },
});
