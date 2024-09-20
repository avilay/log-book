// import { Link } from "expo-router";
import { Link, useFocusEffect } from "expo-router";
import {
  Text,
  SafeAreaView,
  SectionList,
  View,
  StyleSheet
} from "react-native";
import { formatDate, formatTime } from "@/lib/utils";
import { getLogsGroupedByDay, Log } from "@/lib/model/log";
import { useCallback, useState } from "react";
import Spinner from "@/components/Spinner";

type SectionedLogs = {
  day: string;
  data: Log[];
};

export default function LogsIndex() {
  const [sectionedLogs, setSectionedLogs] = useState<SectionedLogs[]>([]);

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      async function getLogs() {
        const glogs = await getLogsGroupedByDay();
        if (!ignore) {
          const slogs: SectionedLogs[] = glogs.map((groupedLog) => {
            return {
              day: groupedLog.day.toString(),
              data: groupedLog.logs
            };
          });
          setSectionedLogs(slogs);
        }
      }
      getLogs();

      return () => {
        ignore = true;
      };
    }, [])
  );

  let content = <></>;
  if (sectionedLogs.length == 0) {
    content = <Spinner />;
  } else {
    content = (
      <SectionList
        sections={sectionedLogs}
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
    paddingLeft: 15,
    paddingTop: 10
  },
  itemText: {
    // fontSize: 18
  }
});
