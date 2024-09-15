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

export default function LogsIndex() {
  const [groupedLogs, setGroupedLogs] = useState<GroupedLogs[]>([]);

  useEffect(() => {
    async function getLogs() {
      const logs = await getLogsGroupedByDay();
      setGroupedLogs(logs);
    }

    getLogs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={groupedLogs}
        keyExtractor={(log, idx) => (log.logId + idx).toString()}
        renderItem={({ item }) => (
          <Link href={`/logs/${item.logId}`}>
            <View style={styles.item}>
              <Text>{formatTime(item.date)}</Text>
              <Text style={styles.itemText}>{item.activity}</Text>
            </View>
          </Link>
        )}
        renderSectionHeader={({ section: { day } }) => (
          <View style={styles.header}>
            <Text style={styles.headerText}>{formatDate(new Date(day))}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
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
