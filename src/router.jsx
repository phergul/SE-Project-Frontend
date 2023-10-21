import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./Layout";
import { IndexRoute } from "./routes/IndexRoute";
import { OtherRoute } from "./routes/OtherRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <IndexRoute /> },
      { path: "other-route", element: <OtherRoute /> },
    ],
  },
]);