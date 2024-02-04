/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
*/


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



exports.createTask = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) 
        {
            throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to create a task.');
        }

        const callerUid = context.auth.uid;
        const callerTasksRef = firestore.collection('tasks').doc(callerUid).collection('created');

        if (!data || !data.title || !data.description || !data.startDate || !data.endDate) 
        {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required data fields.');
        }

        const creationTime = admin.firestore.FieldValue.serverTimestamp();
        data.creationTime = creationTime;

        const res = await callerTasksRef.add(data);

        console.log(`Task successfully created with id: ${res.id}`);
        return { message: `Task successfully created with id: ${res.id}` };
    } catch (error) {
        console.error('Error creating task:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while creating the task.');
    }
})


exports.getUserTasks = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) 
        {
            throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to retrieve tasks.');
        }

        const callerUid = context.auth.uid;
        const callerTasksRef = firestore.collection('tasks').doc(callerUid).collection('created');

        const snapshot = await callerTasksRef.get();
        const tasks = [];

        snapshot.forEach(doc => {
            tasks.push({
                id: doc.id,
                data: doc.data()
            });
        });

        return { tasks };
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while retrieving tasks.');
    }
})