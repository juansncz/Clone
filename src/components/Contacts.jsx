import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Contacts.css";

const Contacts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false); // For showing/hiding logout button
  const [isModalOpen, setIsModalOpen] = useState(false); // To handle profile modal
  const [user, setUser] = useState(null); // To hold current user details
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
        }

        const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle showing user profile and modal
  const handleProfileClick = (userData) => {
    setUser(userData); // Set selected user to show profile
    setIsModalOpen(true); // Open profile modal
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="contacts-container">
      {/* Settings Button */}
      <div className="settings-container">
        <button
          className="settings-button"
          onClick={() => setShowLogout(!showLogout)}
        >
          <i className="fas fa-cogs"></i> {/* Settings icon */}
        </button>
        {/* Logout Button appears when Settings is clicked */}
        {showLogout && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <h2>Contacts</h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <ul className="contacts-list">
          {users.map((userData) => (
            <li key={userData.user_id} className="contact-item" onClick={() => handleProfileClick(userData)}>
              <div className="contact-avatar">
                <img src={userData.avatar_url || "https://via.placeholder.com/50"} alt={userData.fullname} />
              </div>
              <div className="contact-info">
                <p className="contact-name">{userData.fullname}</p>
                <p className="contact-username">{userData.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for displaying profile information */}
      {isModalOpen && user && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <span className="close-btn" onClick={() => setIsModalOpen(false)}>
              ×
            </span>
            <h2>{user.fullname}'s Profile</h2>
            <div className="profile-info">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
