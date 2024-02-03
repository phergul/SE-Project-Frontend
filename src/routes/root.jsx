import { useState } from "react";
import { Outlet } from "react-router-dom";
import Calendar from "../Components/Calendar";
import Sidebar from "../Components/Sidebar";
import Navbar from "./navBar";

export default function Root() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  return (
    <div>
      <Navbar />
      <Sidebar onAddTask={handleAddTask} />
      <Calendar tasks={tasks} />
      <h1 className="HomePage">This is going to be the root</h1>
      <Outlet />
    </div>
  );
}
