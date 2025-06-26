<script lang="ts">
import { auth } from "$lib/firebase-client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

let signingOut = $state(false);
let signedInUser: User | undefined = $state();

async function signout() {
  signingOut = true;
  await signOut(auth);
}

onAuthStateChanged(auth, (user) => {
  console.log("Inside onAuthStateChanged");
  if (user) {
    signedInUser = user;
  } else {
    signedInUser = undefined;
  }
  console.log("Done with onAuthStateChanged");
});

</script>

<div class="top-bar">
  <h1>Account</h1>
</div>

{#if signedInUser}
  <p>Welcome {signedInUser.displayName ? signedInUser.displayName : "Anon"}</p>
  <p><strong>User ID:</strong> {signedInUser.uid}</p>
  <img src={signedInUser.photoURL} alt="" />
  <div class="content">
    {#if signingOut}
      <button class="primary button" disabled>Sign Out</button>
    {:else}
      <button onclick={signout} class="primary button">Sign Out</button>
    {/if}
  </div>
{:else}
  <p>You are not signed in.</p>
{/if}
<style lang="scss">
  @use "../../styles/button";
  @use "../../styles/primary_button";
  @use "../../styles/disabled_button";
  @use "../../styles/main";
</style>