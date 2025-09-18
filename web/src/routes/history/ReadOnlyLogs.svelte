<script lang="ts">
  import { formatDay, formatTime } from "$lib";
  let {
    groupedLogs,
    editClicked,
    hasMoreLogs,
    isLoadingMore,
    loadMoreHistory
  } : {
    groupedLogs: GroupedLogs[],
    editClicked: () => void,
    hasMoreLogs: boolean,
    isLoadingMore: boolean,
    loadMoreHistory: () => Promise<void>
  } = $props();
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

  {#if hasMoreLogs}
    <div class="pagination-controls">
      <a
        href="#"
        class="next-link"
        onclick={(e) => { e.preventDefault(); loadMoreHistory(); }}
        class:loading={isLoadingMore}
      >
        {isLoadingMore ? "loading..." : "next"}
      </a>
    </div>
  {/if}
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

  .pagination-controls {
    margin-top: 1.5em;
    margin-bottom: 2em;

    .next-link {
      color: vars.$secondary-color;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      &.loading {
        color: vars.$understated-color;
        cursor: default;
        pointer-events: none;
      }
    }
  }
</style>