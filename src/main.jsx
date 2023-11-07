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
import ForgotPassword from "./routes/ForgotPassword";
/*import Sidebar from "./Components/Sidebar";*/

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  
    
    /*children: [
       {
        path: "sidebar", 
        element: <Sidebar /> 
      }
    ]*/
  },
  {
    path: "addfriend",
    element: <AddFriendPage />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "forgotpassword",
    element: <ForgotPassword />
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