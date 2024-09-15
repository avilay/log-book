import { getRandom } from "../utils";

export type Activity = {
  activityId: string;
  name: string;
};

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

export function generateActivities(len: number): Activity[] {
  const chooseFrom = ACTIVITIES.length - 1;
  const chosenActivities = [];
  for (let i = 0; i < len; i++) {
    const idx = getRandom(0, chooseFrom);
    chosenActivities.push(ACTIVITIES[idx]);
  }
  return chosenActivities;
}
