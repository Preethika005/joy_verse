import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import "./TherapistDashboard.css";

const Search = ({ className = "", size = 48 }) => {
  return (
    <div className={`search ${className}`} data-size={size}>
      <img className="icon" loading="lazy" alt="" src="/icon.svg" />
    </div>
  );
};

const AddChildArea = ({ onAddChild }) => {
  const [child, setChild] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!child.name || !child.username || !child.password) {
      setError("All fields are required.");
      return;
    }

    setError("");
    try {
      await onAddChild(child);
      setChild({ name: "", username: "", password: "" });
      setSuccess("Child added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add child.");
    }
  };

  return (
    <section className="add-child-area">
      <form className="add-child-button-area-parent" onSubmit={handleSubmit}>
        <button type="submit" className="add-child-button-area">
          <div className="addchildbutton">
            <div className="addchildtext">
              <div className="add-child">Add Child</div>
            </div>
          </div>
        </button>
        <div className="addchildform">
          <div className="username">
            <input
              className="username1"
              placeholder="Username"
              type="text"
              value={child.username}
              onChange={(e) => setChild({ ...child, username: e.target.value })}
            />
          </div>
          <div className="childname">
            <input
              className="childs-name"
              placeholder="Child’s Name"
              type="text"
              value={child.name}
              onChange={(e) => setChild({ ...child, name: e.target.value })}
            />
          </div>
          <div className="username">
            <input
              className="password1"
              placeholder="Password"
              type="text"
              value={child.password}
              onChange={(e) => setChild({ ...child, password: e.target.value })}
            />
          </div>
          <button type="submit" className="addchildbutton2">
            <div className="add-child1">Add Child</div>
          </button>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
        </div>
      </form>
    </section>
  );
};

const ChildrenTableArea = ({ children, onViewDetails }) => {
  return (
    <section className="children-table-area">
      <div className="childrentable">
        <div className="tableheader">
          <div className="sno">S.no</div>
          <div className="name">Name</div>
          <div className="name">Username</div>
          <div className="name">Actions</div>
        </div>
        <div className="rowcontainer">
          {children.length === 0 ? (
            <div className="row">
              <div className="name" style={{ gridColumn: "span 4", textAlign: "center" }}>
                No children found.
              </div>
            </div>
          ) : (
            children.map((child, index) => (
              <div className="row" key={child._id}>
                <div className="sno">{index + 1}.</div>
                <div className="name">{child.name}</div>
                <div className="name">{child.username}</div>
                <button className="viewdetailsbutton" onClick={() => onViewDetails(child.username)}>
                  <div className="viewdetailstext">
                    <div className="view-details">View Details</div>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const EmotionTimelineChart = ({ expressions }) => {
  const series = expressions.map((exp) => ({
    x: exp.expression,
    y: [new Date(exp.timestamp).getTime(), new Date(exp.timestamp).getTime() + 1000]
  }));

  const options = {
    chart: { type: "rangeBar", height: 150, toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, barHeight: "60%" } },
    xaxis: {
      type: "datetime",
      labels: { datetimeFormatter: { second: "HH:mm:ss" } }
    },
    title: { text: "Emotion Timeline", align: "left", style: { fontSize: "14px" } }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <ReactApexChart options={options} series={[{ data: series }]} type="rangeBar" height={150} />
    </div>
  );
};

const TherapistDashboard = () => {
  const [children, setChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const therapistId = localStorage.getItem("therapistId");

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "hidden";
    };
  }, []);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/children", {
          headers: { "therapist-id": therapistId }
        });
        setChildren(res.data);
      } catch (err) {
        console.error("Error fetching children", err);
      }
    };

    if (therapistId) fetchChildren();
  }, [therapistId]);

  const handleAddChild = async (childData) => {
    const res = await axios.post("http://localhost:4000/api/children", {
      ...childData,
      therapistId
    });
    setChildren((prev) => [...prev, res.data]);
  };

  const handleViewDetails = async (username) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/sessions?username=${username}`);
      setSelectedSessions(res.data);
      const child = children.find((c) => c.username === username);
      setSelectedChild(child);
    } catch (err) {
      console.error("Error fetching sessions", err);
    }
  };

  const filteredChildren = children.filter(
    (child) =>
      child.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="therapistdashboard">
      <header className="header">
        <div className="welcometext">
          <h3 className="welcome-back-therapist">Welcome Back, Therapist!</h3>
          <div className="logged-in-children">Logged-in Children</div>
        </div>
      </header>
      <main className="main-content">
        <section className="search-area">
          <div className="searchbarcontainer-wrapper">
            <div className="searchbarcontainer">
              <div className="searchbar">
                <input
                  type="text"
                  placeholder="Search By Name or Username"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="searchbutton">
                <Search size={48} />
              </div>
            </div>
          </div>
          <AddChildArea onAddChild={handleAddChild} />
          <ChildrenTableArea children={filteredChildren} onViewDetails={handleViewDetails} />

          {selectedChild && (
            <div className="game-session-area">
              <b className="game-sessions-for">
                Game Sessions for {selectedChild.name}:
              </b>
              {selectedSessions.map((session, index) => (
                <div key={session._id} className="gamesessioncard">
                  <div className="gamesessiondata">
                    <div className="session-num-game-difficul-container">
                      <p className="session-num-game-difficul">
                        Session {index + 1}: {session.gameName} — Difficulty: {session.difficulty}
                      </p>
                      <p className="session-num-game-difficul">
                        Start: {new Date(session.startTime).toLocaleString()}
                      </p>
                      <p className="session-num-game-difficul">
                        End: {new Date(session.endTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="emotion-timeline">Emotion Timeline:</div>
                    <EmotionTimelineChart expressions={session.expressions} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="footer">
        <h2 className="joyverse">JoyVerse</h2>
      </footer>
    </div>
  );
};

export default TherapistDashboard;
