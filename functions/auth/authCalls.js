const functions = require('firebase-functions');
const admin = require('../adminInit');


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