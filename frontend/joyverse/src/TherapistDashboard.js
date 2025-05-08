import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import './TherapistDashboard.css';

const EmotionTimelineChart = ({ expressions }) => {
  const series = expressions.map((exp, idx) => ({
    x: exp.expression,
    y: [
      new Date(exp.timestamp).getTime(),
      new Date(exp.timestamp).getTime() + 1000 // 1 second duration
    ]
  }));

  const options = {
    chart: {
      type: 'rangeBar',
      height: 150,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%'
      }
    },
    xaxis: {
      type: 'datetime',
      labels: { datetimeFormatter: { second: 'HH:mm:ss' } }
    },
    title: {
      text: 'Emotion Timeline',
      align: 'left',
      style: { fontSize: '14px' }
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <ReactApexChart options={options} series={[{ data: series }]} type="rangeBar" height={150} />
    </div>
  );
};

const TherapistDashboard = () => {
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [child, setChild] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [selectedChildSessions, setSelectedChildSessions] = useState([]);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [sessionError, setSessionError] = useState('');

  const therapistId = localStorage.getItem("therapistId");

  useEffect(() => {
    const fetchChildren = async () => {
      if (!therapistId) {
        setError('Therapist ID is missing');
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/children", {
          headers: { 'therapist-id': therapistId }
        });
        setChildren(response.data);
      } catch (err) {
        setError('Failed to fetch children');
      }
    };

    fetchChildren();
  }, [therapistId]);

  const handleViewDetails = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sessions?username=${username}`);
      setSelectedChildSessions(response.data);
      setShowSessionDetails(true);
    } catch (err) {
      setSessionError('Failed to fetch game sessions');
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
          <form className="add-child-form">
            <input type="text" name="name" placeholder="Child's Name" className="form-input" />
            <input type="text" name="username" placeholder="Username" className="form-input" />
            <input type="password" name="password" placeholder="Password" className="form-input" />
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
              <td>{child.name}</td>
              <td>{child.username}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => handleViewDetails(child.username)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showSessionDetails && (
        <div className="session-details">
          <h3>Game Sessions for {filteredChildren.find(c => c.username === selectedChildSessions[0]?.username)?.name}</h3>
          {sessionError && <p className="error-msg">{sessionError}</p>}

          {selectedChildSessions.map((session, index) => (
            <div key={session._id} className="session-block">
              <h4>Session {index + 1}: {session.gameName} ({session.difficulty})</h4>
              <p><strong>Start:</strong> {new Date(session.startTime).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(session.endTime).toLocaleString()}</p>
              <EmotionTimelineChart expressions={session.expressions} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TherapistDashboard;
