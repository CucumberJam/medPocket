import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig =   {
    apiKey: "AIzaSyB3bD1-7GlC7wxS1yovvdgsjhoHL8eToCk",
    authDomain: "jwt-firebase-auth-6b01f.firebaseapp.com",
    projectId: "jwt-firebase-auth-6b01f",
    storageBucket: "jwt-firebase-auth-6b01f.appspot.com",
    messagingSenderId: "332375464171",
    appId: "1:332375464171:web:0750f654a3a689a0a046ae"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
