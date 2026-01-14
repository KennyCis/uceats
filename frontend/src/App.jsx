import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import logo from "./assets/logo-uceats.png";
import "./App.css";

function AuthPage() {
  const [activeForm, setActiveForm] = useState("login");

  return (
    
    <div className="auth-wrapper"> 
      <div className="auth-container">
        <img src={logo} alt="UCEats Logo" className="logo" style={{ width: "250px", marginBottom: "20px" }} /> 
        
        <p className="welcome-text">Welcome to the best university bar</p>

        <div className="tabs">
          <button
            className={`tab-btn ${activeForm === "login" ? "active" : ""}`}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeForm === "register" ? "active" : ""}`}
            onClick={() => setActiveForm("register")}
          >
            Register
          </button>
        </div>

        {activeForm === "login" ? <Login /> : <Register />}
      </div>

    </div> 
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rut Login/Register */}
        <Route path="/" element={<AuthPage />} />

        {/* Rut Home*/}
        <Route path="/home" element={<HomePage />} />

        {/*profile*/}
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
