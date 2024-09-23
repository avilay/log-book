// import { Link } from "expo-router";
import { Link, useFocusEffect } from "expo-router";
import {
  Text,
  SafeAreaView,
  SectionList,
  View,
  StyleSheet,
  Modal,
  Button
} from "react-native";
import { formatDate, formatTime } from "@/lib/utils";
import { getLogsGroupedByDay, Log } from "@/lib/model/log";
import { useCallback, useState } from "react";
import Spinner from "@/components/Spinner";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type SectionedLogs = {
  day: string;
  data: Log[];
};

function LogsList({ sectionedLogs }: { sectionedLogs: SectionedLogs[] }) {
  return (
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

export default function LogsIndex() {
  const [sectionedLogs, setSectionedLogs] = useState<SectionedLogs[] | null>(
    null
  );
  const [showTutorial, setShowTutorial] = useState(false);

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
          if (slogs.length == 0) {
            setShowTutorial(true);
          }
        }
      }
      getLogs();

      return () => {
        ignore = true;
      };
    }, [])
  );

  const tutorial = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTutorial}
      onRequestClose={() => setShowTutorial(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            You are in the <Text style={{ fontStyle: "italic" }}>Logs</Text> tab
            <MaterialCommunityIcons name="book-edit-outline" size={24} />.
          </Text>
          <Text style={styles.modalText}>
            Tap
            <MaterialCommunityIcons name="plus" size={24} color="black" />
            on the upper right to log activities you have done.
          </Text>
          <Button
            title="Got it!"
            onPress={() => {
              setShowTutorial(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {tutorial}
      {sectionedLogs ? <LogsList sectionedLogs={sectionedLogs} /> : <Spinner />}
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
    paddingLeft: 15,
    paddingTop: 10
  },
  itemText: {
    // fontSize: 18
  },
  modalText: {
    marginVertical: 10,
    textAlign: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    // borderRadius: 20,
    // padding: 35,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});
