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



//import functions from files and then export as cloud functions

/*

    import and then export auth related functions

*/
const {
    searchUsersByDisplayName
} = require('./auth/authCalls');

const {
    createUserDocument
} = require('./auth/authTriggers');


exports.searchUsersByDisplayName = searchUsersByDisplayName;
exports.createUserDocument = createUserDocument;



/*

    import and then export firestore related functions

*/
const {
    sendUserInfo,
    deleteCreatedTask,
    updateTask,
    listFriends,
    sendFriendRequest,
    acceptFriendRequest,
    addFriendToTask,
    //searchUsersByDisplayName,
} = require('./firestore/dbCalls');

const {
    checkRecurringTasks
} = require('./firestore/dbScheduled');

const {

} = require('./firestore/dbTriggers');


exports.sendUserInfo = sendUserInfo;
exports.deleteCreatedTask = deleteCreatedTask;
exports.updateTask = updateTask;
exports.listFriends = listFriends;
exports.sendFriendRequest = sendFriendRequest;
exports.acceptFriendRequest = acceptFriendRequest;
exports.addFriendToTask = addFriendToTask;
exports.checkRecurringTasks = checkRecurringTasks;
//exports.searchUsersByDisplayName = searchUsersByDisplayName;