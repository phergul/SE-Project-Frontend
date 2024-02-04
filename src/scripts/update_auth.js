//this file will contain functions what allow the user to update their accounts info
//such as reseting passwords, updating email address or deleting account

import { auth } from "../firebase_config/firebase";
import { 
    deleteUser,
    updateEmail,
    sendPasswordResetEmail,
    reauthenticateWithCredential
} from "firebase/auth";

//gets current user
const user = auth.currentUser;

//deletes the account of current user (will sign user out)
export const deleteAccount = () => {
    reauthenticateUser();
    deleteUser(user)
        .then(() => {
            // User deleted
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error code: ${errorCode}. ${errorMessage}`);
        });
}

//updates users email address
export const updateUserEmail = (newEmail) => {
    reauthenticateUser();
    updateEmail(user, newEmail)
        .then(() => {
            // Email updated
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error code: ${errorCode}. ${errorMessage}`);
        });
}

//sends the user a password reset email
export const resetPasswordEmail = (email) => {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error code: ${errorCode}. ${errorMessage}`);
        });
}

//makes the user sign in again for security if they logged in a while ago
//exported incase you wanted to do this separately
export const reauthenticateUser = () => {
    //gets the users login info
    //might need to be async-await ?
    const credential = promptForCredentials();

    reauthenticateWithCredential(user, credential)
        .then(() => {
            // User re-authenticated
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error code: ${errorCode}. ${errorMessage}`);
        });
}

const promptForCredentials = () => {
    //TODO:
    //get user to re-enter their credentials
    //called in reauthenicateUser() above
}