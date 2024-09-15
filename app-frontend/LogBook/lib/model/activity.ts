import { getRandom } from "../utils";

const ACTIVITIES = [
  "Run",
  "Take Medication",
  "Meditate",
  "Gym",
  "Dishes",
  "Gratitude"
];

export function generateActivities(len: number) {
  const chooseFrom = ACTIVITIES.length - 1;
  const chosenActivities = [];
  for (let i = 0; i < len; i++) {
    const idx = getRandom(0, chooseFrom);
    chosenActivities.push(ACTIVITIES[idx]);
  }
  return chosenActivities;
}
