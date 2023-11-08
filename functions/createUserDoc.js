const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Firestore reference
const firestore = admin.firestore();

exports.createUserDoc = functions.auth.user().onCreate((user) => {
  const { uid, email } = user;

  //debug
  console.log('User created:', uid, email);

  const userRef = firestore.collection('users').doc(uid);

  // Create a document in the 'users' collection with user information (creates a users collection if one doesn't already exist)
  return userRef.set({
    email: email,
  })
  .then(() => {
        const requestData = {
            ownRequests: {},
            friendRequests: {},
            allFriends: {},
        };
        
    return firestore.collection('requests').doc(uid).set(requestData);
    })
    .catch((error) => {
        console.error(`Error upon creating user document with user id: ${uid}`, error);
    });
})


