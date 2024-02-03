import { useState } from 'react';
import Sidebar from '..Components/Sidebar';
import Calendar from '..Components/Calendar';

const Homepage = () => {

    const [tasks, setTasks] = useState([]);


    const handleAddTask = (newTask) => {
        setTasks([...tasks, newTask]);
        };

        return (
            <div>
                <Sidebar onAddTask={handleAddTask} />
                <Calendar tasks={tasks} />
            </div>
        );
    };

    export default Homepage;