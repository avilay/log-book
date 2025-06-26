import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBrg-Pu0DQCIQBhxv9YIcpZWXR08DpQHEA",
    authDomain: "quickstart-1609370040240.firebaseapp.com",
    projectId: "quickstart-1609370040240",
    storageBucket: "quickstart-1609370040240.firebasestorage.app",
    messagingSenderId: "976223862538",
    appId: "1:976223862538:web:24ca9394963b9b9578c4f3"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

