// this file will export every function relating to firebase's authentication

import { auth } from "../firebase_config/firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from "firebase/auth";

//creates a new user in auth
export const signUP = (email, password, username) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            //add display name
            userCredential.user.displayName = username;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            //i dont know how to show the error message back to the page. (e.g. if email already has account)
            //could return them from the function call maybe
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