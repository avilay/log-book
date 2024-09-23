import {
  Link,
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams
} from "expo-router";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Pressable,
  Alert
} from "react-native";
import HeaderNavText from "@/components/HeaderNavText";
import { styles as headerNavTextStyles } from "@/components/HeaderNavText";
import { Activity, deleteActivity, getActivity } from "@/lib/model/activity";
import { useCallback, useState } from "react";
import Spinner from "@/components/Spinner";
import Item from "@/components/Item";

export default function ActivitiesShow() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);

  useFocusEffect(
    useCallback(() => {
      let ignore = false;

      async function _getActivity() {
        const _activity = await getActivity(activityId);
        if (!ignore) {
          setActivity(_activity);
        }
      }
      _getActivity();

      return () => {
        ignore = true;
      };
    }, [])
  );

  function handleDelete() {
    Alert.alert(
      "Are you sure?",
      "Logs related to this activity will still be visible. You won't be able to add new logs with this activity.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes. Delete!",
          style: "destructive",
          onPress: async () => {
            await deleteActivity(activityId);
            router.back();
          }
        }
      ]
    );
  }

  let content = <></>;
  if (!activity) {
    content = <Spinner />;
  } else {
    content = (
      <View style={{ flexGrow: 1 }}>
        <Item label="Name:">
          <Text>{activity.name}</Text>
        </Item>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Activity",
          headerBackTitleStyle: {
            fontSize: headerNavTextStyles.headerLink.fontSize
          },
          headerRight: () => {
            return (
              <View>
                <Link href={`/activities/edit?activityId=${activityId}`}>
                  <HeaderNavText>Edit</HeaderNavText>
                </Link>
              </View>
            );
          }
        }}
      />
      {content}
      <Pressable onPress={handleDelete}>
        <Text style={styles.delete}>Delete Activity</Text>
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
