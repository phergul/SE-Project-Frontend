// ForgotPassword.jsx
import { useState } from 'react';
import '../LoginSignup.css'
import { useNavigate } from 'react-router-dom';
import '../routes/login';
import '../LoginSignup.css';
import {Anchor, Box, Button, Center, Container, Group, Paper, rem, TextInput, Text, Title} from "@mantine/core";
import { IconArrowLeft } from '@tabler/icons-react';
import LoginSignup from "../Components/LogninSignup.jsx";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../config/firebase.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    sendPasswordResetEmail(auth, email)
    .then(() => {
      setEmailSent(true);
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
    });
    
    setEmailSent(true);
  };

  if (emailSent) {
    return <p>An email has been sent to {email} with instructions to reset your password.</p>;
  }

  
  const handleBackButton = () => {
    navigate("/login");
  }

  return (

          <Container size={460} my={30}>
            <Title className={LoginSignup.title} ta="center">
              Forgot your password?
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
              Enter your email to get a reset link
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
              <TextInput
                  label="Your email"
                  type="email"
                  id="account-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@email.com"
                  required
              />

              <Group justify="space-between" mt="lg" className={LoginSignup.controls}>
                <Anchor c="dimmed" size="sm" className={LoginSignup.control}>
                  <Center inline>
                    <IconArrowLeft style={{ width: rem(12), height: rem(12) }} stroke={1.5} type="back" onClick={handleBackButton} />
                    <Box ml={5} onClick={handleBackButton}>Back to the login page</Box>
                  </Center>
                </Anchor>
                <Button className={LoginSignup.control}>Reset password</Button>
              </Group>
            </Paper>
          </Container>

/*    <div className="forgot-password-page">
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
        <button type="submit" onClick={emailSent}>Submit</button>
        <button type="back" onClick={handleBackButton}>Back</button>
      </form>
    </div>*/
  );
};

export default ForgotPassword;
