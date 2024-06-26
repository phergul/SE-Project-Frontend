// App.js
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import Login from "./routes/login";
import Root from "./routes/root";
import AddFriendPage from "./routes/addfriend";
import ErrorPage from "./error";
import ForgotPassword from "./routes/ForgotPassword";
import Calendar from "./Components/Calendar";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Navbar from "./routes/navBar";

// Assuming your main application component is named App

// Define your router outside of the App component if it doesn't need to use props
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "addfriend",
    element: <AddFriendPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "forgotpassword",
    element: <ForgotPassword />,
  },
  // Assuming you want Calendar and Sidebar to be rendered together under a specific route
  {
    path: "calendar",
    element: <CalendarPage />, // This will be a new component wrapping Calendar and Sidebar
  },
]);

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div className="app">
      <Navbar onAddTask={addTask} />
      <Calendar tasks={[]} />
    </div>
  );
}

export default App;

function CalendarPage() {
  return (
    <div>
      <Navbar />
      <Calendar />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);
