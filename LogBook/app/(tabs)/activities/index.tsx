import Spinner from "@/components/Spinner";
import { Activity, getActivities } from "@/lib/model/activity";
import { countLogs } from "@/lib/model/log";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <FlatList
      data={activities}
      renderItem={({ item }) => (
        <Link href={`/activities/${item.activityId}`}>
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        </Link>
      )}
      keyExtractor={(item) => item.activityId}
    />
  );
}

export default function ActivityIndex() {
  const [activities, setActivities] = useState<Activity[] | null>(null);

  const [showTut1, setShowTut1] = useState(false);
  const [showTut2, setShowTut2] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      async function _getActivities() {
        const _activities = await getActivities();
        const _numLogs = await countLogs();
        const isTut1Shown = await AsyncStorage.getItem(
          "is_activity_tut1_shown"
        );
        const isTut2Shown = await AsyncStorage.getItem(
          "is_activity_tut2_shown"
        );
        if (!ignore) {
          setActivities(_activities);
          if (_activities.length == 0 && !isTut1Shown) {
            setShowTut1(true);
            setShowTut2(false);
            AsyncStorage.setItem("is_activity_tut1_shown", "true");
          } else if (_activities.length > 0 && _numLogs == 0 && !isTut2Shown) {
            setShowTut1(false);
            setShowTut2(true);
            AsyncStorage.setItem("is_activity_tut2_shown", "true");
          }
        }
      }
      _getActivities();

      return () => {
        ignore = true;
      };
    }, [])
  );

  const tutorialNoActivities = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTut1}
      onRequestClose={() => {
        setShowTut1(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            You are in the{" "}
            <Text style={{ fontStyle: "italic" }}>Activities</Text> tab
            <MaterialCommunityIcons name="lightning-bolt" size={24} />.
          </Text>
          <Text style={styles.modalText}>
            Tap
            <MaterialCommunityIcons name="plus" size={24} color="black" />
            on the upper right to add activities you can track.
          </Text>
          <Button
            title="Got it!"
            onPress={() => {
              setShowTut1(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );

  const tutorialNoLogs = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTut2}
      onRequestClose={() => {
        setShowTut2(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Good job on adding an activity. You can continue to add more
            activities, or head over to the{" "}
            <Text style={{ fontStyle: "italic" }}>Logs</Text> tab to log these
            activities as you do them.
          </Text>
          <Text style={styles.modalText}>
            <Text style={{ fontStyle: "italic" }}>Logs</Text> tab
            <MaterialCommunityIcons name="book-edit-outline" size={24} /> is on
            the bottom left.
          </Text>
          <Button
            title="Got it!"
            onPress={() => {
              setShowTut2(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {tutorialNoActivities}
      {tutorialNoLogs}
      {activities ? <ActivityList activities={activities} /> : <Spinner />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    marginTop: 15
  },
  item: {
    paddingLeft: 15,
    paddingTop: 10,
    marginVertical: 10
  },
  modalText: {
    marginVertical: 10,
    textAlign: "center"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(131, 126, 129, 0.5)"
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
