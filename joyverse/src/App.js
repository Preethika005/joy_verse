import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HeroSection from "./HeroSection";
import WordPuzzleAdventure from "./WordPuzzleAdventure";
import MathGame from "./MathGame";
import Games from "./Games";
import Quiz from "./Quiz";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import TherapistDashboard from "./TherapistDashboard";
import WelcomePage from "./WelcomePage";
import LoginPages from "./demo";
import SyllableTapGame from "./SyllableTapGame";
import ShapeMemoryGame from "./ShapeMemoryGame";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/herosection" element={<HeroSection/>}/>
        <Route path="/" element={<Navigate to="/herosection" />} />
        <Route path="/wordpuzzleadventure" element={<WordPuzzleAdventure />} />
        <Route path="/mathgame" element={<MathGame />} />
        <Route path="/games" element={<Games/>}/>
        <Route path="/quiz" element={<Quiz/>}/>
        <Route path="/loginpage" element={<LoginPage/>}/>
        <Route path="/registerpage" element={<RegisterPage/>}/>
        <Route path="/therapistdashboard" element={<TherapistDashboard/>}/>
        <Route path="/welcomepage" element={<WelcomePage/>}/>
        <Route path="/loginpages" element={<LoginPages/>}/>
        <Route path="/syllabletapgame" element={<SyllableTapGame/>}/>
        <Route path="/shapememorygame" element={<ShapeMemoryGame/>}/>
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

