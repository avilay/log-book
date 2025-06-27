<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase-client";
  import { GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithPopup } from "firebase/auth";
  import { PUBLIC_API } from "$env/static/public";


  async function googleSignIn() {
    // Sign in using a popup.
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
    } catch (error) {
        const err = error as Error;
        console.error('Error signing in user:', err.message);
        throw new Error("Unable to sign in!");
    }
  }

  async function anonSignIn() {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      console.log(user);
    } catch (error) {
      const err = error as Error;
      console.error('Error signing in anon user:', err.message);
      throw new Error("Unable to sign in!");
    }
  }

  async function demoSignIn() {
    const result = await signInAnonymously(auth);
    const user = result.user;
    const token = await user.getIdToken(false);
    let url = `${PUBLIC_API}/gen-demo`;
    const resp = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "X-Token": token
        }
      }
    );
    if (!resp.ok) {
      console.error(`Unable to set demo data for this anon user ${user.uid}`);
      // TODO: Show some sort of error dialog to user
    }
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      goto("/new-log");
    }
  });
  
  
</script>

<div class="top-bar">
  <h1>Welcome to Log App</h1>
</div>

<div class="content">
  <button class="button primary" onclick={googleSignIn}>Sign In with Google</button>
  <button class="button secondary" onclick={anonSignIn}>Use Anonymously</button>
  <button class="button understated" onclick={demoSignIn}>Explore Demo</button>
</div>


<style lang="scss">
  @use "../styles/vars";
  @use "../styles/button";
  @use "../styles/primary_button";
  @use "../styles/secondary_button";
  @use "../styles/understated_button";
  @use "../styles/main";

  .content {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    gap: 1em;

    button {
      width: 80%;
    }
  }

  @media (min-width: 500px) {
    .content button {
      width: 30%;
    }
  }
</style>