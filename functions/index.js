/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.validateEmailAddress = functions.https.onRequest((req, res) => {

    // Get the email address from the request body.
    const emailAddress = req.body.emailAddress
    
    // Validate the email address.
    const isValid =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress);
    
    // If the email address is valid, return a success response.
    if (isValid) { res.sendStatus(200); } else {
        // If the email address is not valid, return an error response.
        res.sendStatus(400); 
    }
});
