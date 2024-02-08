import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginSignup.css';
import '../routes/ForgotPassword';
import { signIN, signUP } from '../scripts/auth';

const LoginSignup = () => {
  
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(false); 
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoginView) 
    {
      try {
        await signIN(formData.email, formData.password);
      } catch (error) {
        console.error("Sign in failed:", error);
      }
    } 
    else 
    {
      try {
        await signUP(formData.email, formData.password, formData.username);
      } catch (error) {
        console.error("Sign up failed:", error);
      }
    }
  };        

  const handleForgotPassword = () => {
    navigate("/ForgotPassword");
  }

  const toggleView = () => {
    setIsLoginView(!isLoginView); 
  };

  return (
    <div className="login-signup-box">
      <h1 className="login-signup-header">{isLoginView ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={handleSubmit}>

        {/* Include username only if it's sign-up view */}
        {!isLoginView && (
          <div className="inputs">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              name="username" 
              id="username"
              value={formData.username}
              onChange={handleChange} 
            />
          </div>
        )}

        <div className="inputs">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            value={formData.email}
            onChange={handleChange} 
          />
        </div>

        <div className="inputs">
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
          Forgot Password? <span onClick={handleForgotPassword}>Click here!</span>
        </div>

        <div className="submit-btns">
          <button type="submit" className="submit">{isLoginView ? 'Login' : 'Sign Up'}</button>
          {/* Toggle between views */}
          <button type="button" onClick={toggleView} className="toggle-view">
            {isLoginView ? 'Create an account' : 'Have an account? Login'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default LoginSignup;

