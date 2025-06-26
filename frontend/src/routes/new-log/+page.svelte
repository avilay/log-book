<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_API } from "$env/static/public";
  import { toDateTimeLocalISOString } from "$lib";
	import { onAuthStateChanged } from "firebase/auth";
	import { auth } from "$lib/firebase-client";

  let uploading = $state(false);
  let now = toDateTimeLocalISOString(new Date());
  let token = $state("");

  onAuthStateChanged(auth, async (user) => {
    console.log("Inside onAuthStateChanged");
    if (user) {
      token = await user.getIdToken(false);
      console.log(token);
    } else {
      goto("/");
    }
    console.log("Done with onAuthStateChanged");
  });

  async function newLog(e: Event) {
    e.preventDefault();
    uploading = true;
    const formData = new FormData(e.target as HTMLFormElement);
    let log: Log = {
      timestamp: new Date(Date.parse(formData.get("timestamp") as string)),
      activity: formData.get("activity") as string
    }
    let url = `${PUBLIC_API}/logs`;
    const resp = await fetch(
      url, 
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Token": token
        },
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