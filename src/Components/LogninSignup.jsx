import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../LoginSignup.css";
import "../routes/ForgotPassword";
import { signUP, signIN, signOUT } from "../scripts/auth";
import {
  TextInput, PasswordInput, Checkbox, Anchor,
  Paper, Title, Text, Container, Group, Button,
} from '@mantine/core';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoginView) {
      try {
        await signIN(formData.email, formData.password);

        navigate("../components/Calendar");
      } catch (error) {
        console.error("Sign in failed:", error);
      }
    } else {
      try {
        await signUP(formData.email, formData.password, formData.username);

        navigate("../components/Calendar");
      } catch (error) {
        console.error("Sign up failed:", error);
      }
    }
  };

  const handleForgotPassword = () => {
    navigate("/ForgotPassword");
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
      /* Updated Login/Signup Page */
      <Container size={420} my={40}>
        <Button onClick={signOUT}>Sign Out</Button>
        <Title ta="center" className={LoginSignup.title}>
          {isLoginView ? "Login" : "Create Account"}
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          {isLoginView ? "Do not have an account yet? " : "Have an account? "}
          <Anchor size="sm" component="button" onClick={toggleView}>
            {isLoginView ? "Create account " : "Login"}
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleSubmit}>
            {!isLoginView && (
                <TextInput
                    label="Username"
                    name="username"
                    id="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    mt="md"
                />)}

            <TextInput
                label="Email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                mt="md"
            />

            <PasswordInput
                label="Password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
                mt="md"
            />

            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me"/>
              <Anchor component="button" type="button" size="sm" onClick={handleForgotPassword}>
                Forgot password?
              </Anchor>
            </Group>


            <Button fullWidth mt="xl" type="submit">
              {isLoginView ? "Sign in" : "Sign Up"}
            </Button>

          </form>
        </Paper>

      </Container>
  );
}
export default LoginSignup;

/* Old Code***
    <div className="login-signup-box">
      <button onClick={signOUT}>signOut</button>
      <h1 className="login-signup-header">
        {isLoginView ? "Login" : "Sign Up"}
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Include username only if it's sign-up view */
  /*      {!isLoginView && (
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
          Forgot Password?{" "}
          <span onClick={handleForgotPassword}>Click here!</span>
        </div>

        <div className="submit-btns">
          <button type="submit" className="submit">
            {isLoginView ? "Login" : "Sign Up"}
          </button>
          {/* Toggle between views */
 /*         <button type="button" onClick={toggleView} className="toggle-view">
            {isLoginView ? "Create an account" : "Have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
};*/
