import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Tasks" }} />
      <Stack.Screen name="add-task" options={{ title: "Add Task" }} />
      <Stack.Screen name="task-details" options={{ title: "Task Details" }} />
    </Stack>
  );
}
