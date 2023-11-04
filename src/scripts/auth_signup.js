import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase_config/firebase";

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
        });
}