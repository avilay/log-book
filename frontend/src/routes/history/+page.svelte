<script lang="ts">
  import { PUBLIC_API } from "$env/static/public";
  import ReadOnlyLogs from "./ReadOnlyLogs.svelte";
  import EditableLogs from "./EditableLogs.svelte";
  import EditLog from "./EditLog.svelte";

  let { data }: {data: {logs: GroupedLogs[]}} = $props();
  let groupedLogs = $state(data.logs);
  let editable = $state(false);
  let editLog: Log | undefined = $state();

  console.log("Inside /history");

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
        url, {method: "DELETE"}
      );
      console.log(resp.status);
      groupedLogs[gidx].logs.splice(lidx, 1);
    }
  }

  function genEditLogAt(gidx: number, lidx: number) {
    return () => {
      editLog = groupedLogs[gidx].logs[lidx];
    }
  }
</script>
{#if editLog}
  <EditLog log={editLog} />
{:else if editable}
  <EditableLogs groupedLogs={groupedLogs} doneClicked={doneClicked} {genDeleteLogAt} {genEditLogAt} />
{:else}
  <ReadOnlyLogs groupedLogs={groupedLogs} {editClicked} />
{/if}