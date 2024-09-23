import Spinner from "@/components/Spinner";
import { countActivities } from "@/lib/model/activity";
import { initializeApp } from "@/lib/utils";
import { Redirect, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

initializeApp();

export default function TabsIndex() {
  const [redirectToLogs, setRedirectToLogs] = useState(false);
  const [redirectToActivities, setRedirectToActivities] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function redirect() {
        const _numActivities = await countActivities();
        if (_numActivities == 0) {
          setRedirectToLogs(false);
          setRedirectToActivities(true);
        } else {
          setRedirectToLogs(true);
          setRedirectToActivities(false);
        }
      }
      redirect();
    }, [])
  );

  if (redirectToActivities) {
    return <Redirect href="/activities" />;
  } else if (redirectToLogs) {
    return <Redirect href="/logs" />;
  } else {
    return <Spinner />;
  }
  // else do nothing, chill on this page
}
