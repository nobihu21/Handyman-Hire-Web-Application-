import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Hardcoded credentials for demo
    const validCredentials = [
      { email: "admin@handyman.com", password: "admin123", userType: "admin" },
      {
        email: "customer@test.com",
        password: "customer123",
        userType: "customer",
      },
      {
        email: "handyman@test.com",
        password: "handyman123",
        userType: "handyman",
      },
      { email: "test@example.com", password: "test123", userType: "customer" },
    ];

    const user = validCredentials.find(
      (cred) =>
        cred.email === formData.email && cred.password === formData.password
    );

    if (user) {
      // Store user data in localStorage
      localStorage.setItem("token", "demo-token-" + Date.now());
      localStorage.setItem("userType", user.userType);
      localStorage.setItem("userEmail", user.email);

      // Check if user came from services page
      const fromServices = sessionStorage.getItem("fromServices");
      if (fromServices) {
        sessionStorage.removeItem("fromServices");
        navigate("/services");
      } else {
        // Redirect to home
        navigate("/");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <Card.Body>
            <h2 className="text-center mb-4">Welcome Back</h2>
            <p className="text-center text-muted mb-4">
              Sign in to your account
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Sign In
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="mb-0">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/register")}
                  className="p-0"
                >
                  Create one here
                </Button>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Login;
