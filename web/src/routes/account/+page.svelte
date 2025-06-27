<script lang="ts">
import { auth } from "$lib/firebase-client";
import { signOut, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import AnonAccount from "./AnonAccount.svelte";
import UserAccount from "./UserAccount.svelte";

let signingOut = $state(false);
let signedInUser: User | undefined = $state();

async function signout() {
  signingOut = true;
  await signOut(auth);
}

onAuthStateChanged(auth, (user) => {
  console.debug("Auth state has changed!");
  if (user) {
    signedInUser = user;
  } else {
    signedInUser = undefined;
  }
});

</script>

<div class="top-bar">
  <h1>Account</h1>
</div>

<div class="content">
  {#if signedInUser}
    {#if signedInUser.isAnonymous}
      <AnonAccount user={signedInUser} {signout} {signingOut} />
    {:else}
      <UserAccount user={signedInUser} {signout} {signingOut} />
    {/if}
  {:else}
    <p>You are not signed in.</p>
  {/if}
</div>
<style lang="scss">
  @use "../../styles/main";
</style>