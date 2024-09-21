import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity } from "./activity";

export type Log = {
  logId: string;
  date: Date;
  activity: Activity;
  notes: string | null;
};

export type GroupedLogs = {
  day: Date;
  logs: Log[];
};

export async function deleteLog(logId: string) {
  const key = `log-${logId}`;
  await AsyncStorage.removeItem(key);
}

export async function addLog(log: Log) {
  const key = `log-${log.logId}`;
  await AsyncStorage.setItem(key, JSON.stringify(log));
}

export async function editLog(log: Log) {
  await deleteLog(log.logId);
  await addLog(log);
}

export async function getLog(logId: string) {
  const key = `log-${logId}`;
  const logJson = await AsyncStorage.getItem(key);
  if (logJson != null) {
    const log: Log = JSON.parse(logJson);
    // @ts-expect-error:next-line
    log.date = new Date(Date.parse(log.date));
    return log;
  } else {
    throw Error(`Log id ${logId} not found in async storage!`);
  }
}

export async function getLogsGroupedByDay() {
  // Get all the logs from async storage
  const logs: Log[] = [];
  const keys = await AsyncStorage.getAllKeys();
  const logIds = keys
    .filter((key) => key.startsWith("log-"))
    .map((logId) => logId.slice("log-".length));
  for (const logId of logIds) {
    const log = await getLog(logId);
    logs.push(log);
  }

  // Group them by day
  // Map.groupBy is not supported by Expo/React Native
  // const groups = Map.groupBy(logs, (log) => {
  //   const date = new Date(
  //     log.date.getFullYear(),
  //     log.date.getMonth(),
  //     log.date.getDate()
  //   );
  //   return date.getTime();
  // });
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
