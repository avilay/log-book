import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View, Text, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen
        name="logs"
        options={{
          title: "Logs",
          tabBarLabel: () => {
            return (
              <View style={styles.label}>
                <Text>Logs</Text>
              </View>
            );
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "book-edit" : "book-edit-outline"}
              size={24}
            />
          )
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Activities",
          tabBarLabel: () => {
            return (
              <View style={styles.label}>
                <Text>Activities</Text>
              </View>
            );
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "lightning-bolt" : "lightning-bolt-outline"}
              size={24}
            />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: () => {
            return (
              <View style={styles.label}>
                <Text>Settings</Text>
              </View>
            );
          },
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "cog" : "cog-outline"}
              size={24}
            />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 5
  }
});
