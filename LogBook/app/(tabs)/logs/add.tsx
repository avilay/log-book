import HeaderNavText from "@/components/HeaderNavText";
import Item from "@/components/Item";
import MultiLineTextInput from "@/components/MultiLineTextInput";
import { Activity, getActivities } from "@/lib/model/activity";
import { addLog, Log } from "@/lib/model/log";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from "undefined";

export default function AddLog() {
  const [log, setLog] = useState<Log>({
    logId: "",
    date: new Date(),
    activity: {
      activityId: "",
      name: ""
    },
    notes: ""
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const allActivities = new Map();

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      async function _getActivities() {
        const _activities = await getActivities();
        if (!ignore) {
          setActivities(_activities);
        }
      }
      _getActivities();

      return () => {
        ignore = true;
      };
    }, [])
  );

  activities.forEach((activity) => {
    allActivities.set(activity.activityId, activity);
  });

  async function onAdd() {
    log.logId = log.date.getTime().toString();
    await addLog(log);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          // presentation only works when specified in _layout
          // presentation: "modal",
          headerTitle: "Add Log",
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

      <KeyboardAwareScrollView extraScrollHeight={50}>
        <Item label="Timestamp:">
          <RNDateTimePicker
            mode="datetime"
            value={log.date}
            onChange={(e, date) => {
              const addedLog = {
                logId: log.logId,
                date: date as Date,
                activity: log.activity,
                notes: log.notes
              };
              setLog(addedLog);
            }}
          />
        </Item>

        <Item label="Activity:">
          <Dropdown
            data={activities}
            labelField="name"
            valueField="activityId"
            value={allActivities.get(log.activity.activityId)}
            onChange={(item) => {
              const addedLog = {
                logId: log.logId,
                date: log.date,
                activity: item,
                notes: log.notes
              };
              setLog(addedLog);
            }}
          />
        </Item>

        <Item label="Notes:">
          <MultiLineTextInput
            value={log.notes ?? ""}
            onChangeText={(value) => {
              const addedLog = {
                logId: log.logId,
                date: log.date,
                activity: log.activity,
                notes: value
              };
              setLog(addedLog);
            }}
          />
        </Item>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    alignItems: "stretch"
  }
});
