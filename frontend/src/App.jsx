import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import logo from "./assets/logo-uceats.png";
import "./App.css";

function App() {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <div className="auth-container">
      <img
        src={logo}
        alt="UCEats Logo"
        style={{
          width: "250px",       
          height: "auto",       
          display: "block",    
          margin: "0 auto 20px" 
        }}
      />
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
  );
}

export default App;
