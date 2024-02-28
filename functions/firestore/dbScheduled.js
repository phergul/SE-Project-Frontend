const functions = require('firebase-functions');
const admin = require('../adminInit');


//daily check for reoccuring tasks
exports.scheduledTaskChecker = functions.pubsub.schedule('every 24 hours').onRun((context) => {
    const now = new Date();
    const usersRef = admin.firestore().collection('tasks');

    return usersRef.get().then(snapshot => {
        snapshot.forEach(userDoc => {
            const userTasksRef = usersRef.doc(userDoc.id).collection('created');

            userTasksRef.where('nextRun', '<=', now.toISOString()).get()
                .then(taskSnapshot => {
                    taskSnapshot.forEach(taskDoc => {
                        const task = taskDoc.data();

                        console.log(`Running task for user ${userDoc.id}: ${task.title}`);

                        let nextRun = new Date(task.nextRun);
                        if (task.frequency === 'daily') {
                            nextRun.setDate(nextRun.getDate() + 1);
                        } else if (task.frequency === 'weekly') {
                            nextRun.setDate(nextRun.getDate() + 7);
                        } else if (task.frequency === 'monthly') {
                            nextRun.setDate(nextRun.getDate() + (new Date(now.getFullYear(), now.getMonth(), 0).getDate()))
                        }
                        userTasksRef.doc(taskDoc.id).update({ nextRun: nextRun.toISOString() });
                    });
                })
                .catch(error => console.error(`Error fetching tasks for user ${userDoc.id}: ${error}`));
        });
    }).catch(error => console.error(`Error fetching users: ${error}`));
});

exports.checkRecurringTasks = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    const tasksSnapshot = await admin.firestore().collectionGroup('tasks')
        .where('dueDate', '<=', now)
        .where('recurrence.frequency', 'in', ['daily', 'weekly', 'monthly'])
        .get();

    if (tasksSnapshot.empty) {
        console.log('No recurring tasks to process.');
        return null;
    }

    tasksSnapshot.forEach(async (doc) => {
        const task = doc.data();
        const newDueDate = getNextDueDate(task.date.toDate(), task.recurrence.frequency);

        const userId = doc.ref.path.split('/')[1];

        const newTask = {
            ...task,
            date: admin.firestore.Timestamp.fromDate(newDueDate),
        };

        await admin.firestore().collection(`tasks/${userId}/created`).add(newTask);
    });

    console.log('Recurring tasks processed.');
});

function getNextDueDate(currentDate, frequency) {
    const date = new Date(currentDate);
    switch (frequency) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        default:
            throw new Error('Invalid frequency');
    }
    return date;
}
