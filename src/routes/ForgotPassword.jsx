// ForgotPassword.jsx
import { useState } from 'react';
import '../LoginSignup.css'


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
   
    setEmailSent(true);
  };

  if (emailSent) {
    return <p>An email has been sent to {email} with instructions to reset your password.</p>;
  }

  return (
    <div className="forgot-password-page">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="account-email">Enter account email:</label>
        <input
          type="email"
          id="account-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
