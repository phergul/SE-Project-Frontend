// this file will export every function relating to firebase's authentication

import { auth } from "../firebase_config/firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    updateProfile
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

            // Send user info to Cloud Function
            const sendUserInfo = httpsCallable(functions, 'sendUserInfo');
            sendUserInfo({ displayName: user.displayName });
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
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error code: ${errorCode}. ${errorMessage}`);
        });
}

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
}

//checks what state the user is currently (signed in or not)
export const authState = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          // for available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
        } else {
          // User is signed out
        }
      });
}