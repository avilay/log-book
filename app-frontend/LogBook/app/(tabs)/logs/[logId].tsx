import { useLocalSearchParams } from "expo-router";
import { Text, SafeAreaView } from "react-native";

export default function LogsShow() {
  const { logId } = useLocalSearchParams<{ logId: string }>();

  return (
    <SafeAreaView>
      <Text>Showing log details for log {logId}</Text>
    </SafeAreaView>
  );
}
