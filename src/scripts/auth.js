// this file will export every function relating to firebase's authentication

import { auth } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();

//creates a new user in auth
export const signUP = (email, password, username) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed up
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      console.log(user);

            const sendUserInfo = httpsCallable(functions, 'sendUserInfo');
            sendUserInfo({ displayName: username });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error code: ${errorCode}. ${errorMessage}`);
        });
}

//signs in to an existing user
export const signIN = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Successfully signed in");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Error code: ${errorCode}. ${errorMessage}`);
    });
};

export const signOUT = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Error code: ${errorCode}. ${errorMessage}`);
    });
};

export const checkAuthStatus = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // This ensures we unsubscribe from the listener once we get the status
        if (user) {
          // User is signed in
          resolve({ isSignedIn: true, user: user });
        } else {
          // User is signed out
          resolve({ isSignedIn: false });
        }
      },
      reject
    );
  });
};
