import Navbar from "./navBar"
import { Outlet } from "react-router-dom";
import Sidebar from '../Components/Sidebar';

export default function Root() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <h1 className="HomePage">This is going to be the root</h1>
      <Outlet />
    </div>
  );
}