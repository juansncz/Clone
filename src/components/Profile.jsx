import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";
import defaultAvatar from "/images/default.jpg";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([
    { id: 1, image_url: "/images/pic1.jpg"},
    { id: 2, image_url: "/images/pic2.jpg"},
    { id: 3, image_url: "/images/pic5.jpg"},
    { id: 4, image_url: "/images/pic6.jpg"},
    { id: 5, image_url: "/images/pic9.jpg"},
    { id: 6, image_url: "/images/pic3.jpg"},
    { id: 7, image_url: "/images/pic4.jpg"},
    { id: 8, image_url: "/images/pic7.jpg"},
    { id: 9, image_url: "/images/pic8.jpg"},
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);  // Log the decoded token for debugging

        // Corrected API endpoint for fetching current user's data
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/api/users/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("User Data Response:", response.data);  // Log the response to check if user data is returned

        // Find the user by matching user_id
        const loggedInUser = response.data.find(
          (user) => user.user_id === decodedToken.user_id
        );

        if (loggedInUser) {
          setUser(loggedInUser); // Set user state if found
        } else {
          console.error("Logged in user not found in the response.");
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUser();
  }, [navigate]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token to log out
    navigate("/login"); // Redirect to login page
  };

  // Navigate to the Contacts page
  const goHome = () => {
    navigate("/contacts");
  };

  return (
    <div className="profile-container">
      {/* Header Bar */}
      <div className="header-bar">
        <div className="header-logo">
          <img src="/instagram.png" alt="Instagram Logo" />
          InstaClone
        </div>
        <div className="header-nav">
          <a href="#" onClick={goHome}>Home</a> {/* Navigate to Contacts.jsx */}
          <button onClick={handleLogout}>Logout</button> {/* Navigate to Login.jsx */}
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-header">
        {/* User Avatar and Info */}
        <div className="profile-info">
          <img
            src={user?.avatar_url || defaultAvatar}
            alt="User Avatar"
            className="profile-avatar"
          />
          <div className="user-info">
            <h1>{user?.fullname || "Full Name not available"}</h1>
            <p>{user?.username || "Username not available"}</p>
            <p>ID: {user?.user_id || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="posts-container">
        <h2>Posts</h2>
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <img src={post.image_url} alt="Post" className="post-image" />
              <p className="post-caption">{post.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
