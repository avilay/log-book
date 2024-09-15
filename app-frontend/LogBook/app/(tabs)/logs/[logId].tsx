import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, SafeAreaView, StyleSheet } from "react-native";
import { Log, getLog } from "@/lib/model/log";
import Spinner from "@/components/Spinner";

export default function LogsShow() {
  const { logId } = useLocalSearchParams<{ logId: string }>();

  const [log, setLog] = useState<Log | null>(null);

  useEffect(() => {
    async function _getLog() {
      const _log = await getLog(logId);
      setLog(_log);
    }
    _getLog();
  }, []);

  let content = <></>;
  if (!log) {
    content = <Spinner />;
  } else {
    content = (
      <>
        <Text>{log?.logId}</Text>
        <Text>{log?.date.toString()}</Text>
        <Text>{log?.activity.name}</Text>
        <Text>{log?.notes}</Text>
      </>
    );
  }

  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
