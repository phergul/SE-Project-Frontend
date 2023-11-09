/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
*/

// import all functions to be deployed
const createUserDoc = require('./createUserDoc');

exports.createUserDoc = createUserDoc.createUserDoc;
