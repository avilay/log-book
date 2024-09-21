import { Activity } from "./model/activity";
import { Log } from "./model/log";
import quotes from "./quotes.json";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

const ACTIVITIES = [
  {
    activityId: "1",
    name: "Run"
  },
  {
    activityId: "2",
    name: "Take Medication"
  },
  {
    activityId: "3",
    name: "Gym"
  },
  {
    activityId: "4",
    name: "Meditate"
  },
  {
    activityId: "5",
    name: "Dishes"
  },
  {
    activityId: "6",
    name: "Gratitude"
  }
];

export function getRandom(a: number, b: number) {
  const x = Math.floor(Math.random() * b);
  return x < a ? x + a : x;
}

export function generateDates(fromTimestamp: number, toTimestamp: number) {
  const diff = toTimestamp - fromTimestamp;
  const dates = [];
  const numDates = getRandom(10, 30);
  for (let i = 0; i < numDates; i++) {
    const timestamp = fromTimestamp + getRandom(0, diff);
    const dt = new Date(timestamp);
    dates.push(dt);
  }
  // return dates in chronological order
  return dates.sort((a, b) => {
    if (a.getTime() > b.getTime()) {
      return 1;
    } else if (a.getTime() == b.getTime()) {
      return 0;
    } else {
      return 0;
    }
  });
}

export function generateActivities(len: number): Activity[] {
  const chooseFrom = ACTIVITIES.length - 1;
  const chosenActivities = [];
  for (let i = 0; i < len; i++) {
    const idx = getRandom(0, chooseFrom);
    chosenActivities.push(ACTIVITIES[idx]);
  }
  return chosenActivities;
}

export function generateLogs(
  fromTimestamp: number,
  toTimestamp: number
): Log[] {
  const dates = generateDates(fromTimestamp, toTimestamp);
  const activities = generateActivities(dates.length);
  const logs: Log[] = dates.map((date, idx) => ({
    logId: date.getTime().toString(),
    date: date,
    activity: activities[idx],
    notes: quotes[getRandom(0, quotes.length)]
  }));
  return logs;
}

export async function generateTestData(dbName: string) {
  const millisInDay = 24 * 60 * 60 * 1000;
  const numDays = getRandom(3, 10);

  const now = new Date();
  const todayTimestamp = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const firstDayTimestamp = todayTimestamp - numDays * millisInDay;
  const logs = generateLogs(firstDayTimestamp, now.getTime());

  // Store all activities in async storage
  // ACTIVITIES.forEach((activity) => {
  //   const key = `activity-${activity.activityId}`;
  //   AsyncStorage.setItem(key, JSON.stringify(activity));
  // });

  const db = SQLite.openDatabaseSync(dbName);

  // clean up old data from db
  db.runSync("DELETE FROM logs");
  db.runSync("DELETE FROM activities");

  // Store all activities to db
  const insertActivity = db.prepareSync(
    "INSERT INTO activities (activity_id, name) VALUES ($activityId, $name)"
  );
  ACTIVITIES.forEach((activity) => {
    try {
      insertActivity.executeSync({
        $activityId: activity.activityId,
        $name: activity.name
      });
    } catch (err) {
      console.debug("Unable to add activity -");
      console.debug(activity);
      console.debug(err);
    }
  });
  insertActivity.finalizeSync();
  console.info("Added activities");

  // Store the logs in async storage
  // await AsyncStorage.clear();
  // logs.forEach((log) => {
  //   const key = `log-${log.logId}`;
  //   AsyncStorage.setItem(key, JSON.stringify(log));
  // });

  // Store all logs to db
  const insertLog = db.prepareSync(`
  INSERT INTO logs (log_id, timestamp, notes, activity_id)
  VALUES ($logId, $timestamp, $notes, $activityId)
  `);
  logs.forEach((log) => {
    try {
      insertLog.executeSync({
        $logId: log.logId,
        $timestamp: log.date.getTime(),
        $notes: log.notes,
        $activityId: log.activity.activityId
      });
    } catch (err) {
      console.debug("Unable to add log -");
      console.debug(log);
      console.debug(err);
    }
  });
  insertLog.finalizeSync();
  console.info("Added logs");

  // return logs;
}
