import HeaderNavText from "@/components/HeaderNavText";
import Item from "@/components/Item";
import Spinner from "@/components/Spinner";
import { Activity, editActivity, getActivity } from "@/lib/model/activity";
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams
} from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, SafeAreaView, Pressable, TextInput } from "react-native";

export default function EditActivity() {
  const { activityId }: { activityId: string } = useLocalSearchParams();
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
    }, [activityId])
  );

  async function onSave() {
    await editActivity(activity!);
    router.back();
  }

  function onChangeText(text: string) {
    setActivity({ activityId: activity!.activityId, name: text });
  }

  let content = <></>;
  if (!activity) {
    content = <Spinner />;
  } else {
    content = (
      <Item label="Name:">
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeText}
          value={activity.name}
        />
      </Item>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          // presentation only works when specified in _layout
          // presentation: modal
          headerTitle: "Edit Activity",
          headerLeft: () => {
            return (
              <Pressable onPress={router.back}>
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
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    alignItems: "stretch"
  },
  textInput: {
    padding: 5,
    borderColor: "darkgray",
    borderWidth: 1
  }
});
