import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");  // Added successMessage state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/api/auth/register`, {
        fullname,
        username,  // Sending username to the backend
        password,
      });
      setSuccessMessage("You have registered successfully!");  // Set the success message on successful registration
      setError(null);  // Clear any existing errors
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      setError("Error in registration");
      setSuccessMessage("");  // Clear any previous success message
    }
  };

  // Function to navigate back to login page
  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Register</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}  
        <form onSubmit={handleRegister}>
          <div className="form-field">
            <label>Full Name:</label>
            <input 
              type="text" 
              value={fullname} 
              onChange={(e) => setFullname(e.target.value)} 
              required 
            />
          </div>
          <div className="form-field">
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-field">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>

        <button onClick={handleBackToLogin} className="back-to-login-btn">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Register;
