//functions for frontend access to tasks collecion (firestore)

import { db, auth } from "../config/firebase";
import {
    addDoc,
    collection,
    getDocs,
    Timestamp,
    deleteDoc,
    query,
    where,
    doc,
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
        if (!user) {
            throw new Error("User not authenticated.");
        }

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


//deletes a task from its id
export const deleteTaskFromFirestore = async (taskId) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not authenticated.");
        }

        const taskToDelete = collection(db, `tasks/${user.uid}/created/${taskId}`);
        const result = await deleteDoc(taskToDelete);

        return result;
    } catch (error) {
        console.error("Error deleting task: ", error);
        throw error;
    }
}


//search for task from an input
export const searchForTask = async (inputQuery) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not authenticated.");
        }

        const tasksRef = collection(db, `tasks/${user.uid}/created/`);
        const q = query(tasksRef, where("name", "==", inputQuery));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No matching tasks found.");
            return [];
        }

        const searchedTasks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return searchedTasks;
    } catch (error) {
        console.error("Error searching for task: ", error);
        throw error;
    }
}