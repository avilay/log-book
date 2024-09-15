import { generateDates, getRandom } from "../utils";
import { generateActivities, Activity } from "./activity";
import quotes from "./quotes.json";

export type Log = {
  logId: string;
  date: Date;
  activity: Activity;
  notes: string | null;
};

export type GroupedLogs = {
  day: string;
  data: Log[];
};

const cache = new Map();

export async function getLog(logId: string): Promise<Log> {
  const sleepSecs = getRandom(0, 3);
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve("done!"), sleepSecs * 1000);
  });
  await promise;

  return cache.get(logId);
}

export async function getLogsGroupedByDay(): Promise<GroupedLogs[]> {
  const sleepSecs = getRandom(1, 4);

  const promise = new Promise((resolve) => {
    setTimeout(() => resolve("done!"), sleepSecs * 1000);
  });

  await promise;

  const millisInDay = 24 * 60 * 60 * 1000;
  const numDays = getRandom(3, 10);

  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const firstDay = today - numDays * millisInDay;
  let currDay = today;
  const groupedLogs = [];

  // Add logs for today
  groupedLogs.push({
    day: new Date(today).toString(),
    data: generateLogs(today, now.getTime())
  });

  // Go back from today to first day and add logs for each day
  while (currDay >= firstDay) {
    const fromDay = currDay - millisInDay;
    const toDay = currDay;

    groupedLogs.push({
      day: new Date(fromDay).toString(),
      data: generateLogs(fromDay, toDay)
    });

    currDay = fromDay;
  }
  return groupedLogs;
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
  logs.forEach((log) => {
    cache.set(log.logId, log);
  });
  return logs;
}
