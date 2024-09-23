import { Platform, PlatformColor, StyleSheet, Text } from "react-native";

export default function HeaderNavText({ children }: { children: string }) {
  return <Text style={styles.headerLink}>{children}</Text>;
}

// export const styles = StyleSheet.create({
//   headerLink: {
//     fontSize: 18,
//     // color: PlatformColor("link"),
//     color: "royalblue",
//     fontWeight: "600"
//   }
// });

export const styles = StyleSheet.create({
  headerLink: {
    fontSize: 18,
    fontWeight: "600",
    ...Platform.select({
      ios: {
        color: PlatformColor("link")
        // backgroundColor: PlatformColor("systemTealColor")
      },
      android: {
        color: PlatformColor("?android:attr/textColorLink")
        // backgroundColor: PlatformColor("@android:color/holo_blue_bright")
      },
      default: { color: "royalblue" }
    })
  }
});
