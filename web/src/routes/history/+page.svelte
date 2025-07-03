<script lang="ts">
  import { PUBLIC_API } from "$env/static/public";
  import ReadOnlyLogs from "./ReadOnlyLogs.svelte";
  import EditableLogs from "./EditableLogs.svelte";
  import EditLog from "./EditLog.svelte";
	import { onAuthStateChanged } from "firebase/auth";
	import { auth } from "$lib/firebase-client";
	import { goto } from "$app/navigation";

  let groupedLogs: GroupedLogs[] = $state([]);
  let editable = $state(false);
  let editLog: Log | undefined = $state();
  let token = $state("");

  function editClicked() {
    editable = true;
  }

  function doneClicked() {
    editable = false;
  }

  function genDeleteLogAt(gidx: number, lidx: number) {
    let logId = groupedLogs[gidx].logs[lidx]["logId"] as string;
    return async () => {
      let url = `${PUBLIC_API}/logs/${logId}`;
      const resp = await fetch(
        url, 
        {
          method: "DELETE",
          headers: {
            "X-Token": token
          }
        }
      );
      groupedLogs[gidx].logs.splice(lidx, 1);
    }
  }

  function genEditLogAt(gidx: number, lidx: number) {
    return () => {
      editLog = groupedLogs[gidx].logs[lidx];
    }
  }

  async function loadHistory_old() {
    try {
        let url = `${PUBLIC_API}/logs?grouped=true`;
        console.debug(`Fetching history from ${url} with token ${token}`);
        const response = await fetch(
            url, 
            {
                method: "GET",
                headers: {"X-Token": token}
            }
        );
        let glogs = [];
        if (response.ok) {
            glogs = await response.json();            
            for (let glog of glogs) {
                glog.datestamp = new Date(Date.parse(glog.datestamp));
                for (let log of glog["logs"]) {
                    log.createdAtUtc = new Date(Date.parse(log.createdAtUtc));
                }
            }
        } else {
            console.error("Did not get OK response");
        }
        groupedLogs = glogs;
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching data:', err.message);
        throw new Error("Unable to fetch the latest posts!");
    }
  }

  async function loadHistory() {
    try {
        let url = `${PUBLIC_API}/logs`;
        console.debug(`Fetching history from ${url} with token ${token}`);
        const response = await fetch(
            url, 
            {
                method: "GET",
                headers: {"X-Token": token}
            }
        );
        let logs = [];
        if (response.ok) {
            logs = await response.json();
            
            const grouped: { [key: string]: GroupedLogs } = {};

            for (const log of logs) {
              log.createdAtUtc = new Date(Date.parse(log.createdAtUtc));
              const localDate = log.createdAtUtc.toLocaleDateString();
              if (!grouped[localDate]) {
                grouped[localDate] = {
                  datestamp: new Date(log.createdAtUtc.toDateString()),
                  logs: [],
                };
              }
              grouped[localDate].logs.push(log);
            }

            groupedLogs = Object.values(grouped);
        } else {
            console.error("Did not get OK response");
        }
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching data:', err.message);
        throw new Error("Unable to fetch the latest posts!");
    }
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      token = await user.getIdToken(false);
      loadHistory();
    } else {
      goto("/");
    }
  });
</script>
{#if editLog}
  <EditLog {token} log={editLog} />
{:else if editable}
  <EditableLogs groupedLogs={groupedLogs} doneClicked={doneClicked} {genDeleteLogAt} {genEditLogAt} />
{:else}
  <ReadOnlyLogs groupedLogs={groupedLogs} {editClicked} />
{/if}