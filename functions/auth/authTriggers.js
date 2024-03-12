const functions = require('firebase-functions');
const admin = require('../adminInit');
const firestore = admin.firestore();


//creates a users doc based off of their UserRecord object
exports.createUserDocument = functions.auth.user().onCreate(async (user) => {
    const userRef = firestore.collection('users').doc(user.uid);

    try {
        await userRef.set({
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            metadata: {
                creationTime: user.metadata.creationTime,
            },
        });

        functions.logger.log('User created:', user.uid);

        createRequestsDoc(user);

        console.log(`Successfully created document for user ${user.uid}`);
    } catch (error) {
        console.error(`Error creating document for user ${user.uid}:`, error);
        throw new functions.https.HttpsError('internal', `Error creating document for user ${user.uid}.`);
    }
});


//created firestore doc for user on creation
const createRequestsDoc = (user) => {

    const { uid, email } = user;

    const requestData = {
        ownRequests: {},
        friendRequests: {},
        allFriends: {},
    };

    return firestore.collection('requests').doc(uid).set(requestData);
}