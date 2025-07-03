<script lang="ts">
	import { goto } from "$app/navigation";
  import { GoogleAuthProvider, linkWithPopup, type User } from "firebase/auth";

  let { user, signout, signingOut, appVer }: { 
    user: User, 
    signout: () => void, 
    signingOut: boolean,
    appVer: string
  } = $props();

  async function anonSignout() {
    if (confirm("You will lose all your data, there is no way to sign in again!")) {
      await signout();
    }
  }

  async function linkAccount() {
    try {
      let result = await linkWithPopup(user, new GoogleAuthProvider());
      const creds = GoogleAuthProvider.credentialFromResult(result);
      let linkedUser = result.user;
      console.log(`Linking successful. new user id is ${linkedUser.uid}`);
      goto("/account", {invalidate: ["/account"]});
    } catch (error: any) {
      console.log(error.code);
      console.error(error.message);
    }
  }
</script>

<h2>Welcome!</h2>
<p><strong>User Id: </strong> {user.uid}</p>
<p><strong>App Version: </strong> {appVer}</p>
<div class="buttons">
  <button class="primary button" onclick={linkAccount}>Link Google Account</button>

  {#if signingOut}
    <button class="understated button" disabled>Sign Out</button>
  {:else}
    <button onclick={anonSignout} class="understated button">Sign Out</button>
  {/if}
</div>
<hr />

<button class="danger button" onclick={() => alert("Not implemented yet!")}>Delete Account</button>

<style lang="scss">
  @use "../../styles/vars";
  @use "../../styles/button";
  @use "../../styles/primary_button";
  @use "../../styles/danger_button";

  h2 {
    color: vars.$secondary-color;
  }

  hr {
    margin: 3em 0 5em 0;
  }

  .buttons {
    display: flex;
    flex-flow: row wrap;
    gap: 2em;
  }
</style>