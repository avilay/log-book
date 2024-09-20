import { generateTestData } from "@/lib/devutils";
import { Redirect } from "expo-router";

generateTestData();

export default function TabsIndex() {
  return <Redirect href="/logs" />;
}
