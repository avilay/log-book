<script lang="ts">
  import type { User } from "firebase/auth";

  let { user, signout, signingOut, appVer }: { 
    user: User, 
    signout: () => void, 
    signingOut: boolean, 
    appVer: string 
  } = $props();
</script>

<div class="profile">
  <img src={user.providerData[0].photoURL} alt="A head shot of the user profile" />
  <div class="info">
    <h2>Welcome {user.providerData[0].displayName}</h2>
    <p><strong>User Id: </strong> {user.uid}</p>
    <p><string>App Version: </string> {appVer}</p>
  </div>
</div>
<div>
  {#if signingOut}
    <button class="understated button" disabled>Sign Out</button>
  {:else}
    <button onclick={signout} class="understated button">Sign Out</button>
  {/if}
</div>

<hr />

<button class="danger button" onclick={() => alert("Not implemented yet!")}>Delete Account</button>

<style lang="scss">
  @use "../../styles/vars";
  @use "../../styles/button";
  @use "../../styles/understated_button";
  @use "../../styles/danger_button";

  h2 {
    color: vars.$secondary-color;
  }

  img {
    border: 7px solid antiquewhite;
    border-radius: 50%;
  }

  hr {
    margin: 3em 0 5em 0;
  }

  .profile {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-first;
    align-items: center;
    gap: 2em;
    margin-bottom: 1em;
  }
</style>