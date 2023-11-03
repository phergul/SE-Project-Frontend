import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase_setup/firebase";

//get user info here...


signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });