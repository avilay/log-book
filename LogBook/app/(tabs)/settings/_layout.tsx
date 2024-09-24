import { Stack } from "expo-router";

function DebugSettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Settings"
        }}
      />
      <Stack.Screen name="debug" options={{ headerTitle: "Debug" }} />
    </Stack>
  );
}

export default function SettingsLayout() {
  if (process.env.EXPO_PUBLIC_ENV === "dev") {
    return <DebugSettingsLayout />;
  } else {
    return (
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Settings"
          }}
        />
        {/* <Stack.Screen name="add" options={{ presentation: "modal" }} /> */}
      </Stack>
    );
  }
}
