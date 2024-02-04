// function for sending a user a friend request from the calling user

import { db, auth } from '../firebase_config/firebase';
import { doc, setDoc } from 'firebase/firestore';

const sender = auth.currentUser;

//function to send a friend request
export const sendFriendRequest = async (receiverUid) => {
    const senderDocRef = doc(db, 'requests', sender.uid);
    const receiverDocRef = doc(db, 'requests', receiverUid);

    //create the friend request data
    const friendRequestData = {
        displayName: sender.displayName,
        status: 'pending',
    };

    try {
        //update the sender's document
        await setDoc(senderDocRef, {
        [`ownRequests.${receiverUid}`]: friendRequestData,
        }, { merge: true });

        //update the receiver's document
        await setDoc(receiverDocRef, {
        [`friendRequests.${sender.uid}`]: friendRequestData,
        }, { merge: true });

        console.log('Friend request sent successfully!');
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
}