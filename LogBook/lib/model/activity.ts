import * as SQLite from "expo-sqlite";
import { getDbName, simulateDelay } from "../utils";

const db = SQLite.openDatabaseSync(getDbName());

export type Activity = {
  activityId: string;
  name: string;
};

export async function deleteActivity(activityId: string) {
  await simulateDelay();
  const sql = `
  DELETE FROM activities WHERE activity_id = $activityId
  `;
  await db.runAsync(sql, { $activityId: activityId });
}

export async function addActivity(activity: Activity) {
  await simulateDelay();
  const sql = `
  INSERT INTO activities (activity_id, name) VALUES ($activityId, $name)
  `;
  await db.runAsync(sql, {
    $activityId: activity.activityId,
    $name: activity.name
  });
}

export async function editActivity(activity: Activity) {
  await simulateDelay();
  const sql = `
  UPDATE activities SET name = $name WHERE activity_id = $activityId
  `;
  await db.runAsync(sql, {
    $activityId: activity.activityId,
    $name: activity.name
  });
}

export async function getActivity(activityId: string) {
  await simulateDelay();
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

export async function getActivities() {
  await simulateDelay();
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

export async function countActivities() {
  await simulateDelay();
  const sql = `
  SELECT COUNT(*) as activities_count FROM activities
  `;
  const row = await db.getFirstAsync<{ activities_count: number }>(sql);
  return row ? row.activities_count : 0;
}
