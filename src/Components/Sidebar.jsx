// Sidebar.jsx
import "./Home.css";
import { useState } from "react";
import PropTypes from "prop-types";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { authState } from "../scripts/auth";
import { addTaskToFirestore } from "../scripts/task";

const Sidebar = ({ onAddTask }) => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const [opened, { open, close }] = useDisclosure(false);

  const handleAddClick = async (event) => {
    event.preventDefault();

    const newTask = {
      name: inputValue,
      time: time,
      date: date,
    };

    onAddTask(newTask);

    try {
      const docRef = await addTaskToFirestore({
        task: inputValue,
        time,
        date,
      });
      setTasks([...tasks, { ...newTask, id: docRef.id }]);

      if (onAddTask) {
        onAddTask(newTask);
      }
    } catch (error) {
      console.log(error);
    }

    setInputValue("");
    setTime("");
    setDate("");
  };

  return (
    <>
    <button onClick={authState}>auth</button>
      <Button onClick={open}>Add task</Button>

      <Modal
        opened={opened}
        onClose={close}
        size="70%"
        title="addingTask"
        centered
      >
        {
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
          </div>
        }
      </Modal>
    </>
  );
};

Sidebar.propTypes = {
  onAddTask: PropTypes.func.isRequired,
  onUpdateTasks: PropTypes.func,
};

export default Sidebar;
