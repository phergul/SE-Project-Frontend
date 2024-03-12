const functions = require('firebase-functions');
const admin = require('../adminInit');


//searches database for users with display name
exports.searchUsersByDisplayName = functions.https.onCall(async (data, context) => {
    const inputWords = data.inputValue.toLowerCase().split(/\s+/);
    let matchedUsers = [];

    try {
        const listUsersResult = await admin.auth().listUsers();
        const users = listUsersResult.users;

        matchedUsers = users.filter(user =>
            user.displayName && inputWords.some(inputWord =>
                user.displayName.toLowerCase().split(/\s+/).some(displayNameWord =>
                    displayNameWord.includes(inputWord)
                )
            )
        ).map(user => {
            return { uid: user.uid, displayName: user.displayName, email: user.email };
        });
    } catch (error) {
        console.error('Error searching users:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while searching users.');
    }

    return matchedUsers;
});