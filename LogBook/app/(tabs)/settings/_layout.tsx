import { Stack } from "expo-router";

export default function SettingsLayout() {
  const debugScreen = (
    <Stack.Screen name="debug" options={{ headerTitle: "Debug" }} />
  );

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Settings"
        }}
      />
      {process.env.EXPO_PUBLIC_ENV === "dev" ? debugScreen : <></>}
      {/* <Stack.Screen name="add" options={{ presentation: "modal" }} /> */}
    </Stack>
  );
}
