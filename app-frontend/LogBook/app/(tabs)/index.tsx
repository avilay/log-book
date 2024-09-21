import { generateTestData } from "@/lib/devutils";
import { setupDb } from "@/lib/utils";
import Constants from "expo-constants";
import { Redirect } from "expo-router";

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
setupDb(dbName);

if (process.env.EXPO_PUBLIC_ENV === "dev") {
  console.log("Running in development environment. Generating test data.");
  generateTestData(dbName);
}

export default function TabsIndex() {
  return <Redirect href="/logs" />;
}
