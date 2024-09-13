import { Link } from "expo-router";
import { Text, SafeAreaView } from "react-native";

export default function ActivitiesIndex() {
  return (
    <SafeAreaView>
      <Text>ActivitiesIndex</Text>
      <Link href="/activities/show">Show</Link>
      <Link href="/activities/edit">Edit</Link>
      <Link href="/activities/add">Add</Link>
    </SafeAreaView>
  );
}
