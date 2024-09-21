import AsyncStorage from "@react-native-async-storage/async-storage";

export type Activity = {
  activityId: string;
  name: string;
};

export async function deleteActivity(activityId: string) {
  const key = `activity-${activityId}`;
  await AsyncStorage.removeItem(key);
}

export async function addActivity(activity: Activity) {
  const key = `activity-${activity.activityId}`;
  await AsyncStorage.setItem(key, JSON.stringify(activity));
}

export async function editActivity(activity: Activity) {
  await deleteActivity(activity.activityId);
  await addActivity(activity);
}

export async function getActivity(activityId: string) {
  const key = `activity-${activityId}`;
  const activityJson = await AsyncStorage.getItem(key);
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
  const activityIds = keys
    .filter((key) => key.startsWith("activity-"))
    .map((activityId) => activityId.slice("activity-".length));
  for (const activityId of activityIds) {
    const activity = await getActivity(activityId);
    activities.push(activity);
  }
  return activities;
}
