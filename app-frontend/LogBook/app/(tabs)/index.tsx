import { initializeApp } from "@/lib/utils";
import { Redirect } from "expo-router";

initializeApp();

export default function TabsIndex() {
  return <Redirect href="/logs" />;
}
