import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Contacts.css";
import defaultAvatar from "/images/default.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';

const Contacts = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([
    { id: 1, image_url: "/images/image1.jpg", caption: "Beautiful view!" },
    { id: 2, image_url: "/images/image2.jpg", caption: "A serene sunset." },
    { id: 3, image_url: "/images/image3.jpg", caption: "A serene sunset." },
  ]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const stories = [
    { id: 1, username: "Ronald", avatar_url: "/images/image1.jpg" },
    { id: 2, username: "Eman", avatar_url: "/images/image3.jpg" },
    { id: 3, username: "Jopeth", avatar_url: "/images/image2.jpg" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decodedToken = jwtDecode(token);
        console.log(decodedToken);

        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/api/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // New handleLogout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // navigate to login page
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setModalShow(true);
    console.log('Selected user', user);
  };

  const handleDelete = async (id) => {
    const userIdToDelete = id || selectedUser?.user_id;

    if (!userIdToDelete) {
        console.error('User ID is missing');
        swal.fire('Error', 'User ID is missing', 'error');
        return;
    }

    const result = await swal.fire({
        title: 'Are you sure?',
        text: 'This action will permanently delete the user!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/api/users/${userIdToDelete}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            swal.fire('Deleted!', 'The user has been deleted.', 'success');
            setUsers(users.filter((user) => user.user_id !== userIdToDelete));
        } catch (error) {
            console.error('Error deleting user:', error);
            swal.fire('Error', 'There was an issue deleting the user.', 'error');
        }
    }
  };

  return (
    <div>
      <div className="header-bar">
        <div className="header-logo">Instagram</div>
        <div className="header-nav">
          <a href="#">Home</a>
          {/* Logout button */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-container">
        <div className="left-sidebar">
          <h3>Stories</h3>
          <div className="stories-container">
            {stories.map((story) => (
              <div key={story.id} className="story-item">
                <img
                  src={story.avatar_url || defaultAvatar}
                  alt={story.username}
                  className="story-avatar"
                />
                <p className="story-username">{story.username}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="middle-container">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <img src={post.image_url} alt="Post" className="post-image" />
              <p className="post-caption">{post.caption}</p>
            </div>
          ))}
        </div>

        <div className="right-sidebar">
          <div className="suggestions-container">
            <h3>Suggestions for You</h3>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              users.map((user) => (
                <div key={user.user_id} className="suggestion-item">
                  <img
                    src={user.avatar_url || defaultAvatar}
                    alt={user.username}
                    className="suggestion-avatar"
                  />
                  <div className="suggestion-info">
                    <p className="suggestion-username">{user.username}</p>
                    <button
                      className="view-btn"
                      onClick={() => handleViewProfile(user)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        centered
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div>
              <img
                src={selectedUser.avatar_url || defaultAvatar}
                alt={selectedUser.username}
                className="profile-avatar"
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
              <p>
                <strong>Full Name:</strong> {selectedUser.fullname || "N/A"}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username || "N/A"}
              </p>
              <p>
                <strong>User ID:</strong> {selectedUser.user_id || "N/A"}
              </p>
            </div>
          ) : (
            <p>Loading user details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedUser?.user_id)}
          >
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Contacts;
