import { Platform, PlatformColor, StyleSheet, Text } from "react-native";

export default function DisabledHeaderNavText({
  children
}: {
  children: string;
}) {
  return <Text style={styles.disabledHeaderLink}>{children}</Text>;
}

export const styles = StyleSheet.create({
  disabledHeaderLink: {
    fontSize: 18,
    fontWeight: "600",
    ...Platform.select({
      ios: {
        color: PlatformColor("placeholderText")
      },
      android: {
        color: PlatformColor("?android:attr/textColorPrimaryDisableOnly")
      },
      default: { color: "darkgray" }
    })
  }
});
