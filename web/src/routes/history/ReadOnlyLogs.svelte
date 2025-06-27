<script lang="ts">
  import { formatDay, formatTime } from "$lib";
  let { groupedLogs, editClicked } : {groupedLogs: GroupedLogs[], editClicked: () => void} = $props();
</script>

<div class="top-bar">
  <h1>History</h1>
  <button class="primary top button" onclick={editClicked}>Edit</button>
</div>

<div class="content">
  {#each groupedLogs as glogs}
    <h2 class="datestamp">{formatDay(glogs.datestamp)}</h2>
    {#each glogs.logs as log}
      <div class="log">
        <div>{formatTime(log["createdAtUtc"])}</div>
        <div>{log["activity"]}</div>
      </div>
    {/each}
  {/each}
</div>

<style lang="scss">
  @use "../../styles/vars";
  @use "../../styles/button";
  @use "../../styles/primary_button";
  @use "../../styles/main";

  .top.button {
    margin-left: auto;
    align-self: center;
  }

  .datestamp {
    color: vars.$secondary-color;
    font-size: 1.25rem;
    margin: 1em 0 0.5em 0;
  }

  .log {
    margin: 0;
    padding: 0.5em 0;

    display: flex;
    flex-flow: row nowrap;
    gap: 1em;
    align-items: center;
    justify-content: flex-start;
  }
</style>