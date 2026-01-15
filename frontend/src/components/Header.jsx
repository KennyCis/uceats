import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import uceatsLogo from "../assets/logo-uceats.png"; 
import uceLogo from "../assets/logo-uce.png"; 
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);

  // --- STYLES ---
  const headerStyle = {
    height: "80px",
    backgroundColor: "var(--white)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px", // Global padding
    position: "sticky",
    top: 0,
    zIndex: 40,
    boxShadow: "var(--shadow-soft)"
  };

  const dropdownStyle = {
    position: "absolute",
    top: "70px",
    right: "0",
    backgroundColor: "white",
    width: "200px",
    borderRadius: "12px",
    boxShadow: "var(--shadow-card)",
    padding: "8px",
    display: isOpen ? "block" : "none",
    border: "1px solid #f0f0f0"
  };

  const itemStyle = {
    padding: "10px 15px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "var(--text-main)",
    borderRadius: "8px",
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    background: "none",
    cursor: "pointer",
    textAlign: "left"
  };

  // Helper style for the 3 columns layout
  const sectionStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center"
  };

  return (
    <header style={headerStyle}>
      
      {/* 1. LEFT SECTION: UCE Logo */}
      <div style={{ ...sectionStyle, justifyContent: "flex-start" }}>
        <img 
            src={uceLogo} 
            alt="UCE Logo" 
            // Added marginLeft to separate it from the edge
            style={{ height: "50px", objectFit: "contain", marginLeft: "20px" }} 
        />
      </div>

      {/* 2. CENTER SECTION: UCEats Logo (Centered) */}
      <div style={{ ...sectionStyle, justifyContent: "center" }}>
        <img 
            src={uceatsLogo} 
            alt="UCEats Logo" 
            style={{ height: "60px", objectFit: "contain" }} 
        />
      </div>

      {/* 3. RIGHT SECTION: User Profile */}
      <div style={{ ...sectionStyle, justifyContent: "flex-end", position: "relative" }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 15px", borderRadius: "30px", backgroundColor: "#F7FAFC", border: "none", cursor: "pointer" }}
        >
          {/* PROFILE PHOTO */}
          <div style={{ width: "35px", height: "35px", borderRadius: "50%", overflow: "hidden", backgroundColor: "var(--primary-dark)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {user && user.image ? (
                <img 
                  src={user.image} 
                  alt="Profile" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
            ) : (
                <FiUser /> 
            )}
          </div>
          
          {/* USER NAME */}
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>
            {user ? user.name : "Guest"} 
          </span>
          
          <FiChevronDown />
        </button>

        {/* Dropdown Menu */}
        <div style={dropdownStyle}>
            <button 
                onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                }}
                style={itemStyle} 
                className="hover-btn"
            >
                <FiUser style={{ marginRight: "10px" }} /> 
                Profile
            </button>
            
            <div style={{ height: "1px", backgroundColor: "#eee", margin: "5px 0" }}></div>
            
            <button 
                onClick={() => {
                    logout(); 
                    navigate("/");
                }} 
                style={{ ...itemStyle, color: "var(--accent-red)" }}
            >
                <FiLogOut style={{ marginRight: "10px" }} /> Logout
            </button>
        </div>
      </div>

    </header>
  );
}

export default Header;