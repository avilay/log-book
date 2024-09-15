import { generateDates, getRandom } from "../utils";
import { generateActivities } from "./activity";

export function generateLogs(fromTimestamp: number, toTimestamp: number) {
  const dates = generateDates(fromTimestamp, toTimestamp);
  const activities = generateActivities(dates.length);
  const logs = dates.map((date, idx) => ({
    logId: idx,
    date: date,
    activity: activities[idx]
  }));
  return logs;
}

type Log = {
  logId: number;
  date: Date;
  activity: string;
};

export type GroupedLogs = {
  day: string;
  data: Log[];
};

export async function getLogsGroupedByDay() {
  const sleepSecs = getRandom(1, 4);
  console.debug(`Will sleep for ${sleepSecs}.`);

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
  console.debug(
    `Adding logs for ${today} (${new Date(today)}) to ${now.getTime()} (${now})`
  );
  groupedLogs.push({
    day: new Date(today).toString(),
    data: generateLogs(today, now.getTime())
  });

  // Go back from today to first day and add logs for each day
  while (currDay >= firstDay) {
    const fromDay = currDay - millisInDay;
    const toDay = currDay;

    console.debug(
      `Adding logs for ${fromDay} (${new Date(fromDay)}) to ${toDay} (${new Date(toDay)})`
    );
    groupedLogs.push({
      day: new Date(fromDay).toString(),
      data: generateLogs(fromDay, toDay)
    });

    currDay = fromDay;
  }
  return groupedLogs;
}
