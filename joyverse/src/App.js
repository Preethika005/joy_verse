import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChildRegister from "./ChildRegister";
import ChildLogin from "./ChildLogin";
import TherapistRegister from "./TherapistRegister";
import TherapistLogin from "./TherapistLogin";
import Dashboard from "./Dashboard";  
import "./App.css";
import FaceMeshPage from "./FaceMeshPage";
import WordPuzzleAdventure from "./WordPuzzleAdventure";
import MathGame from "./MathGame";
import Games from "./Games";
import Quiz from "./Quiz";
import HeroSection from "./HeroSection";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/child-register" element={<ChildRegister />} />
        <Route path="/child-login" element={<ChildLogin />} />
        <Route path="/therapist-register" element={<TherapistRegister />} />
        <Route path="/therapist-login" element={<TherapistLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wordpuzzleadventure" element={<WordPuzzleAdventure />} />
        <Route path="/mathgame" element={<MathGame />} />
        <Route path="/games" element={<Games/>}/>
        <Route path="/quiz" element={<Quiz/>}/>
        <Route path="/herosection" element={<HeroSection/>}/>
        <Route path="*" element={<h1>Page Not Found</h1>} />

<Route path="/face-mesh" element={<FaceMeshPage />} />
      </Routes>
    </Router>
  );
}

export default App;

