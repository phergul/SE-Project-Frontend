// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDIWFgP95oBd3LQlTTwAnzYpIhKwtF7p4",
  authDomain: "se-project-b72d4.firebaseapp.com",
  databaseURL:
    "https://se-project-b72d4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "se-project-b72d4",
  storageBucket: "se-project-b72d4.appspot.com",
  messagingSenderId: "512126251979",
  appId: "1:512126251979:web:ada35f24472a2fadeafc4e",
  measurementId: "G-PFWP2VWSWJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export default db;
