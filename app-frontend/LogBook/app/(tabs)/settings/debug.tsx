import { Text, SafeAreaView, StyleSheet } from "react-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
import Constants from "expo-constants";

const dbName = Constants.expoConfig!.extra!.dbName;
const db = SQLite.openDatabaseSync(dbName);

export default function Debug() {
  useDrizzleStudio(db);
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        Press shift+m on the Expo server console and select &quot;Open
        expo-drizzle-select-plugin&quot; to open a SQLite browser in the browser
        on your devbox. This will enable you to browse on-device data.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    marginTop: 15
  }
});
