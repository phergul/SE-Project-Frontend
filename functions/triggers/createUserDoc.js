const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Firestore reference
const firestore = admin.firestore();

exports.createUserDoc = functions.auth.user().onCreate((user) => {
  const { uid, email } = user;

  //debug
  functions.logger.log('User created:', uid, email);
  functions.logger.log(user);''

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
  .then(() => {
    return (firestore.collection('tasks').doc(uid).collection('created'), firestore.collection('tasks').doc(uid).collection('joined'));
  })
  .catch((error) => {
    console.error(`Error upon creating user document with user id: ${uid}`, error);
  })
})


exports.createTask = functions.https.onCall((data, context) => {
  const callerUid = context.auth.uid;
  functions.logger.log("//test// User id : ", callerUid);
})