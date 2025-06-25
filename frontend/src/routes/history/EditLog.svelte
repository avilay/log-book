<script lang="ts">
  import { PUBLIC_API } from "$env/static/public";
  import { invalidate, goto } from "$app/navigation";
  import { toDateTimeLocalISOString } from "$lib";

  let { log }: {log: Log} = $props();
  let updating = $state(false);

  // let timestamp = log["timestamp"];
  // let year = timestamp.getFullYear();
  // let month = (timestamp.getMonth() + 1).toString().padStart(2, "0");
  // let day = (timestamp.getDate()).toString().padStart(2, "0");
  // let hour = (timestamp.getHours()).toString().padStart(2, "0");
  // let min = (timestamp.getMinutes()).toString().padStart(2, "0");
  // let ts = `${year}-${month}-${day}T${hour}:${min}`;

  async function editLog(e: Event) {
    e.preventDefault();
    updating = true;
    const formData = new FormData(e.target as HTMLFormElement);
    log.timestamp = new Date(Date.parse(formData.get("timestamp") as string));
    log.activity = formData.get("activity") as string;
    let url = `${PUBLIC_API}/logs`;
    const resp = await fetch(
      url,
      {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(log)
      }
    );
    if (resp.ok) {
      console.log(`Log ${log.logId} updated.`);
    } else {
      console.error(`Unable to update log ${log.logId}!`)
    }
    await invalidate(`${PUBLIC_API}/logs?grouped=true`);
    goto("/history");
  }
</script>
<div class="top-bar">
  <h1>Edit Log</h1>
</div>

<div class="content">
  <form class="new-log" onsubmit={editLog}>
    <input type="datetime-local" name="timestamp" value={toDateTimeLocalISOString(log["timestamp"])} aria-label="created-at">
    <input type="text" name="activity" value={log["activity"]} aria-label="activity">
    <div class="buttons">
      {#if updating}
        <button class="button" disabled type="submit">Save</button>
        <button class="button" disabled type="reset">Cancel</button>
      {:else}
        <button class="button primary" type="submit">Save</button>
        <button class="button understated" onclick={() => goto("/history")}>Cancel</button>
      {/if}
    </div>
  </form>
</div>

<style lang="scss">
  @use "../../styles/vars";
  @use "../../styles/button";
  @use "../../styles/primary_button";
  @use "../../styles/understated_button";
  @use "../../styles/disabled_button";
  @use "../../styles/main";

  .new-log {
    // Give new-log page some more breathing room at the top
    margin-top: 4em;

    display: flex;
    flex-flow: column nowrap;
    gap: 1em;

    input {
      width: 100%;
      margin-top: 1.5em;
    }

    input[type="datetime-local"] {
      padding: 0.5em;
      color: inherit;
      border: 1px solid vars.$dark-color;
      border-radius: 7px;
    }

    input[type="text"], input[type="text"]:focus, input[type="text"]:focus-visible {
      padding: 0.5em;
      font-size: 1.25rem;
      color: inherit;
      border: 0;
      outline: 0;
      background: transparent;
      border-bottom: 1px solid vars.$dark-color;
    }

    ::placeholder {
      color: vars.$understated-color;
    }

    .buttons {
      margin-top: 1.5em;
    }

    button[type="submit"] {
      margin-right: 1em;
    }
  }
</style>