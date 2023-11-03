import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase_setup/firebase";

//get user info and check validity

//check validity (backend)

createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });