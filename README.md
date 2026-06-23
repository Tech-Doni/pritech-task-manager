# Pritech Task Manager

A clean and lightweight mobile task manager built with Expo and React Native. It allows users to create, organize, review, and complete personal tasks while keeping their data available between app sessions.

## Features

* Create tasks with a required title and description
* View all tasks in a task list screen
* Open a simple task details screen
* Mark tasks as completed or pending
* Delete tasks from the list or details screen
* Search tasks by title
* Filter tasks by All, Pending, or Completed status
* Helpful loading, validation, not-found, and empty states
* Daily motivational quote with an offline fallback
* Stack navigation powered by Expo Router

## Bonus Features

* Persistent on-device task storage using AsyncStorage
* Search tasks by title
* Filter tasks by status
* Simple navigation between screens
* Keyboard-aware forms and keyboard dismissal
* Focus-based task refresh after navigation

## Technologies Used

* JavaScript
* React Native
* Expo SDK 54
* Expo Router
* React hooks and functional components
* AsyncStorage

## Public API

The My Tasks screen fetches a daily motivational quote from the Quotable API:

https://api.quotable.io/random

If the request fails, the app displays a built-in fallback message so the screen remains useful offline.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/Tech-Doni/pritech-task-manager.git
   ```

2. Open the project folder:

   ```bash
   cd pritech-task-manager
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the Expo development server:

   ```bash
   npx expo start
   ```

5. Follow the terminal instructions to open the app in Expo Go, an Android emulator, an iOS simulator, or a web browser.

## Implementation Notes

The app uses file-based Expo Router screens for the task list, task creation, and task details. Shared task cards, filter buttons, and empty states are stored in the `components` folder, while persistence helpers are stored in the `utils` folder.

Tasks are stored locally on the device using `@react-native-async-storage/async-storage`. Each task includes an ID, title, description, completion status, and creation date.

## Screenshots / Demo

A short screen recording will be attached separately with the submission email.