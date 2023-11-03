import Navbar from "./navBar"
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <Navbar />
      <h1 className="HomePage">This is going to be the root</h1>
      <Outlet />
    </div>
  );
}