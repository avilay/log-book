import { Activity } from "./activity";
import * as SQLite from "expo-sqlite";
import { getDbName, simulateDelay } from "../utils";

const db = SQLite.openDatabaseSync(getDbName());

export type Log = {
  logId: string;
  date: Date;
  activity: Activity;
  notes: string | null;
};

type SqlLog = {
  log_id: string;
  timestamp: number;
  activity_id: string;
  activity_name: string;
  notes: string;
};

export type GroupedLogs = {
  day: Date;
  logs: Log[];
};

export async function deleteLog(logId: string) {
  await simulateDelay();
  const sql = `
  DELETE FROM logs WHERE log_id = $logId
  `;
  await db.runAsync(sql, { $logId: logId });
}

export async function addLog(log: Log) {
  await simulateDelay();
  const sql = `
  INSERT INTO logs (log_id, timestamp, notes, activity_id)
  VALUES ($logId, $timestamp, $notes, $activityId)
  `;
  await db.runAsync(sql, {
    $logId: log.logId,
    $timestamp: log.date.getTime(),
    $notes: log.notes,
    $activityId: log.activity.activityId
  });
}

export async function editLog(log: Log) {
  await simulateDelay();
  const sql = `
  UPDATE logs SET timestamp = $timestamp, notes = $notes, activity_id = $activityId
  WHERE log_id = $logId
  `;
  await db.runAsync(sql, {
    $logId: log.logId,
    $timestamp: log.date.getTime(),
    $notes: log.notes,
    $activityId: log.activity.activityId
  });
}

export async function getLog(logId: string) {
  await simulateDelay();
  const sql = `
  SELECT
    logs.log_id as log_id,
    logs.timestamp as timestamp,
    logs.activity_id as activity_id,
    activities.name as activity_name,
    logs.notes as notes
  FROM logs, activities
  WHERE logs.activity_id = activities.activity_id
  AND logs.log_id = $logId
  `;
  const row = await db.getFirstAsync<SqlLog>(sql, { $logId: logId });
  if (row) {
    const log = {
      logId: row.log_id,
      date: new Date(row.timestamp),
      activity: {
        activityId: row.activity_id,
        name: row.activity_name
      },
      notes: row.notes
    };
    return log;
  } else {
    throw Error(`Log with id ${logId} not found!`);
  }
}

export async function getAllLogs() {
  await simulateDelay();
  const sql = `
  SELECT
    logs.log_id as log_id,
    logs.timestamp as timestamp,
    logs.activity_id as activity_id,
    activities.name as activity_name,
    logs.notes as notes
  FROM logs, activities
  WHERE logs.activity_id = activities.activity_id
  ORDER BY log.timestamp
  `;
  const rows = await db.getAllAsync<SqlLog>(sql);
  const logs = rows.map((row) => {
    return {
      logId: row.log_id,
      date: new Date(row.timestamp),
      activity: {
        activityId: row.activity_id,
        name: row.activity_name
      },
      notes: row.notes
    };
  });
  return logs;
}

export async function getLogsGroupedByDay() {
  await simulateDelay();
  // Get all the logs
  const sql = `
  SELECT
    logs.log_id as log_id,
    logs.timestamp as timestamp,
    logs.activity_id as activity_id,
    activities.name as activity_name,
    logs.notes as notes
  FROM logs, activities
  WHERE logs.activity_id = activities.activity_id
  `;
  const rows = await db.getAllAsync<SqlLog>(sql);
  const logs = rows.map((row) => {
    return {
      logId: row.log_id,
      date: new Date(row.timestamp),
      activity: {
        activityId: row.activity_id,
        name: row.activity_name
      },
      notes: row.notes
    };
  });

  // Group them by day
  // May.groupBy is not supported by Expo/React Native
  // Doing this the hard way
  const groups = new Map();
  logs.forEach((log) => {
    const day = new Date(
      log.date.getFullYear(),
      log.date.getMonth(),
      log.date.getDate()
    ).getTime();
    if (groups.has(day)) {
      groups.get(day).push(log);
    } else {
      groups.set(day, [log]);
    }
  });

  // Re-package them as an array of GroupedLogs
  const groupedLogs: GroupedLogs[] = [];
  groups.forEach((logs: Log[], timestamp: number) => {
    const day = new Date(timestamp);
    groupedLogs.push({
      day: day,
      logs: logs.sort((a: Log, b: Log) => {
        const tsa = a.date.getTime();
        const tsb = b.date.getTime();
        if (tsa < tsb) {
          return 1;
        } else if (tsa == tsb) {
          return 0;
        } else {
          return -1;
        }
      })
    });
  });

  return groupedLogs.sort((grp1: GroupedLogs, grp2: GroupedLogs) => {
    const ts1 = grp1.day.getTime();
    const ts2 = grp2.day.getTime();
    if (ts1 < ts2) {
      return 1;
    } else if (ts1 == ts2) {
      return 0;
    } else {
      return -1;
    }
  });
}

export async function countLogs() {
  await simulateDelay();
  const sql = `
  SELECT COUNT(*) as logs_count FROM logs
  `;
  const row = await db.getFirstAsync<{ logs_count: number }>(sql);
  return row ? row.logs_count : 0;
}
