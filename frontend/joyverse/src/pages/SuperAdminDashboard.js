import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  const [therapists, setTherapists] = useState([]);
  const [form, setForm] = useState({ therapistId: '', name: '', username: '', password: '' });
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  const fetchTherapists = async () => {
    const res = await axios.get("http://localhost:4000/api/superadmin/therapists-with-children");
    setTherapists(res.data);
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  const handleAddTherapist = async () => {
    await axios.post("http://localhost:4000/api/superadmin/therapists", form);
    setForm({ therapistId: '', name: '', username: '', password: '' });
    setShowForm(false); // Hide form after adding
    fetchTherapists();
  };

  return (
    <div className="superadmin-dashboard-container">
      <h2 className="superadmin-dashboard-title">SuperAdmin Dashboard</h2>

      {!showForm && (
        <button className="superadmin-form-button" onClick={() => setShowForm(true)}>
          Add Therapist
        </button>
      )}

      {showForm && (
        <div className="superadmin-form-container">
          <input
            className="superadmin-form-input"
            placeholder="Therapist ID"
            value={form.therapistId}
            onChange={(e) => setForm({ ...form, therapistId: e.target.value })}
          />
          <input
            className="superadmin-form-input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="superadmin-form-input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="superadmin-form-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="superadmin-form-button-group">
            <button className="superadmin-form-button" onClick={handleAddTherapist}>
               Submit
            </button>
            <button className="superadmin-form-button cancel" onClick={() => setShowForm(false)}>
               Cancel
            </button>
          </div>
        </div>
      )}

      <h3 className="superadmin-section-title">All Therapists and Their Children</h3>
      {therapists.map((entry, index) => (
        <div key={index} className="superadmin-therapist-card">
          <h4 className="superadmin-therapist-name">
             {entry.therapist.name} ({entry.therapist.username})
          </h4>
          <p className="superadmin-therapist-id">
            Therapist ID: {entry.therapist.therapistId}
          </p>
          {entry.children.length > 0 ? (
  <ol className="superadmin-child-list">
    {entry.children.map((child, idx) => (
      <li key={child._id} className="superadmin-child-item">
        {child.name} ({child.username})
      </li>
    ))}
  </ol>
) : (
  <p className="superadmin-child-item">No children registered</p>
)}
        </div>
      ))}
    </div>
  );
};

export default SuperAdminDashboard;
