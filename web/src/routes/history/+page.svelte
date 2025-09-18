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
  let currentOffsetDays = $state(0);
  let hasMoreLogs = $state(true);
  let isLoadingMore = $state(false);

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

  async function loadHistory(resetLogs = true) {
    try {
        const days = 3;
        const url = new URL(`${PUBLIC_API}/logs`);
        url.searchParams.set('days', days.toString());
        url.searchParams.set('offset_days', currentOffsetDays.toString());

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

            const newGroupedLogs = Object.values(grouped);

            if (resetLogs) {
                groupedLogs = newGroupedLogs;
            } else {
                // Merge with existing logs, avoiding duplicates
                const existingDates = new Set(groupedLogs.map(g => g.datestamp.toDateString()));
                const logsToAdd = newGroupedLogs.filter(g => !existingDates.has(g.datestamp.toDateString()));
                groupedLogs = [...groupedLogs, ...logsToAdd];
            }

            // Check if we have more logs (if we got some logs, assume there might be more)
            // This is a simple heuristic - if we get 0 logs, there are definitely no more
            hasMoreLogs = logs.length > 0;
        } else {
            console.error("Did not get OK response");
        }
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching data:', err.message);
        throw new Error("Unable to fetch the latest posts!");
    }
  }

  async function loadMoreHistory() {
    if (isLoadingMore || !hasMoreLogs) return;

    isLoadingMore = true;
    currentOffsetDays += 3; // Load 3 more days back

    try {
      await loadHistory(false); // Don't reset logs, append to existing
    } finally {
      isLoadingMore = false;
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
  <EditableLogs
    groupedLogs={groupedLogs}
    doneClicked={doneClicked}
    {genDeleteLogAt}
    {genEditLogAt}
    {hasMoreLogs}
    {isLoadingMore}
    {loadMoreHistory}
  />
{:else}
  <ReadOnlyLogs
    groupedLogs={groupedLogs}
    {editClicked}
    {hasMoreLogs}
    {isLoadingMore}
    {loadMoreHistory}
  />
{/if}