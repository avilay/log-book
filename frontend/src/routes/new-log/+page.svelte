<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API } from "$env/static/public";

  let uploading = $state(false);
  // let now = "2025-06-24T07:21";
  let today = new Date();
  let year = today.getFullYear();
  let month = (today.getMonth() + 1).toString().padStart(2, "0");
  let day = (today.getDate()).toString().padStart(2, "0");
  let hour = (today.getHours()).toString().padStart(2, "0");
  let min = (today.getMinutes()).toString().padStart(2, "0");
  let now = `${year}-${month}-${day}T${hour}:${min}`;

  async function newLog(e: Event) {
    e.preventDefault();
    uploading = true;
    const formData = new FormData(e.target as HTMLFormElement);
    let log: Log = {
      timestamp: formData.get("timestamp") as string,
      activity: formData.get("activity") as string
    }
    console.log(JSON.stringify(log));
    let url = `${PUBLIC_API}/logs`;
    const resp = await fetch(
      url, 
      {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      }
    );
    const addedLog = await resp.json();
    console.log(addedLog);
    goto("/history");
  }
</script>

<div class="top-bar">
  <h1>New Log</h1>
</div>

<div class="content">
  <form class="new-log" onsubmit={newLog}>
    <input type="datetime-local" name="timestamp" value={now} aria-label="created-at">
    <input type="text" name="activity" placeholder="Enter activity here" aria-label="activity">
    <div class="buttons">
      {#if uploading}
        <button class="button" disabled type="submit">Save</button>
        <button class="button" disabled type="reset">Cancel</button>
      {:else}
        <button class="button primary" type="submit">Save</button>
        <button class="button understated" type="reset">Cancel</button>
      {/if}
    </div>
  </form>
</div>

<style lang="scss">
  $dark-color: #0B1D51;
  $primary-color: #725CAD;
  $understated-color: #E1E1E1;
  $light-color: #FFE3A9;
  $darker-primary-color: #241d37;
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

  .button.primary {
    background-color: $primary-color;
    color: $light-color;
  }

  .button.primary:hover, .button.primary:focus {
    background-color: $darker-primary-color;
  }

  .button.understated {
    background-color: $understated-color;
    color: $dark-color;
  }

  .button.understated:hover, .button.understated:focus {
    background-color: $darker-understated-color;
  }

  .button[disabled] {
    background-color: lightgray;
    cursor: progress;
    color: gray;
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

  .content {
    margin-top: 1em;
  }

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
      border: 1px solid $dark-color;
      border-radius: 7px;
    }

    input[type="text"], input[type="text"]:focus, input[type="text"]:focus-visible {
      padding: 0.5em;
      font-size: 1.25rem;
      color: inherit;
      border: 0;
      outline: 0;
      background: transparent;
      border-bottom: 1px solid $dark-color;
    }

    ::placeholder {
      color: $understated-color;
    }

    .buttons {
      margin-top: 1.5em;
    }

    button[type="submit"] {
      margin-right: 1em;
    }
  }
</style>