import AsyncStorage from "@react-native-async-storage/async-storage";

export type Activity = {
  activityId: string;
  name: string;
};

export async function getActivity(activityId: string) {
  const activityJson = await AsyncStorage.getItem(activityId);
  if (activityJson != null) {
    const activity: Activity = JSON.parse(activityJson);
    return activity;
  } else {
    throw Error(`Activity id ${activityId} not found!`);
  }
}

export async function getActivities() {
  const activities: Activity[] = [];
  const keys = await AsyncStorage.getAllKeys();
  const activityIds = keys.filter((key) => key.startsWith("activity-"));
  for (const activityId of activityIds) {
    const activity = await getActivity(activityId);
    activities.push(activity);
  }
  return activities;
}
