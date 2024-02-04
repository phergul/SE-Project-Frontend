//searches for users by using 'users' collection
//returns an array with the resulting docs

import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();

export const searchUsers = async (input) => {
    const query = input.trim();

    //min query length
    if (query.length >= 3) {
        try {
            const searchUsersByDisplayName = httpsCallable(functions, 'searchUsersByDisplayName');
            const results = await searchUsersByDisplayName({ displayName: query });

            console.log('Search results:', results.data);
            return results.data;
        } catch (error) {
            console.error('Error searching users:', error);
            return [];
        }
    }
    else {
        return alert('Please enter a username of length 3 or more');
    }
}