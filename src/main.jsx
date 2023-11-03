import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider, 
} from "react-router-dom";
import Login from "./routes/login";
import Root from "./routes/root";
import AddFriendPage from "./routes/addfriend";
import ErrorPage from "./error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "addfriend",
    element: <AddFriendPage />
  },
  {
    path: "login",
    element: <Login />
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

  // children: [
    //   {path: "addfriend", element: <AddFriendPage />,}
    // ]