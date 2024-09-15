export function getRandom(a: number, b: number) {
  const x = Math.floor(Math.random() * b);
  return x < a ? x + a : x;
}

export function generateDates(fromTimestamp: number, toTimestamp: number) {
  const diff = toTimestamp - fromTimestamp;
  const dates = [];
  const numDates = getRandom(3, 10);
  for (let i = 0; i < numDates; i++) {
    const timestamp = fromTimestamp + getRandom(0, diff);
    const dt = new Date(timestamp);
    dates.push(dt);
  }
  return dates.sort((a, b) => {
    if (a.getTime() > b.getTime()) {
      return -1;
    } else if (a.getTime() == b.getTime()) {
      return 0;
    } else {
      return 1;
    }
  });
}

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
