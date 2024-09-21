import { Link, Stack } from "expo-router";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function LogsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Activities",
          headerRight: () => {
            return (
              <View>
                <Link href="/activities/add">
                  <MaterialCommunityIcons name="plus" size={24} color="black" />
                </Link>
              </View>
            );
          }
        }}
      />
      {/* <Stack.Screen name="[logId]" options={{headerTitle: "Activity"}} /> */}
      <Stack.Screen name="add" options={{ presentation: "modal" }} />
      <Stack.Screen name="edit" options={{ presentation: "modal" }} />
    </Stack>
  );
}
