import { Link, Stack } from "expo-router";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function LogsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Logs",
          headerRight: () => {
            return (
              <View>
                <Link href="/logs/add">
                  <MaterialCommunityIcons name="plus" size={24} color="black" />
                </Link>
              </View>
            );
          }
        }}
      />
      <Stack.Screen name="[logId]" options={{ headerTitle: "Log Details" }} />
      <Stack.Screen name="add" options={{ presentation: "modal" }} />
      <Stack.Screen name="edit" options={{ presentation: "modal" }} />
    </Stack>
  );
}
