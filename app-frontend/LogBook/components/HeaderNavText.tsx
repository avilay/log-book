import { PlatformColor, StyleSheet, Text } from "react-native";

export default function HeaderNavText({ children }: { children: string }) {
  return <Text style={styles.headerLink}>{children}</Text>;
}

export const styles = StyleSheet.create({
  headerLink: {
    fontSize: 18,
    color: PlatformColor("link"),
    fontWeight: "600"
  }
});
