// import AsyncStorage from "@react-native-async-storage/async-storage";;
import * as SQLite from "expo-sqlite";
import { getDbName } from "../utils";

const db = SQLite.openDatabaseSync(getDbName());

export type Activity = {
  activityId: string;
  name: string;
};

// export async function deleteActivity(activityId: string) {
//   const key = `activity-${activityId}`;
//   await AsyncStorage.removeItem(key);
// }
export async function deleteActivity(activityId: string) {
  const sql = `
  DELETE FROM activities WHERE activity_id = $activityId
  `;
  await db.runAsync(sql, { $activityId: activityId });
}

// export async function addActivity(activity: Activity) {
//   const key = `activity-${activity.activityId}`;
//   await AsyncStorage.setItem(key, JSON.stringify(activity));
// }
export async function addActivity(activity: Activity) {
  console.debug("Adding activity -");
  console.debug(activity);
  const sql = `
  INSERT INTO activities (activity_id, name) VALUES ($activityId, $name)
  `;
  await db.runAsync(sql, {
    $activityId: activity.activityId,
    $name: activity.name
  });
}

// export async function editActivity(activity: Activity) {
//   await deleteActivity(activity.activityId);
//   await addActivity(activity);
// }
export async function editActivity(activity: Activity) {
  const sql = `
  UPDATE activities SET name = $name WHERE activity_id = $activityId
  `;
  await db.runAsync(sql, {
    $activityId: activity.activityId,
    $name: activity.name
  });
}

// export async function getActivity(activityId: string) {
//   const key = `activity-${activityId}`;
//   const activityJson = await AsyncStorage.getItem(key);
//   if (activityJson != null) {
//     const activity: Activity = JSON.parse(activityJson);
//     return activity;
//   } else {
//     throw Error(`Activity id ${activityId} not found!`);
//   }
// }
export async function getActivity(activityId: string) {
  const sql = `
  SELECT activity_id, name FROM activities
  WHERE activity_id = $activityId
  `;
  const row = await db.getFirstAsync<{ activity_id: string; name: string }>(
    sql,
    { $activityId: activityId }
  );
  if (row) {
    const activity = {
      activityId: row.activity_id,
      name: row.name
    };
    return activity;
  } else {
    throw Error(`Activity with id ${activityId} not found!`);
  }
}

// export async function getActivities() {
//   const activities: Activity[] = [];
//   const keys = await AsyncStorage.getAllKeys();
//   const activityIds = keys
//     .filter((key) => key.startsWith("activity-"))
//     .map((activityId) => activityId.slice("activity-".length));
//   for (const activityId of activityIds) {
//     const activity = await getActivity(activityId);
//     activities.push(activity);
//   }
//   return activities;
// }
export async function getActivities() {
  const sql = `
  SELECT activity_id, name FROM activities
  `;
  const rows = await db.getAllAsync<{ activity_id: string; name: string }>(sql);
  const activities = rows.map((row) => {
    return {
      activityId: row.activity_id,
      name: row.name
    };
  });
  return activities;
}
