const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
admin.initializeApp();

// Firestore reference
const firestore = admin.firestore();

exports.createTask = functions.https.onCall((data, context) => {
    const callerUid = context.auth.uid;
    functions.logger.log("//test// User id : ", callerUid);
})