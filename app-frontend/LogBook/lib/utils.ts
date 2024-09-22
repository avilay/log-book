import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import { generateTestData } from "./devutils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export function formatDate(date: Date) {
  const now = new Date();
  if (
    date.getFullYear() == now.getFullYear() &&
    date.getMonth() == now.getMonth() &&
    date.getDate() == now.getDate()
  ) {
    return "Today";
  } else {
    const weekDay = WEEKDAYS[date.getDay()];
    const month = MONTHS[date.getMonth()];
    return `${weekDay}, ${date.getDate()} ${month}`;
  }
}

export function formatTime(date: Date) {
  const mins = date.getMinutes();
  const hrs = date.getHours();
  const isAM = hrs < 12;

  let minsStr = "";
  if (mins < 10) {
    minsStr = `0${mins.toString()}`;
  } else {
    minsStr = mins.toString();
  }

  let hrsStr = "";
  if (hrs <= 12) {
    if (hrs == 0) {
      hrsStr = "12";
    } else {
      hrsStr = hrs.toString();
    }
  } else {
    hrsStr = (hrs - 12).toString();
  }

  return isAM ? `${hrsStr}:${minsStr} AM` : `${hrsStr}:${minsStr} PM`;
}

export async function setupDb(dbName: string) {
  const db = await SQLite.openDatabaseAsync(dbName);
  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS activities (
    activity_id TEXT PRIMARY KEY,
    name TEXT
  );
  CREATE TABLE IF NOT EXISTS logs (
    log_id TEXT PRIMARY KEY,
    timestamp INTEGER,
    notes TEXT,
    activity_id TEXT,
    FOREIGN KEY(activity_id) REFERENCES activities(activity_id)
  );
  `);
}

export async function deleteAllData() {
  const db = await SQLite.openDatabaseAsync(getDbName());

  const delLogs = `
  DELETE FROM logs
  `;
  await db.runAsync(delLogs);

  const delActivities = `
  DELETE FROM activities
  `;
  await db.runAsync(delActivities);
}

export function getDbName() {
  let dbName = "";
  if (
    Constants.expoConfig &&
    Constants.expoConfig.extra &&
    Constants.expoConfig.extra.dbName
  ) {
    dbName = Constants.expoConfig.extra.dbName;
  } else {
    console.warn("Db name not found in config. Falling back to default name.");
    dbName = "default";
  }
  return dbName;
}

export function initializeApp() {
  const dbName = getDbName();
  setupDb(dbName);

  if (process.env.EXPO_PUBLIC_ENV === "dev") {
    console.log("Running in development environment. Generating test data.");
    generateTestData(dbName);
  }
}
