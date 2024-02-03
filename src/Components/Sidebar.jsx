// Sidebar.jsx
import "./Home.css";
import { useState } from "react";
import PropTypes from "prop-types";

const Sidebar = ({ onAddTask }) => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const handleAddClick = (event) => {
    event.preventDefault();

    const newTask = {
      name: inputValue,
      time: time,
      date: date,
    };

    onAddTask(newTask);

    setTasks([...tasks, newTask]);

    setInputValue("");
    setTime("");
    setDate("");
  };

  return (
    <div className="sidebar">
      <form onSubmit={handleAddClick}>
        <label htmlFor="event-task" type="text">
          Enter Task:
        </label>
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
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit">Create Task</button>
      </form>
      <div className="tasks-list">
        {tasks.map((task, index) => (
          <div key={index} className="task-item">
            <p>Task: {task.name}</p>
            <p>Time: {task.time}</p>
            <p>Day: {task.day}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  onAddTask: PropTypes.func.isRequired,
};

export default Sidebar;
