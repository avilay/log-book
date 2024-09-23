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
import Item from "@/components/Item";

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
        style: "destructive",
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
        <Item label="Timestamp:">
          <Text>
            {formatDate(log.date)} {formatTime(log.date)}
          </Text>
        </Item>

        <Item label="Activity:">
          <Text>{log.activity.name}</Text>
        </Item>

        <Item label="Notes:">
          <Text>{log.notes}</Text>
        </Item>
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
  delete: {
    color: "red",
    fontSize: 18,
    flexGrow: 0,
    alignSelf: "center",
    paddingBottom: 20
  }
});
