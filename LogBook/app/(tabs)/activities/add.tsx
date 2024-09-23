import HeaderNavText from "@/components/HeaderNavText";
import Item from "@/components/Item";
import { Activity, addActivity } from "@/lib/model/activity";
import { router, Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, SafeAreaView, Pressable, TextInput } from "react-native";

export default function AddActivity() {
  const [activity, setActivity] = useState<Activity>({
    activityId: "",
    name: ""
  });

  function onChangeText(text: string) {
    setActivity({ activityId: activity.activityId, name: text });
  }

  async function onAdd() {
    activity.activityId = new Date().getTime().toString();
    await addActivity(activity);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Add Activity",
          headerLeft: () => {
            return (
              <Pressable onPress={router.back}>
                <HeaderNavText>Cancel</HeaderNavText>
              </Pressable>
            );
          },
          headerRight: () => {
            return (
              <Pressable onPress={onAdd}>
                <HeaderNavText>Add</HeaderNavText>
              </Pressable>
            );
          }
        }}
      />

      <Item label="Name:">
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeText}
          value={activity.name}
        />
      </Item>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    alignItems: "stretch"
  },
  textInput: {
    padding: 5,
    borderColor: "darkgray",
    borderWidth: 1
  }
});
