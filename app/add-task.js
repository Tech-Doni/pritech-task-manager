import { useState } from "react";
import { useRouter } from "expo-router";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { addTask } from "@/utils/storage";

export default function AddTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const nextErrors = {};

    if (!trimmedTitle) {
      nextErrors.title = "Please enter a task title.";
    }

    if (!trimmedDescription) {
      nextErrors.description = "Please enter a task description.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSaving(true);

    const task = {
      id: Date.now().toString(),
      title: trimmedTitle,
      description: trimmedDescription,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    await addTask(task);

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }

  return (
    <TouchableWithoutFeedback
      accessible={false}
      onPress={Keyboard.dismiss}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add a New Task</Text>
          <Text style={styles.message}>
            Add a title and description to keep your task clear and actionable.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              autoCapitalize="sentences"
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#94A3B8"
              returnKeyType="next"
              style={[styles.input, errors.title && styles.inputError]}
              value={title}
            />
            {errors.title ? (
              <Text style={styles.errorText}>{errors.title}</Text>
            ) : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              multiline
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#94A3B8"
              style={[
                styles.input,
                styles.descriptionInput,
                errors.description && styles.inputError,
              ]}
              textAlignVertical="top"
              value={description}
            />
            {errors.description ? (
              <Text style={styles.errorText}>{errors.description}</Text>
            ) : null}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
              isSaving && styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {isSaving ? "Saving..." : "Add Task"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flexGrow: 1, padding: 24 },
  title: { color: "#0F172A", fontSize: 28, fontWeight: "700" },
  message: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
    marginTop: 8,
  },
  field: { marginBottom: 20 },
  label: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    borderWidth: 1,
    color: "#0F172A",
    fontSize: 16,
    padding: 14,
  },
  inputError: { borderColor: "#DC2626" },
  descriptionInput: {
    height: 120,
  },
  errorText: { color: "#DC2626", fontSize: 13, marginTop: 6 },
  submitButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 10,
    marginTop: 4,
    padding: 16,
  },
  submitButtonPressed: { backgroundColor: "#1D4ED8" },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
