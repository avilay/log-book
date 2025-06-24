<script lang="ts">
  let { groupedLogs, editClicked } : {groupedLogs: GroupedLogs[], editClicked: () => void} = $props();
</script>

<div class="top-bar">
  <h1>History</h1>
  <button class="primary top button" onclick={editClicked}>Edit</button>
</div>

<div class="content">
  {#each groupedLogs as glogs}
    <h2 class="datestamp">{glogs.datestamp}</h2>
    {#each glogs.logs as log}
      <div class="log">
        <div>{log["timestamp"]}</div>
        <div>{log["activity"]}</div>
      </div>
    {/each}
  {/each}
</div>

<style lang="scss">
  $primary-color: #725CAD;
  $secondary-color: #8CCDEB;
  $light-color: #FFE3A9;
  $darker-primary-color: #241d37;

  .button {
    display: inline-block;
    padding: 0.5em 1.25em;
    text-align: center;
    border-radius: 7px;

    /* This is needed for <a> */
    text-decoration: none;

    /* These two are needed for <button>*/
    border: 0;
    cursor: pointer;
  }

  .button.primary {
    background-color: $primary-color;
    color: $light-color;
  }

  .button.primary:hover, .button.primary:focus {
    background-color: $darker-primary-color;
  }


  .top-bar {
    margin-top: 1.5em;
    display: flex;
    flex-flow: row nowrap;

    h1 {
      color: $primary-color;
      margin: 0;
    }
  }

  .top.button {
    margin-left: auto;
    align-self: center;
  }

  .content {
    margin-top: 1em;
  }

  .datestamp {
    color: $secondary-color;
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