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

//firestore reference
const firestore = admin.firestore();

exports.createUserDoc = functions.auth.user().onCreate((user) => {
    const { uid, email } = user;
  
    //debug
    functions.logger.log('User created:', uid, email);
    functions.logger.log(user);''
  
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


//adds display name to database for user
exports.sendUserInfo = functions.https.onCall((data, context) => {
    const userRef = firestore.collection('users').doc(context.auth.uid);

    return userRef.update(data, { merge: true });
})


//callable for creating a task by user with SDK
exports.createTask = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) 
        {
            throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to create a task.');
        }

        const callerUid = context.auth.uid;
        const callerTasksRef = firestore.collection('tasks').doc(callerUid).collection('created');

        if (!data || !data.name || !data.time || !data.date) 
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


//returns array of tasks relating to uid calling
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


//searches database for users with display name
exports.searchUsersByDisplayName = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to call this function.');
    }
  
    if (!data.inputValue) {
      throw new functions.https.HttpsError('invalid-argument', 'The inputValue parameter is required.');
    }
  
    const displayName = data.inputValue;
  
    try {
      const listUsersResult = await admin.auth().listUsers();
  
      const usersWithDisplayName = listUsersResult.users.filter(user => user.displayName === displayName);
  
      return usersWithDisplayName;
    } catch (error) {
      console.error('Error searching users:', error);
      throw new functions.https.HttpsError('internal', 'An error occurred while searching users.');
    }
});


//function that adds a given friend to a task
exports.addFriendToTask = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const friendUserId = data.friendUserId;
    const taskId = data.taskId;
    const userId = context.auth.uid;

    if (!friendUserId || !taskId) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with two arguments "friendUserId" and "taskId".');
    }

    const userTasksRef = firestore.collection('tasks').doc(userId).collection('created').doc(taskId);

    return firestore.runTransaction(async (transaction) => {
        const taskDoc = await transaction.get(userTasksRef);

        if (!taskDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'The task document does not exist.');
        }

        const taskData = taskDoc.data();

        if (taskData.joinedUsers && taskData.joinedUsers.includes(friendUserId)) {
            throw new functions.https.HttpsError('already-exists', 'The user is already added to the task.');
        }

        transaction.update(userTasksRef, {
            joinedUsers: firestore.FieldValue.arrayUnion(friendUserId)
        });
    })
    .then(() => {
        console.log('Friend added to task successfully.');
        return { result: 'Friend added to task successfully.' };
    })
    .catch(error => {
        console.error('Error adding friend to task: ', error);
        throw new functions.https.HttpsError('unknown', 'An error occurred while adding the friend to the task.', error);
    });
});


//deletes a task that the user created
exports.deleteCreatedTask = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const taskId = data.id;
    const userId = context.auth.uid;

    const userTasksRef = firestore.collection('tasks').doc(userId).collection('created').doc(taskId);

    try {
        await userTasksRef.delete();
        return { success: true, message: 'Task deleted successfully.' };
    } catch (error) {
        console.error('Error deleting task:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while deleting the task.', error);
    }
});


//update/appends data to a created task using its id
exports.updateTask = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const taskId = data.id;
    const newData = data.newData;

    const taskRef = admin.firestore().collection('tasks').doc(userId).collection('created').doc(taskId);

    try {
        await taskRef.set(newData, { merge: true });
        
        return { success: true, message: 'Task updated successfully.' };
    } catch (error) {
        console.error('Error updating task:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while updating the task.', error);
    }
});