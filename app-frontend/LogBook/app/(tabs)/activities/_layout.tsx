import { Stack } from "expo-router";

export default function LogsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Activities" }} />
      <Stack.Screen name="show" options={{ headerTitle: "Activity Details" }} />
      <Stack.Screen name="add" options={{ presentation: "modal" }} />
      <Stack.Screen name="edit" options={{ presentation: "modal" }} />
    </Stack>
  );
}
