import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <header className="header">
        <h1>My App</h1>
        <Link to="/">Home</Link>
        <Link to="/other-route">Other Page</Link>
      </header>

      <hr />

      <main>
        <Outlet />
      </main>
    </div>
  );
}