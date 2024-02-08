//loads existing friend requests and also listens for new ones

import { db } from '../firebase_config/firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';

export const listenLoadIncomingRequests = (currentUser, callback) => {
    const userRequests = collection(db, 'requests', currentUser);
  
    // fetch initial friend requests (before listener active)
    const initialQuery = query(userRequests, 'friendRequests', where('status', '==', 'pending'));
    getDocs(initialQuery).then((querySnapshot) => {
      const initialIncomingRequests = [];
      querySnapshot.forEach((doc) => {
        const request = doc.data();
        initialIncomingRequests.push({ id: doc.id, ...request });
      });
      callback(initialIncomingRequests);
    });
  
    // create a real-time listener for incoming friend requests
    const realTimeQuery = query(userDocumentRef, 'friendRequests', where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(realTimeQuery, (snapshot) => {
      const incomingRequests = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const request = change.doc.data();
          incomingRequests.push({ id: change.doc.id, ...request });
        }
      });
      callback(incomingRequests);
    });
  
    // return an unsubscribe function to stop listening when needed
    return unsubscribe;
};