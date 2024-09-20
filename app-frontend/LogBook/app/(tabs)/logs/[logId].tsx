import {
  Link,
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams
} from "expo-router";
import { useCallback, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  Alert
} from "react-native";
import { Log, deleteLog, getLog } from "@/lib/model/log";
import Spinner from "@/components/Spinner";
import { formatDate, formatTime } from "@/lib/utils";
import HeaderNavText from "@/components/HeaderNavText";
import { styles as headerNavTextStyles } from "@/components/HeaderNavText";

export default function LogsShow() {
  const { logId } = useLocalSearchParams<{ logId: string }>();

  const [log, setLog] = useState<Log | null>(null);

  function handleDelete() {
    Alert.alert("Are you sure?", "You will lose this log completely.", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Yes. Delete!",
        onPress: async () => {
          await deleteLog(logId);
          router.back();
        }
      }
    ]);
  }

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
    }, [])
  );

  let content = <></>;
  if (!log) {
    content = <Spinner />;
  } else {
    content = (
      <View style={{ flexGrow: 1 }}>
        <View style={styles.item}>
          <Text style={styles.label}>Timestamp:</Text>
          <Text>
            {formatDate(log.date)} {formatTime(log.date)}
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Activity:</Text>
          <Text>{log.activity.name}</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Notes:</Text>
          <Text>{log.notes}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Log Details",
          headerBackTitleStyle: {
            fontSize: headerNavTextStyles.headerLink.fontSize
          },
          headerRight: () => {
            return (
              <View>
                <Link href={`/logs/edit?logId=${logId}`}>
                  <HeaderNavText>Edit</HeaderNavText>
                </Link>
              </View>
            );
          }
        }}
      />
      {content}
      <Pressable onPress={handleDelete}>
        <Text style={styles.delete}>Delete Log</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 7
  },
  item: {
    marginTop: 20,
    marginBottom: 30
  },
  delete: {
    color: "red",
    fontSize: 18,
    flexGrow: 0,
    alignSelf: "center",
    paddingBottom: 20
  }
});
