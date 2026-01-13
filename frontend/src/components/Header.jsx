import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
// Usa el logo que ya tienes
import logo from "../assets/logo-uceats.png"; 

function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const headerStyle = {
    height: "80px",
    backgroundColor: "var(--white)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
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
    boxSizing: "border-box"
  };

  return (
    <header style={headerStyle}>
      {/* Lado Izquierdo: Escudo UCE + Nombre */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <img src={logo} alt="Logo" style={{ height: "45px" }} />
        <div>
            <h3 style={{ margin: 0, color: "var(--primary-dark)" }}>UCEats Admin</h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Universidad Central del Ecuador</span>
        </div>
      </div>

      {/* Lado Derecho: Perfil */}
      <div style={{ position: "relative" }}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 15px", borderRadius: "30px", backgroundColor: "#F7FAFC" }}
        >
          <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "var(--primary-dark)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FiUser />
          </div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>Admin</span>
          <FiChevronDown />
        </button>

        {/* Menú Flotante */}
        <div style={dropdownStyle}>
            <button style={itemStyle} className="hover-btn">Profile</button>
            <div style={{ height: "1px", backgroundColor: "#eee", margin: "5px 0" }}></div>
            <button 
                onClick={() => navigate("/")} 
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