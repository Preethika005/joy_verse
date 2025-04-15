import React, { useEffect, useState } from 'react';
import './TherapistDashboard.css';

const TherapistDashboard = () => {
  const [children, setChildren] = useState([]);

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

  return (
    <div className="table-container">
      <h2 className="table-title">Logged-in Children</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {children.map((child, index) => (
            <tr key={child._id}>
              <td>{index + 1}</td>
              <td>{child.username}</td>
              <td>{child.email}</td>
              <td>{child.isLoggedIn ? 'Logged In' : 'Logged Out'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TherapistDashboard;
