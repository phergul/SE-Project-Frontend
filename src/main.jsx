import ReactDOM from 'react-dom/client';
import './styles.css';
import UsernameForm from './searchUsername.jsx';
import Navbar from './navBar.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <div>
    <Navbar />
    <UsernameForm/>
  </div>,
);
