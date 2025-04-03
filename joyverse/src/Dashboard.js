import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Welcome!!</h1>
      <p>Select your role to continue</p>
      <div className="dashboard-options">
        <div className="dashboard-card" onClick={() => navigate("/child-login")}>
          <img src="/images/child.jpg" alt="Child" />
          <h3>Child Dashboard</h3>
        </div>
        <div className="dashboard-card" onClick={() => navigate("/therapist-login")}>
          <img src="/images/therapist.jpg" alt="Therapist" />
          <h3>Therapist Dashboard</h3>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
