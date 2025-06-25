<script lang="ts">
  import { fade } from "svelte/transition";
  import { formatDay, formatTime } from "$lib";

  let { groupedLogs, doneClicked, genDeleteLogAt, genEditLogAt }: {
    groupedLogs: GroupedLogs[], 
    doneClicked: () => void, 
    genDeleteLogAt: (gidx: number, lidx: number) => (() => void),
    genEditLogAt: (gidx: number, lidx: number) => (() => void)
  } = $props();
</script>

<div class="top-bar">
  <h1>Edit History</h1>
  <button class="understated top button" onclick={doneClicked}>Done</button>
</div>

<div class="content">
  {#each groupedLogs as glogs, gidx}
    <h2 class="datestamp">{formatDay(glogs.datestamp)}</h2>
    {#each glogs.logs as log, lidx (log["logId"])}
      <div transition:fade class="edit log">
        <button class="delete" onclick={genDeleteLogAt(gidx, lidx)}>
          <img class="delete-icon" src="/delete.png" alt="delete icon">
        </button>
        <div>{formatTime(log["timestamp"])}</div>
        <div>{log["activity"]}</div>
        <button class="edit" onclick={genEditLogAt(gidx, lidx)} aria-label="Edit log">
          <svg 
          class="edit-icon"
          data-name="Design Convert" 
          id="Design_Convert" 
          width="24"
          height="24"
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg">
          <path d="M16,57a1,1,0,0,1-.8-.4,1,1,0,0,1,.2-1.4L46.33,32,15.4,8.8a1,1,0,1,1,1.2-1.6l32,24a1,1,0,0,1,0,1.6l-32,24A1,1,0,0,1,16,57Z"/>
          </svg>
        </button>
      </div>
    {/each}
  {/each}
</div>

<style lang="scss">
  @use "../../styles/vars";
  @use "../../styles/button";
  @use "../../styles/understated_button";
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
    gap: 0.5em;
    align-items: center;
    justify-content: flex-start;

    .edit-icon {
      margin-left: auto;
      cursor: pointer;
    }

    .delete-icon {
      width: 24px;
      cursor: pointer;
    }
  }

  .edit {
    border-bottom: 1px solid vars.$understated-color;
    // padding: 1em 0;

    path {
      fill: vars.$dark-color;
      stroke: vars.$dark-color;
    }
  }

  button.delete, button.edit {
    border: 0;
    background: none;
  }
</style>