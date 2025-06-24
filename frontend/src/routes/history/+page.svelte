<script lang="ts">
  import type { PageProps } from './$types';
  import ReadOnlyLogs from "./ReadOnlyLogs.svelte";
  import EditableLogs from "./EditableLogs.svelte";

  let { data }: {data: {logs: GroupedLogs[]}} = $props();
  let editable = $state(false);

  function editClicked() {
    editable = true;
  }

  function cancelClicked() {
    editable = false;
  }
</script>

{#if editable}
  <EditableLogs groupedLogs={data.logs} {cancelClicked} />
{:else}
  <ReadOnlyLogs groupedLogs={data.logs} {editClicked} />
{/if}