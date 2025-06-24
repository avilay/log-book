<script lang="ts">
  let { groupedLogs, cancelClicked }: {groupedLogs: GroupedLogs[], cancelClicked: () => void} = $props();
  console.log(typeof(groupedLogs[0].datestamp));
</script>

<div class="top-bar">
  <h1>Edit History</h1>
  <button class="understated top button" onclick={cancelClicked}>Cancel</button>
</div>

<div class="content">
  {#each groupedLogs as glogs}
    <h2 class="datestamp">{glogs.datestamp}</h2>
    {#each glogs.logs as log}
      <div class="edit log">
        <img class="delete-icon" src="/delete.png" alt="delete icon">
        <div>{log["timestamp"]}</div>
        <div>{log["activity"]}</div>
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
      </div>
    {/each}
  {/each}
</div>

<style lang="scss">
  $primary-color: #725CAD;
  $understated-color: #E1E1E1;
  $dark-color: #0B1D51;
  $secondary-color: #8CCDEB;
  $darker-understated-color: #cacaca;

  // Button styling
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

  .button.understated {
    background-color: $understated-color;
    color: $dark-color;
  }

  .button.understated:hover, .button.understated:focus {
    background-color: $darker-understated-color;
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
    border-bottom: 1px solid $understated-color;
    padding: 1em 0;

    path {
      fill: $dark-color;
      stroke: $dark-color;
    }
  }
</style>