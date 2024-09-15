// import { Link } from "expo-router";
import { Link } from "expo-router";
import {
  Text,
  SafeAreaView,
  SectionList,
  View,
  StyleSheet
} from "react-native";
import { formatDate, formatTime } from "@/lib/utils";
import { getLogsGroupedByDay, GroupedLogs } from "@/lib/model/log";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";

export default function LogsIndex() {
  const [groupedLogs, setGroupedLogs] = useState<GroupedLogs[]>([]);

  useEffect(() => {
    async function getLogs() {
      const logs = await getLogsGroupedByDay();
      setGroupedLogs(logs);
    }
    console.debug("Getting logs in logs/index effect");
    getLogs();
  }, []);

  let content = <></>;
  if (groupedLogs.length == 0) {
    content = <Spinner />;
  } else {
    content = (
      <SectionList
        sections={groupedLogs}
        keyExtractor={(log) => log.logId}
        renderItem={({ item }) => (
          <Link href={`/logs/${item.logId}`}>
            <View style={styles.item}>
              <Text>{formatTime(item.date)}</Text>
              <Text style={styles.itemText}>{item.activity.name}</Text>
            </View>
          </Link>
        )}
        renderSectionHeader={({ section: { day } }) => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{formatDate(new Date(day))}</Text>
          </View>
        )}
      />
    );
  }

  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10
  },
  header: {
    padding: 7,
    marginTop: 7,
    borderTopWidth: 2,
    borderBottomWidth: 0.5,
    borderColor: "lightgray",
    backgroundColor: "rgba(255 255 255 / 0.8)"
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18
  },
  item: {
    padding: 5,
    marginBottom: 5
  },
  itemText: {
    fontSize: 18
  }
});
