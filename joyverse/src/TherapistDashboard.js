import React, { useEffect, useState } from 'react';
import './TherapistDashboard.css';

const TherapistDashboard = () => {
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/children");
        const data = await response.json();
        setChildren(data);
      } catch (err) {
        console.error("Failed to fetch children:", err);
      }
    };

    fetchChildren();
  }, []);
  useEffect(() => {
      // Enable scrolling when this page is open
      document.body.style.overflow = "auto";
    
      // When leaving this page, disable scrolling again
      return () => {
        document.body.style.overflow = "hidden";
      };
    }, []);
  const filteredChildren = children.filter(child =>
    child.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    
    <div className="dashboard-container">
      <h2 className="welcome-therapist">
  Welcome back, Therapist!
</h2>
      <h2 className="dashboard-title">Logged-in Children</h2>

      <input
        type="text"
        placeholder="Search by Name or Email..."
        className="search-bar"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredChildren.map((child, index) => (
            <tr key={child._id}>
              <td>{index + 1}</td>
              <td>{child.username}</td>
              <td>{child.email}</td>
              <td>
                <button className="action-btn">View Details</button>
                {/* <button className="action-btn">Message</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TherapistDashboard;
