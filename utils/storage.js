import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_STORAGE_KEY = "@task-manager/tasks";

export async function getTasks() {
  try {
    const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];

    return Array.isArray(parsedTasks) ? parsedTasks : [];
  } catch (error) {
    console.error("Unable to read tasks from storage:", error);
    return [];
  }
}

export async function saveTasks(tasks) {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Unable to save tasks:", error);
  }
}

export async function addTask(task) {
  try {
    const tasks = await getTasks();
    await saveTasks([...tasks, task]);
  } catch (error) {
    console.error("Unable to add task:", error);
  }
}

export async function updateTask(updatedTask) {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
    await saveTasks(updatedTasks);
  } catch (error) {
    console.error("Unable to update task:", error);
  }
}

export async function deleteTask(taskId) {
  try {
    const tasks = await getTasks();
    await saveTasks(tasks.filter((task) => task.id !== taskId));
  } catch (error) {
    console.error("Unable to delete task:", error);
  }
}

export async function getTaskById(taskId) {
  try {
    const tasks = await getTasks();
    return tasks.find((task) => task.id === taskId) ?? null;
  } catch (error) {
    console.error("Unable to find task:", error);
    return null;
  }
}
