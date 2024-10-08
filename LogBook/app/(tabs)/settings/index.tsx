import { getAllLogs } from "@/lib/model/log";
import { deleteAllData } from "@/lib/utils";
import { Link } from "expo-router";
import {
  Text,
  SafeAreaView,
  Pressable,
  View,
  StyleSheet,
  Platform,
  PlatformColor,
  Alert,
  ActivityIndicator
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";
import * as Sharing from "expo-sharing";
import { useState } from "react";

export default function Settings() {
  const [isExporting, setIsExporting] = useState(false);

  function onDeleteAll() {
    Alert.alert(
      "Are you sure?",
      "This is an irreversible action. All your logs and activities will be deleted!",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes. Delete EVERYTHING!",
          style: "destructive",
          onPress: () => {
            deleteAllData();
          }
        }
      ]
    );
  }

  async function onExport() {
    setIsExporting(true);
    const logs = await getAllLogs();
    const logsPath = FileSystem.cacheDirectory + "logs.json";
    await FileSystem.writeAsStringAsync(logsPath, JSON.stringify(logs));
    const canEmail = await MailComposer.isAvailableAsync();
    if (!canEmail) {
      Sharing.shareAsync(logsPath);
      return;
    }
    const result = await MailComposer.composeAsync({
      attachments: [logsPath],
      body: "Attached are all your logs in JSON form.",
      subject: "LogBook logs"
    });
    if (result.status == MailComposer.MailComposerStatus.UNDETERMINED) {
      alert("Something went wrong. The email could not be sent.");
    }
    setIsExporting(false);
  }

  const debugView = (
    <View style={styles.linkContainer}>
      <Link href="/settings/debug">
        <Text style={styles.linkText}>Debug</Text>
      </Link>
    </View>
  );

  const exportView = (
    <Pressable onPress={onExport}>
      <Text style={styles.linkText}>Export all logs</Text>
    </Pressable>
  );

  const disabledExportView = (
    <Pressable
      style={{
        flexDirection: "row"
      }}
      onPress={onExport}
      disabled={true}
    >
      <Text style={styles.infoText}>Exporting... </Text>
      <ActivityIndicator size="small" color={styles.infoText.color} />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.linkContainer}>
        {isExporting ? disabledExportView : exportView}
      </View>
      <View style={styles.linkContainer}>
        <Pressable onPress={onDeleteAll}>
          <Text style={styles.dangerText}>Delete all data</Text>
        </Pressable>
      </View>
      {process.env.EXPO_PUBLIC_ENV === "dev" ? debugView : <></>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 25,
    marginTop: 15
  },
  linkContainer: {
    paddingLeft: 15,
    paddingTop: 10,
    marginVertical: 10
  },
  infoText: {
    ...Platform.select({
      ios: {
        color: PlatformColor("secondaryLabel")
      },
      default: {
        color: "lightgray"
      }
    })
  },
  linkText: {
    ...Platform.select({
      ios: {
        color: PlatformColor("link")
      },
      android: {
        color: PlatformColor("?android:attr/textColorLink")
      },
      default: {
        color: "royalblue"
      }
    })
  },
  dangerText: {
    ...Platform.select({
      ios: {
        color: PlatformColor("systemRed")
      },
      default: {
        color: "red"
      }
    })
  }
});
