//functions for frontend access to tasks collecion (firestore)

import { db, auth } from "../config/firebase";
import { 
    addDoc,
    collection,
    getDocs,
    Timestamp,
    deleteDoc
} from "@firebase/firestore";

//adds task to firestore
export const addTaskToFirestore = async (taskData) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not authenticated.");
        }

        taskData.timestamp = Timestamp.now();

        const userTaskRef = collection(db, `tasks/${user.uid}/created`);
        const docRef = await addDoc(userTaskRef, taskData);
        console.log(`Task created by user: ${user.displayName}, with task id: ${docRef.id}`);

        return docRef;
    } catch (error) {
        console.error("Error adding task to Firestore: ", error);
        throw error;
    }
};


//fetches users created tasks
export const fetchTasksFromFirestore = async () => {
    try {
        const user = auth.currentUser;

        const userTasksRef = collection(db, `tasks/${user.uid}/created`);
        const querySnapshot = await getDocs(userTasksRef);
        const fetchedTasks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return fetchedTasks;
    } catch (error) {
        console.error("Error fetching tasks from Firestore: ", error);
        throw error;
    }
};


export const deleteTaskFromFirestore = async (taskId) => {
    try {
        const user = auth.currentUser;

        const taskToDelete = collection(db, `tasks/${user.uid}/created/${taskId}`);
        const result = await deleteDoc(taskToDelete);

        return result;
    } catch (error) {
        console.error("Error deleting task: ", error);
        throw error;
    }
}