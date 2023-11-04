import "../styles.css"
import { Link } from 'react-router-dom'


function Navbar() {
  return (
    <nav className="nav-bar">
      <div className="nav-title"></div>
      <ul className="nav-links">
        <Link to="/addfriend">Add Friend</Link>
        <Link to="/login">Login</Link>
      </ul>
    </nav>
  );
}

export default Navbar;
