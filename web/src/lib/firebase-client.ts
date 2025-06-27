import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { PUBLIC_FB_API_KEY, PUBLIC_FB_APP_ID } from "$env/static/public";

const firebaseConfig = {
    apiKey: PUBLIC_FB_API_KEY,
    authDomain: "quickstart-1609370040240.firebaseapp.com",
    projectId: "quickstart-1609370040240",
    storageBucket: "quickstart-1609370040240.firebasestorage.app",
    messagingSenderId: "976223862538",
    appId: PUBLIC_FB_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

