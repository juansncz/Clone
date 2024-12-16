import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Import updated Instagram-like styles

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in (token and userId in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    // If token and userId are found, redirect to contacts page
    if (token && userId) {
      navigate("/contacts");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const apiUrl = `${import.meta.env.VITE_API_ENDPOINT}/api/auth/login`;

    try {
      // Send login request to backend
      const response = await axios.post(apiUrl, { username, password });

      console.log("API Response:", response.data); // Debug log to check the response data

      if (response.status === 200) {
        console.log("Login successful:", response.data);

        // Store token and user_id in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user_id); // Assuming user_id is part of the response

        console.log("Stored Token:", localStorage.getItem("token")); // Debug log to check token stored in localStorage
        console.log("Stored user_id:", localStorage.getItem("user_id")); // Debug log for user_id

        // Navigate to contacts
        console.log("Navigating to /contacts...");
        navigate("/contacts");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Login failed:", error);

      // Handling errors based on response
      if (error.response) {
        // Errors with status code from server
        const { status, data } = error.response;

        if (status === 401) {
          setError("Invalid credentials. Please try again.");
        } else {
          setError(data?.message || `Server error: ${status}`);
        }
      } else if (error.request) {
        // Request was made but no response
        setError("No response from server. Please check your connection.");
      } else {
        // Any other unknown error
        setError("Unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Logo container */}
        <div className="logo-container">
          <img src="/instaclone.png" alt="Instagram Logo" className="login-logo" />
        </div>

        <h2 className="login-title">InstClone Login</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Log In</button>
        </form>

        <div className="signup-link">
          <p>
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
