import { useState } from 'react';
import './LoginSignup.css';
import { signUP } from '../scripts/auth.js';
import { getFunctions, httpsCallable } from "firebase/functions";
const functions = getFunctions();

const LoginSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //signUP function from scripts folder
    signUP(formData.email, formData.password, formData.username);
  };

  const click = () => {
    const createTask = httpsCallable(functions, 'createTask');
    const data = {
          title: "task1test",
          description: "This is a test for the createTask function",
          startDate: "January 30, 2024",
          endDate: "February 2, 2024"
    }
    console.log(JSON.stringify(data));
    createTask(JSON.stringify(data))
    .then((res) => {
      console.log(res);
    })
  }

  return (
    <div className="login-signup-box">
      <h1 className="login-signup-header">Sign Up</h1>
      <form onSubmit={handleSubmit}>

        <div className="inputs">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            name="username" 
            id="username"
            value={formData.username}
            onChange={handleChange} 
          />

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            value={formData.email}
            onChange={handleChange} 
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password" 
            id="password"
            value={formData.password}
            onChange={handleChange} 
          />
        </div>

        <div className="forgot-password">
          Forgot Password? <span>Click here!</span>
        </div>

        <div className="submit-btns">
          <button type="submit" className="submit">Sign Up</button>
        </div>

        <div>
          <button onClick={click}>test callable</button>
        </div>

      </form>
    </div>
  );
};

export default LoginSignup;
