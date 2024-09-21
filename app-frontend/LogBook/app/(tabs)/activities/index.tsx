import Spinner from "@/components/Spinner";
import { Activity, getActivities } from "@/lib/model/activity";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

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
  const [activities, setActivities] = useState<Activity[]>([]);

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

  return (
    <SafeAreaView style={styles.container}>
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
  }
});
