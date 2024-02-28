const functions = require('firebase-functions');
const admin = require('../adminInit');

const firestore = admin.firestore();


//created firestore doc for user on creation
exports.createUserDoc = functions.auth.user().onCreate((user) => {
    const { uid, email } = user;

    //debug
    functions.logger.log('User created:', uid, email);
    functions.logger.log(user);

    const userRef = firestore.collection('users').doc(uid);

    //create a document in the 'users' collection with user information (creates a users collection if one doesn't already exist)
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