import { Link } from "expo-router";
import { Text, SafeAreaView } from "react-native";

export default function LogsIndex() {
  return (
    <SafeAreaView>
      <Text>LogsIndex</Text>
      <Link href="/logs/show">Show</Link>
      <Link href="/logs/edit">Edit</Link>
      <Link href="/logs/add">Add</Link>
    </SafeAreaView>
  );
}
