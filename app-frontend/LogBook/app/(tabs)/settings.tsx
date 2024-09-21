import { SafeAreaView } from "react-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";

const dbName = Constants.expoConfig!.extra!.dbName;
const db = SQLite.openDatabaseSync(dbName);

export default function Account() {
  useDrizzleStudio(db);

  return <SafeAreaView></SafeAreaView>;
}
