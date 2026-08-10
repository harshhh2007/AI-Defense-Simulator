import { initializeApp, getApps } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBjYM6UOu3jkiVC_T3-v8wHMYMhZZmhQ6I",
  authDomain: "ai-defense-simulator.firebaseapp.com",
  projectId: "ai-defense-simulator",
  storageBucket: "ai-defense-simulator.appspot.com",
  messagingSenderId: "1058428248498",
  appId: "1:1058428248498:web:7c3d5e5e5e5e5e5e5e5e5e"
};


/* =========================================================
   FIREBASE APP
========================================================= */

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig);


/* =========================================================
   MAIN AUTH
========================================================= */

export const auth = getAuth(app);


/* =========================================================
   GOOGLE PROVIDER
========================================================= */

export const googleProvider =
  new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});


/* =========================================================
   FIRESTORE
========================================================= */

export const db =
  getFirestore(app);


/* =========================================================
   AUTH PERSISTENCE
========================================================= */

setPersistence(
  auth,
  browserLocalPersistence
).catch((error) => {
  console.error(
    "Firebase persistence error:",
    error
  );
});


export default app;