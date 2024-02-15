import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginSignup.css";
import "../routes/ForgotPassword";

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(false);

  const handleForgotPassword = () => {
    navigate("/ForgotPassword");
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="login-signup-box">
      <h1 className="login-signup-header"></h1>
      <form>
        {/* Include username only if it's sign-up view */}
        {!isLoginView && (
          <div className="inputs">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" />
          </div>
        )}

        <div className="inputs">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>

        <div className="inputs">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>

        <div className="forgot-password">
          Forgot Password?{" "}
          <span onClick={handleForgotPassword}>Click here!</span>
        </div>

        <div className="submit-btns">
          <button type="submit" className="submit"></button>
          {/* Toggle between views */}
          <button
            type="button"
            onClick={toggleView}
            className="toggle-view"
          ></button>
        </div>
      </form>
    </div>
  );
};

export default LoginSignup;
