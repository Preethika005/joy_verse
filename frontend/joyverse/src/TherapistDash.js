import React, { useEffect, useState } from 'react';
import './TherapistDashboard.css';
import axios from 'axios';

const TherapistDashboard = () => {
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [child, setChild] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/children");
        const data = await response.json();

        // Log the data to check its structure
        console.log("Fetched children:", data);

        setChildren(data);
      } catch (err) {
        console.error("Failed to fetch children:", err);
      }
    };

    fetchChildren();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChild({ ...child, [name]: value });
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/children', child);
      setError('');
      alert('Child added successfully!');
      setChild({ name: '', username: '', password: '' });
      setShowAddChildForm(false);
    } catch (err) {
      setError('Error adding child');
    }
  };

  const filteredChildren = children.filter(child =>
    child.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2 className="welcome-therapist">Welcome back, Therapist!</h2>
      <h2 className="dashboard-title">Logged-in Children</h2>

      <input
        type="text"
        placeholder="Search by Name or Username..."
        className="search-bar"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button 
        onClick={() => setShowAddChildForm(!showAddChildForm)} 
        className="add-child-btn"
      >
        {showAddChildForm ? 'Cancel' : 'Add Child'}
      </button>

      {showAddChildForm && (
        <div className="add-child-form-container">
          <h3>Add Child</h3>
          <form onSubmit={handleAddChild} className="add-child-form">
            <input
              type="text"
              name="name"
              value={child.name}
              onChange={handleInputChange}
              placeholder="Child's Name"
              required
              className="form-input"
            />
            <input
              type="text"
              name="username"
              value={child.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
              className="form-input"
            />
            <input
              type="password"
              name="password"
              value={child.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="form-input"
            />
            <button type="submit" className="submit-btn">Add Child</button>
          </form>
          {error && <p className="error-msg">{error}</p>}
        </div>
      )}

      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredChildren.map((child, index) => (
            <tr key={child._id}>
              <td>{index + 1}</td>
              <td>{child.name}</td> {/* Display Name */}
              <td>{child.username}</td> {/* Display Username */}
              <td>
                <button className="action-btn">View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TherapistDashboard;
