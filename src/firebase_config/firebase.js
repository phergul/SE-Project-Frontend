import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDIWFgP95oBd3LQlTTwAnzYpIhKwtF7p4",
  authDomain: "se-project-b72d4.firebaseapp.com",
  projectId: "se-project-b72d4",
  storageBucket: "se-project-b72d4.appspot.com",
  messagingSenderId: "512126251979",
  appId: "1:512126251979:web:ada35f24472a2fadeafc4e",
  measurementId: "G-PFWP2VWSWJ"
};

const app = initializeApp(firebaseConfig);

//firebase auth and db references
export const auth = getAuth(app);
export const db = getFirestore(app);