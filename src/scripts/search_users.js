//searches for users by using 'users' collection
//returns an array with the resulting docs

import { db } from '../firebase_config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const searchUsers = async (input) => {
    const query = input.trim();

    //min query length
    if (query.length >= 3) {
        return results = await searchUsersByDisplayName(query);
    }
    else {
        return alert('Please enter a username of length 3 or more');
    }
}

const searchUsersByDisplayName = async (displayName) => {
    const usersCollection = collection(db, 'users');

    // create a query to find users with the given displayName
    const q = query(usersCollection, where('displayName', '==', displayName));

    try {
        const querySnapshot = await getDocs(q);
        const results = [];

        querySnapshot.forEach((doc) => {
            //pushes each doc into results array
            results.push(doc.data());
        });

        return results;
    } catch (error) {
        console.error('Error searching for users:', error);
        return [];
    }
}