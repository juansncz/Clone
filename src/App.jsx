import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Contacts from "./components/Contacts";
import Profile from "./components/Profile";
import './styles/App.css';
 

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Redirect root path '/' to '/login' */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/profile" element={<Profile />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
