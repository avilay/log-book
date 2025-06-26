<script lang="ts">
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase-client";
  import { GoogleAuthProvider, onAuthStateChanged, signInAnonymously, signInWithPopup } from "firebase/auth";
  import 'firebaseui/dist/firebaseui.css'


  async function googleSignIn() {
    // Sign in using a popup.
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    const result = await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    console.log(user);
  }

  async function anonSignIn() {
    const result = await signInAnonymously(auth);

    // The anon user info
    const user = result.user;
    console.log(user);
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
  <div><button class="button primary" onclick={googleSignIn}>Sign In with Google</button></div>
  <div><button class="button secondary" onclick={anonSignIn}>Use Anonymously</button></div>
  <div><button class="button understated">Explore Demo</button></div>
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

    div button {
      width: 30%;
    }
  }
</style>