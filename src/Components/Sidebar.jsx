// Sidebar.jsx
import './Home.css';
import { useState } from 'react';

const Sidebar = () => {
  
  
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [time, setTime] = useState('');
    const [day, setDay] = useState('');
  
    const handleAddClick = (event) => {
      event.preventDefault();

      const newTask = {
        name: inputValue,
        time: time,
        day: day,
      };

      setTasks([...tasks, newTask]);

      setInputValue('');
      setTime('');
      setDay('');

  };

  const renderTasks = () => {
    return tasks.map((task, index) => (
      <div key={index} className="task-item">
        <p>Task: {task.name}</p>
        <p>Time: {task.time}</p>
        <p>Day: {task.day}</p>
      </div>
    ));
  };
  
  return (
      <div className='sidebar'>
      <form onSubmit={handleAddClick}>
        <label htmlFor="event-task" type="text" >Enter Task:</label>
        <input
          type="text"
          id="event-name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
  
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
  
        <label htmlFor="day">Day:</label>
        <input
          type="date"
          id="day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          required
        />
  
        
  
        <button type="submit" >Create Task</button>
      </form>
      <div className="tasks-list">
        {renderTasks()}
      </div>
    </div>
    );
  
};

export default Sidebar;
