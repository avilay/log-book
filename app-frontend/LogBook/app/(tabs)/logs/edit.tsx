import HeaderNavText from "@/components/HeaderNavText";
import MultiLineTextInput from "@/components/MultiLineTextInput";
import Spinner from "@/components/Spinner";
import { Activity, getActivities } from "@/lib/model/activity";
import { editLog, getLog, Log } from "@/lib/model/log";
import { Dropdown } from "react-native-element-dropdown";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams
} from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, Pressable, View, StyleSheet, Text } from "react-native";
import RNDateTimePicker from "undefined";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type EditFormProps = {
  log: Log;
  onLogChange: (log: Log) => void;
};

function EditForm({ log, onLogChange }: EditFormProps) {
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

  return (
    <KeyboardAwareScrollView>
      <View style={styles.item}>
        <Text style={styles.label}>Timestamp:</Text>
        <RNDateTimePicker
          mode="datetime"
          value={log.date}
          onChange={(e, date) => {
            const editedLog = {
              logId: log.logId,
              date: date as Date,
              activity: log.activity,
              notes: log.notes
            };
            onLogChange(editedLog);
          }}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Activity:</Text>
        <Dropdown
          data={activities}
          labelField="name"
          valueField="activityId"
          value={allActivities.get(log.activity.activityId)}
          onChange={(item) => {
            const editedLog = {
              logId: log.logId,
              date: log.date,
              activity: item,
              notes: log.notes
            };
            onLogChange(editedLog);
          }}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Notes:</Text>
        <MultiLineTextInput
          value={log.notes ?? ""}
          onInputDone={(value) => {
            const editedLog = {
              logId: log.logId,
              date: log.date,
              activity: log.activity,
              notes: value
            };
            onLogChange(editedLog);
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

export default function EditLog() {
  const { logId }: { logId: string } = useLocalSearchParams();

  const [log, setLog] = useState<Log | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      async function _getLog() {
        const _log = await getLog(logId);
        if (!ignore) {
          setLog(_log);
        }
      }
      _getLog();

      return () => {
        ignore = true;
      };
    }, [logId])
  );

  async function onSave() {
    await editLog(log!);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          // presentation only works when specified in _layout
          // presentation: "modal",
          headerTitle: "Edit Log",
          headerLeft: () => {
            return (
              <Pressable
                onPress={() => {
                  router.back();
                }}
              >
                <HeaderNavText>Cancel</HeaderNavText>
              </Pressable>
            );
          },
          headerRight: () => {
            return (
              <Pressable onPress={onSave}>
                <HeaderNavText>Save</HeaderNavText>
              </Pressable>
            );
          }
        }}
      />
      {log ? <EditForm log={log} onLogChange={setLog} /> : <Spinner />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    alignItems: "flex-start"
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 7
  },
  item: {
    marginTop: 20,
    marginBottom: 30
  }
});
