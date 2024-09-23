import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Item({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 7
  },
  item: {
    marginTop: 20,
    marginBottom: 30
  }
});
