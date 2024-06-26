const functions = require('firebase-functions');
const admin = require('../adminInit');
const firestore = admin.firestore();

//adds display name to database for user
exports.sendUserInfo = functions.https.onCall((data, context) => {
    const userRef = firestore.collection('users').doc(context.auth.uid);

    return userRef.update(data, { merge: true });
})



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

    const taskRef = firestore.collection('tasks').doc(userId).collection('created').doc(taskId);

    try {
        await taskRef.set(newData, { merge: true });

        return { success: true, message: 'Task updated successfully.' };
    } catch (error) {
        console.error('Error updating task:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while updating the task.', error);
    }
});


//search for a user in collection by display name
exports.searchUsersByDisplayName = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    if (!data.inputValue) {
        throw new functions.https.HttpsError('invalid-argument', 'A valid display name must be inputted.')
    }

    const inputWords = data.inputValue.toLowerCase().split(/\s+/);

    try {
        const usersRef = firestore.collection('users');
        const snapshot = await usersRef.get();
        let matchedUsers = [];

        snapshot.forEach(doc => {
            const userData = doc.data();

            if (userData.displayName) {
                const displayNameWords = userData.displayName.toLowerCase().split(/\s+/);
                const isMatch = displayNameWords.some(displayNameWord =>
                    inputWords.some(inputWord => displayNameWord.includes(inputWord))
                );

                if (isMatch) {
                    matchedUsers.push({
                        uid: doc.id,
                        displayName: userData.displayName,
                        email: userData.email
                    });
                }
            }
        });

        return matchedUsers;
    } catch (error) {
        console.error('Error searching users in Firestore:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while searching users in Firestore.');
    }
});




//lists all friends of calling user
exports.listFriends = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userFriendsRef = firestore.collection('requests').doc(context.auth.uid).collection('allFriends')

    try {
        const snapshot = await userFriendsRef.get();
        const friends = [];

        snapshot.forEach(doc => {
            friends.push(admin.auth().getUser(doc.id)
                .then(friendRecord => {
                    return { uid: friendRecord.uid, email: friendRecord.email };
                })
                .catch(error => {
                    console.error('Error fetching friend details:', error);
                    return null;
                }))
        });

        return { friends }
    } catch (error) {
        console.error('Error retrieving friends', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while retrieving friends list.');
    }
});




//send a user a friend request with their id
exports.sendFriendRequest = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const friendId = data.user.id;

    const userReqRef = firestore.collection('requests').doc(userId).collection('ownRequests').doc(friendId);
    const friendReqRef = firestore.collection('requests').doc(friendId).collection('friendRequests').doc(userId);

    try {
        await userReqRef.set({
            status: 'pending',
            timeSent: admin.firestore.FieldValue.serverTimestamp()
        })
        await friendReqRef.set({
            status: 'received',
            timeReceived: admin.firestore.FieldValue.serverTimestamp()
        })

        return { success: true, message: 'Friend request successfully sent' };
    } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError('internal', 'An error occured when sending your friend request.', error);
    }
});




//accepts a users friend request
exports.acceptFriendRequest = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const userId = context.auth.uid;
    const friendId = data.user.id;

    const userReqRef = firestore.collection('requests').doc(userId).collection('friendRequests').doc(friendId);
    const senderReqRef = firestore.collection('requests').doc(friendId).collection('ownRequests').doc(userId);

    try {
        await userReqRef.set({
            status: 'accepted',
            timeAccepted: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        await senderReqRef.set({
            status: 'accepted',
            timeAccepted: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true })

        return { success: true, message: 'Friend request successfully accepted' };
    } catch (error) {
        console.error(error);
        throw new functions.https.HttpsError('internal', 'An error occured when accepting your friend request.', error);
    }
})




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