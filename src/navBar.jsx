import './styles.css'; // Import the CSS file

function Navbar() {
  return (
    <nav className="nav-bar">
      <div className="nav-title"></div>
      <ul className="nav-links">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#"> Tasks</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
